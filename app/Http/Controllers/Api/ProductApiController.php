<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class ProductApiController extends Controller
{
    public function show()
    {
        $products = Product::with(
            'tax',
            'categories',
            'stocks',
            'combinations',
            'combinations.combinationAttributeValue', // Cargar valores de atributos de combinaciones
            'combinations.combinationAttributeValue.attributeValue', // Cargar valores de atributos relacionados
            'combinations.combinationAttributeValue.attributeValue.attribute', // Cargar atributos relacionados
            'media'
        )
        ->where('status', 1)
        ->where('product_status_pos', 1)
        ->get();

        return response()->json([
            "message" => "success",
            "products" => $products
        ], Response::HTTP_OK);
    }

}
