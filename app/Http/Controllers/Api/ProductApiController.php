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
        try {
            $products = Product::with([
                'tax',
                'categories',
                'stocks',
                'combinations' => function ($query) {
                    $query->whereHas('stocks', function ($stockQuery) {
                        $stockQuery->where('quantity', '>', 0);
                    });
                },
                'combinations.combinationAttributeValue',
                'combinations.combinationAttributeValue.attributeValue',
                'combinations.combinationAttributeValue.attributeValue.attribute',
                'media'
            ])
                ->where('status', 1)
                ->where('product_status_pos', 1)
                ->whereHas('stocks', function ($query) {
                    $query->where('quantity', '>', 0);
                })
                ->get();

            return response()->json([
                "message" => "success",
                "products" => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "error",
                "error" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
