<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Refund;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $desde = $request->input('desde')
            ? Carbon::parse($request->input('desde'))->startOfDay()
            : Carbon::today()->startOfDay();

        $hasta = $request->input('hasta')
            ? Carbon::parse($request->input('hasta'))->endOfDay()
            : Carbon::today()->endOfDay();

        $orders = Order::with(
            'orderItems.product.categories',
            'deliveryLocation.country',
            'deliveryLocation.state',
            'deliveryLocation.city'
        )
            ->whereBetween('created_at', [$desde, $hasta])
            ->get();

        $ordersByDeliveryTypeByDay = $orders->groupBy(function ($order) {
            return Carbon::parse($order->created_at)->format('Y-m-d') . '-' . $order->delivery_type;
        })->map(function (Collection $group) {
            return $group->count();
        })->sortKeys()->toArray();
        // Opcional: Si quieres sumar ventas por tipo en lugar de conteo
        // $salesByDeliveryType = $orders->groupBy('delivery_type')->map(function (Collection $group) {
        //     return $group->sum('total');
        // })->toArray();

        $totalReembolsos = Refund::whereBetween('refunded_at', [$desde, $hasta])
            ->sum('amount');

        $totalDiscounts = $orders->sum('totaldiscounts');
        $totalShipping = $orders->sum('totalshipping');
        $subtotal = $orders->sum('subtotal');
        $taxAmount = $orders->sum('tax_amount');
        $total = $orders->sum('total'); // Ya lo tienes como totalVentas

        $totalCompletados = $orders->where('status', 'completed')->count();
        $totalCancelados = $orders->where('status', 'cancelled')->count(); // Nuevo: conteo de canceladas
        $totalPendientes = $orders->where('status', 'pending')->count(); // Nuevo: conteo de pendientes
        $totalPedidos = $orders->count();

        // Agrupar por día
        $pedidosPorDia = $orders->groupBy(function ($order) {
            return Carbon::parse($order->created_at)->format('Y-m-d');
        })->map(function (Collection $group) {
            return $group->count();
        })->sortKeys()->toArray();

        $ordersByPaymentMethod = $orders->groupBy(function ($order) {
            return $order->paymentMethod ? $order->paymentMethod->payment_method_name : 'Sin Método';
        })->map(function (Collection $group) {
            return $group->count();
        })->toArray();

        $ventasPorCategoria = [];

        foreach ($orders as $order) {
            foreach ($order->orderItems as $item) {
                $product = $item->product;
                $categories = $product?->categories;

                if ($categories && $categories->count()) {
                    foreach ($categories as $category) {
                        $nombre = $category->category_name;
                        $ventasPorCategoria[$nombre] = ($ventasPorCategoria[$nombre] ?? 0) + $item->subtotal;
                    }
                } else {
                    $ventasPorCategoria['Sin categoría'] = ($ventasPorCategoria['Sin categoría'] ?? 0) + $item->subtotal;
                }
            }
        }

        // Ventas por País
        $ventasPorPais = $orders->filter(function ($order) {
            return $order->deliveryLocation && $order->deliveryLocation->country;
        })->groupBy(function ($order) {
            return $order->deliveryLocation->country->country_name;
        })->map(function (Collection $group) {
            return $group->sum('total');
        })->sortDesc()->toArray();  // Ordena por ventas descendentes

        // Ventas por Estado
        $ventasPorEstado = $orders->filter(function ($order) {
            return $order->deliveryLocation && $order->deliveryLocation->state;
        })->groupBy(function ($order) {
            return $order->deliveryLocation->state->state_name;
        })->map(function (Collection $group) {
            return $group->sum('total');
        })->sortDesc()->toArray();

        // Ventas por Ciudad (opcional, si quieres granularidad)
        $ventasPorCiudad = $orders->filter(function ($order) {
            return $order->deliveryLocation && $order->deliveryLocation->city;
        })->groupBy(function ($order) {
            return $order->deliveryLocation->city->city_name;
        })->map(function (Collection $group) {
            return $group->sum('total');
        })->sortDesc()->toArray();


        return Inertia::render('Reports/Index', [
            'desde' => $desde->toDateString(),
            'hasta' => $hasta->toDateString(),
            'totalVentas' => $total,
            'totalDiscounts' => $totalDiscounts,
            'totalShipping' => $totalShipping,
            'totalCancelados' => $totalCancelados,
            'totalPendientes' => $totalPendientes,
            'ventasPorCategoria' => $ventasPorCategoria,
            'taxAmount' => $taxAmount,
            'totalCompletados' => $totalCompletados,
            'totalPedidos' => $totalPedidos,
            'pedidosPorDia' => $pedidosPorDia,
            'ordersByPaymentMethod' => $ordersByPaymentMethod,
            'ordersByDeliveryType' => $ordersByDeliveryTypeByDay,
            'totalReembolsos' => $totalReembolsos,
            'ventasPorPais' => $ventasPorPais,
            'ventasPorEstado' => $ventasPorEstado,
            'ventasPorCiudad' => $ventasPorCiudad,
        ]);
    }
}
