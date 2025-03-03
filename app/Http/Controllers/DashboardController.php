<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $clients = Client::all();
        $orders = Order::all();
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();
        $products = Product::with('stocks', 'media')->get(); // Asegúrate de cargar la relación de stocks

        $ordersCount = Order::all()->count();
        $clientsCount = Client::all()->count();
        $totalTodayOrdersAmount = Order::whereDate('created_at', Carbon::today())->sum('total'); // Sumar el campo 'total' de las órdenes del día
        // dd($totalTodayOrdersAmount);

        // Establecer el locale a español
        Carbon::setLocale('Es');

        // Agrupar clientes por mes
        $chartData = $clients->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F'); // Agrupar por mes en español
        })->map(function ($row) {
            return count($row); // Contar el número de clientes por mes
        });

        $chartDataOrders = $orders->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F'); // Agrupar por mes en español
        })->map(function ($row) {
            return count($row); // Contar el número de clientes por mes
        });

        $todayOrdersCount = Order::whereDate('created_at', Carbon::today())->count();

        $ordersByPaymentMethod = Order::with('paymentMethod')
            ->whereDate('created_at', Carbon::today())
            ->get()
            ->groupBy(function ($order) {
                return $order->paymentMethod->payment_method_name; // Agrupar por nombre del método de pago
            })
            ->map(function ($group) {
                return count($group); // Contar el número de órdenes por método de pago
            });

        // Obtener productos con bajo stock
        // Obtener productos con bajo stock
        $lowStockProducts = $products->filter(function ($product) {
            return $product->stocks->sum('quantity') < "5"; // Cambia 'quantity' por el nombre del campo que almacena la cantidad en stock
        })->values(); // Asegúrate de que sea un array


        // dd($lowStockProducts);
        return Inertia::render('Dashboard', [
            'client' => $chartData,
            'orders' => $chartDataOrders,
            'ordersCount' => $ordersCount,
            'clientsCount' => $clientsCount,
            'todayOrdersCount' => $todayOrdersCount,
            'ordersByPaymentMethod' => $ordersByPaymentMethod,
            'lowStockProducts' => $lowStockProducts, // Pasar los productos con bajo stock
            'totalTodayOrdersAmount' => $totalTodayOrdersAmount,
            'role' => $role,
            'permission' => $permission,
        ]);
    }
}
