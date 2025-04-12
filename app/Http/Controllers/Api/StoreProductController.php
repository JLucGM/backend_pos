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
            // Obtener los productos de la tienda con las relaciones y filtros necesarios
            $products = $store->products()->with([
                'tax',
                'categories',
                'stocks',
                'combinations' => function ($query) {
                    $query->whereHas('stocks', function ($stockQuery) {
                        $stockQuery->where('quantity', '>', 0); // Solo combinaciones con stock > 0
                    });
                },
                'combinations.combinationAttributeValue',
                'combinations.combinationAttributeValue.attributeValue',
                'combinations.combinationAttributeValue.attributeValue.attribute',
                'media'
            ])
                ->where('status', 1) // Solo productos activos
                ->where('product_status_pos', 1) // Solo productos activos en POS
                ->whereHas('stocks', function ($query) {
                    $query->where('quantity', '>', 0); // Solo productos con stock > 0
                })
                ->distinct() // Evitar duplicados
                ->get();

            if ($products->isEmpty()) {
                return response()->json(['message' => 'Esta tienda no tiene productos asociados'], 200);
            }

            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tienda no encontrada'], 404);
        }
    }
}
