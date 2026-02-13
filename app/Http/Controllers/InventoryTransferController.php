<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransfer;
use App\Models\Product;
use App\Models\InventoryTransferHistory;
use App\Models\Stock;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transfers = InventoryTransfer::with(['fromStore', 'toStore', 'items.product', 'user'])
            ->latest()
            ->get();

        return Inertia::render('InventoryTransfers/Index', [
            'transfers' => $transfers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    $stores = Store::all();
    $products = Product::with([
        'combinations.combinationAttributeValue.attributeValue.attribute',
        'stocks',                     // <-- stocks de productos simples
        'combinations.stocks'          // <-- stocks de combinaciones
    ])->get();

    return Inertia::render('InventoryTransfers/Create', [
        'stores' => $stores,
        'products' => $products,
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'from_store_id' => 'required|exists:stores,id',
            'to_store_id' => 'required|exists:stores,id|different:from_store_id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.combination_id' => 'nullable|exists:combinations,id',
            'items.*.requested_quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $user) {
            $transfer = InventoryTransfer::create([
                'company_id' => $user->company_id,
                'from_store_id' => $validated['from_store_id'],
                'to_store_id' => $validated['to_store_id'],
                'user_id' => $user->id,
                'status' => 'pending',
                'reference_number' => 'TRF-' . strtoupper(uniqid()),
            ]);

            foreach ($validated['items'] as $item) {
                $transfer->items()->create([
                    'product_id' => $item['product_id'],
                    'combination_id' => $item['combination_id'],
                    'requested_quantity' => $item['requested_quantity'],
                ]);
            }

            // Log history
            $transfer->histories()->create([
                'status' => 'pending',
                'user_id' => $user->id,
                'notes' => 'Transferencia iniciada con ' . count($validated['items']) . ' productos',
            ]);

            return redirect()->route('inventory-transfers.show', $transfer)->with('success', 'Transferencia creada correctamente');
        });
    }


    /**
     * Display the specified resource.
     */
    public function show(InventoryTransfer $inventoryTransfer)
    {
        $inventoryTransfer->load([
            'fromStore', 
            'toStore', 
            'items.product', 
            'items.combination.combinationAttributeValue.attributeValue.attribute', 
            'user',
            'histories.user'
        ]);

        return Inertia::render('InventoryTransfers/Show', [
            'transfer' => $inventoryTransfer,
        ]);
    }

    /**
     * Check stock for a specific store and product.
     */
    public function checkStock(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'product_id' => 'required|exists:products,id',
            'combination_id' => 'nullable|exists:combinations,id',
        ]);

        $stock = Stock::where('store_id', $validated['store_id'])
            ->where('product_id', $validated['product_id'])
            ->where('combination_id', $validated['combination_id'])
            ->first();

        return response()->json([
            'quantity' => $stock ? $stock->quantity : 0
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InventoryTransfer $inventoryTransfer)
    {
        $validated = $request->validate([
            'status' => 'required|in:ready,shipped,received,cancelled',
            'items' => 'nullable|array', // Optional updates per item
            'items.*.id' => 'required|exists:inventory_transfer_items,id',
            'items.*.shipped_quantity' => 'nullable|integer|min:0',
            'items.*.received_quantity' => 'nullable|integer|min:0',
            'reason' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $inventoryTransfer) {
            $currentStatus = $inventoryTransfer->status;
            $newStatus = $validated['status'];

            // Validate state transition
            if ($newStatus === 'shipped' && !in_array($currentStatus, ['pending', 'ready'])) {
                abort(422, 'Solo se puede enviar si está en espera o listo');
            }

            if ($newStatus === 'received' && $currentStatus !== 'shipped') {
                abort(422, 'Solo se puede recibir si ya fue enviado');
            }

            $itemsToUpdate = $validated['items'] ?? [];

            foreach ($inventoryTransfer->items as $item) {
                // Find custom data for this item if provided
                $itemData = collect($itemsToUpdate)->firstWhere('id', $item->id);

                if ($newStatus === 'shipped') {
                    $shippedQuantity = $itemData['shipped_quantity'] ?? $item->requested_quantity;
                    
                    // Subtract from source store
                    $sourceStock = Stock::where('store_id', $inventoryTransfer->from_store_id)
                        ->where('product_id', $item->product_id)
                        ->where('combination_id', $item->combination_id)
                        ->first();

                    if (!$sourceStock || $sourceStock->quantity < $shippedQuantity) {
                        abort(422, "No hay suficiente stock para el producto {$item->product->product_name} en la tienda de salida");
                    }

                    $sourceStock->decrement('quantity', $shippedQuantity);
                    $item->shipped_quantity = $shippedQuantity;
                    $item->save();
                }

                if ($newStatus === 'received') {
                    $receivedQuantity = $itemData['received_quantity'] ?? $item->shipped_quantity ?? $item->requested_quantity;
                    
                    // Add to destination store
                    $destStock = Stock::firstOrCreate([
                        'store_id' => $inventoryTransfer->to_store_id,
                        'product_id' => $item->product_id,
                        'combination_id' => $item->combination_id,
                        'company_id' => $inventoryTransfer->company_id,
                    ], [
                        'quantity' => 0,
                    ]);

                    $destStock->increment('quantity', $receivedQuantity);
                    $item->received_quantity = $receivedQuantity;
                    $item->save();
                }

                if ($newStatus === 'cancelled' && $currentStatus === 'shipped') {
                    // Revert stock
                    $sourceStock = Stock::where('store_id', $inventoryTransfer->from_store_id)
                        ->where('product_id', $item->product_id)
                        ->where('combination_id', $item->combination_id)
                        ->first();
                    
                    if ($sourceStock) {
                        $sourceStock->increment('quantity', $item->shipped_quantity);
                    }
                }
            }

            $inventoryTransfer->status = $newStatus;
            $inventoryTransfer->reason = $validated['reason'] ?? $inventoryTransfer->reason;
            $inventoryTransfer->save();

            // Log history
            $inventoryTransfer->histories()->create([
                'status' => $newStatus,
                'user_id' => Auth::id(),
                'notes' => $validated['reason'] ?? "Cambio de estado a {$newStatus}",
            ]);

            return redirect()->back();
        });
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryTransfer $inventoryTransfer)
    {
        if ($inventoryTransfer->status !== 'pending') {
            abort(422, 'Solo se pueden eliminar transferencias en espera');
        }

        $inventoryTransfer->delete();
        return redirect()->back();
    }
}
