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
        $this->middleware('can:admin.stocks.edit')->only('edit', 'update');
        $this->middleware('can:admin.stocks.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productsWithCombinations = Product::whereHas('combinations')->pluck('id');

        // Obtener los registros de stock, excluyendo aquellos con combination_id nulo para productos con combinaciones
        $stock = Stock::with(['product', 'combination.combinationAttributeValue.attributeValue.attribute', 'store'])
            ->where(function ($query) use ($productsWithCombinations) {
                $query->whereNotNull('combination_id')
                    ->orWhereNotIn('product_id', $productsWithCombinations);
            })
            ->get();

        // $products = Product::all();
        $stores = Store::all();

        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Stocks/Index', compact('stock', 'stores', 'role', 'permission'));
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
        $data = $request->only('quantity', 'status', 'product_id', 'store_id');

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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        //
    }
}
