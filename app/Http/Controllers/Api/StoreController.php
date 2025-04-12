<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index()
    {
        $store = Store::all(); // Obtener los productos de la tienda

        return response()->json($store);
    }

    public function show(Store $store)
    {
        $store = Store::find($store);
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }
        return response()->json($store);
    }

    public function create(Request $request)
    {
        return response()->json([
            'message' => 'Store created',
            'data' => $request->all()
        ]);
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => 'Store updated',
            'id' => $id,
            'data' => $request->all()
        ]);
    }

    public function delete($id)
    {
        return response()->json([
            'message' => 'Store deleted',
            'id' => $id
        ]);
    }
}
