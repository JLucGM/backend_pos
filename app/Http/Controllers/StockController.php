<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.stocks.index')->only('index');
        $this->middleware('can:admin.stocks.create')->only('create', 'store');
        // $this->middleware('can:admin.stocks.edit')->only('edit', 'update');
        $this->middleware('can:admin.stocks.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Obtener todas las tiendas de la compañía
        $stores = Store::where('company_id', $user->company_id)->get();

        // Obtener el store_id del request (si no hay, usar null para mostrar todas)
        $selectedStoreId = $request->input('store_id', null);

        $productsWithCombinations = Product::whereHas('combinations')->pluck('id');

        // Obtener los registros de stock
        $stockQuery = Stock::with([
            'product',
            'combination.combinationAttributeValue.attributeValue.attribute',
            'store'
        ])
            ->where(function ($query) use ($productsWithCombinations) {
                $query->whereNotNull('combination_id')
                    ->orWhereNotIn('product_id', $productsWithCombinations);
            })
            ->when($selectedStoreId, function ($query) use ($selectedStoreId) {
                return $query->where('store_id', $selectedStoreId);
            });

        $stock = $stockQuery->get();

        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Stocks/Index', compact(
            'stock',
            'role',
            'permission',
            'stores',
            'selectedStoreId'
        ));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->only('quantity', 'status', 'product_id');

        Stock::create($data);

        return to_route('stocks.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Stock $stock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Stock $stock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Stock $stock)
    {
        $user = Auth::user();

        // Verificar que el stock pertenece a la compañía del usuario
        if ($stock->company_id !== $user->company_id) {
            return response()->json([
                'success' => false,
                'error' => 'No tienes permiso para actualizar este stock'
            ], 403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $data = $request->only('quantity');

        $stock->update($data);

        // Devolver una respuesta simple para Inertia
        // return response()->json([
        //     'success' => true,
        //     'message' => 'Stock actualizado correctamente'
        // ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        //
    }
}
