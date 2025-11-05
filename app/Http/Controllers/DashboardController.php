<?php

namespace App\Http\Controllers;

// use App\Models\user;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userAuth = Auth::user();

        $users = User::where('company_id', $userAuth->company_id)->get();
        $orders = Order::all();

        $role = $userAuth->getRoleNames();
        $permission = $userAuth->getAllPermissions();
        $products = Product::with('stocks', 'media')->get(); // Asegúrate de cargar la relación de stocks

        $ordersCount = $orders->count();
        $usersCount = $users->count();
        $totalTodayOrdersAmount = Order::whereDate('created_at', Carbon::today())->sum('total'); // Sumar el campo 'total' de las órdenes del día
        // dd($totalTodayOrdersAmount);

        // Establecer el locale a español
        Carbon::setLocale('Es');

        // Agrupar users por mes
        $chartData = $users->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F'); // Agrupar por mes en español
        })->map(function ($row) {
            return count($row); // Contar el número de useres por mes
        });

        $chartDataOrders = $orders->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F'); // Agrupar por mes en español
        })->map(function ($row) {
            // return count($row); // Contar el número de useres por mes
        });

        $todayOrdersCount = Order::whereDate('created_at', Carbon::today())->count();

        $ordersByPaymentMethod = Order::with('paymentMethod')
            ->whereDate('created_at', Carbon::today())
            ->get()
            ->groupBy(function ($order) {
                // Verificar si paymentMethod existe; si no, usar un valor por defecto
                return $order->paymentMethod ? $order->paymentMethod->payment_method_name : 'Sin método de pago';
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
        return Inertia::render(
            'Dashboard',
            [
                'user' => $chartData,
                'orders' => $chartDataOrders,
                'ordersCount' => $ordersCount,
                'usersCount' => $usersCount,
                'todayOrdersCount' => $todayOrdersCount,
                'ordersByPaymentMethod' => $ordersByPaymentMethod,
                'lowStockProducts' => $lowStockProducts, // Pasar los productos con bajo stock
                'totalTodayOrdersAmount' => $totalTodayOrdersAmount,
                'role' => $role,
                'permission' => $permission,
            ]
        );
    }
}
