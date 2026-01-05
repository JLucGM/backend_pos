<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Mostrar historial de pedidos del cliente
     */
    public function index(Request $request)
    {
        $company = $request->attributes->get('company');
        $user = Auth::user();
        
        $orders = Order::where('user_id', $user->id)
            ->where('company_id', $company->id)
            ->with(['items', 'paymentMethod', 'shippingRate'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Frontend/Orders/Index', [
            'orders' => $orders,
            'companyName' => $company->company_name,
        ]);
    }
    
    /**
     * Mostrar detalle de un pedido
     */
    public function show(Request $request, Order $order)
    {
        $company = $request->attributes->get('company');
        $user = Auth::user();
        
        // Verificar que el pedido pertenezca al cliente
        if ($order->user_id !== $user->id || $order->company_id !== $company->id) {
            abort(404);
        }
        
        $order->load([
            'items.product',
            'items.combination.combinationAttributeValue.attributeValue.attribute',
            'paymentMethod',
            'shippingRate',
        ]);
        
        return Inertia::render('Frontend/Orders/Show', [
            'order' => $order,
            'companyName' => $company->company_name,
        ]);
    }
}