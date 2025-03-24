<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreProductController extends Controller
{
    public function index()
    {
        $store = Store::all(); // Obtener los productos de la tienda

        return response()->json($store);
    }

    public function showProducts(Store $store)
    {
        try {
            $products = $store->products; // Obtener los productos de la tienda
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tienda no encontrada'], 404);
        }
        
        if ($products->isEmpty()) {
            return response()->json(['message' => 'Esta tienda no tiene productos asociados'], 200);
        }
        return response()->json($products);
    }
}
