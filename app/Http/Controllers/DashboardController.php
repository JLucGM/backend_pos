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
        $company = $userAuth->company;

        // Aislamiento de datos por compañía
        $users = User::where('company_id', $userAuth->company_id)->get();
        $orders = Order::where('company_id', $userAuth->company_id)->get();
        $products = Product::where('company_id', $userAuth->company_id)->with('stocks', 'media')->get();

        $ordersCount = $orders->count();
        $usersCount = $users->count();
        
        // Sumar el campo 'total' de las órdenes del día de la compañía
        $totalTodayOrdersAmount = Order::where('company_id', $userAuth->company_id)
            ->whereDate('created_at', Carbon::today())
            ->sum('total');

        // Establecer el locale a español
        Carbon::setLocale('Es');

        // Agrupar users por mes
        $chartData = $users->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F');
        })->map(fn($row) => count($row));

        // Agrupar órdenes por mes (corregido)
        $chartDataOrders = $orders->groupBy(function ($date) {
            return \Carbon\Carbon::parse($date->created_at)->locale('es')->translatedFormat('F');
        })->map(fn($row) => count($row));

        $todayOrdersCount = Order::where('company_id', $userAuth->company_id)
            ->whereDate('created_at', Carbon::today())
            ->count();

        $ordersByPaymentMethod = Order::where('company_id', $userAuth->company_id)
            ->with('paymentMethod')
            ->whereDate('created_at', Carbon::today())
            ->get()
            ->groupBy(fn($order) => $order->paymentMethod ? $order->paymentMethod->payment_method_name : 'Sin método de pago')
            ->map(fn($group) => count($group));

        // Productos con bajo stock
        $lowStockProducts = $products->filter(function ($product) {
            return $product->stocks->sum('quantity') < 5;
        })->values();

        // Lógica del Checklist de Configuración (Refinada)
        $settings = \App\Models\Setting::where('company_id', $userAuth->company_id)->first();
        
        // Políticas: considerar completado si al menos una ha sido editada (updated_at > created_at)
        $hasEditedPolicies = \App\Models\Page::where('company_id', $userAuth->company_id)
            ->where('page_type', 'policy')
            ->whereColumn('updated_at', '>', 'created_at')
            ->exists();

        // Métodos de pago: considerar completado si tiene más de uno (el default es 'Efectivo')
        $hasMultiplePayments = \App\Models\PaymentMethod::where('company_id', $userAuth->company_id)->count() > 1;

        // Tarifas de envío: considerar completado si tiene más de una o si la tarifa por defecto (precio 0) ha sido cambiada
        $shippingRates = \App\Models\ShippingRate::where('company_id', $userAuth->company_id)->get();
        $hasModifiedShipping = $shippingRates->count() > 1 || ($shippingRates->count() === 1 && $shippingRates->first()->price > 0);

        $setupChecklist = [
            'has_products' => $products->count() > 0,
            'has_logo' => $settings && $settings->hasMedia('logo'),
            'has_domain' => !empty($company->domain),
            'has_policies' => $hasEditedPolicies,
            'has_payment_methods' => $hasMultiplePayments,
            'has_shipping_rates' => $hasModifiedShipping,
        ];

        $currentSubscription = $company->currentSubscription ? $company->currentSubscription->load('plan') : null;

        return Inertia::render('Dashboard', [
            'user' => $chartData,
            'orders' => $chartDataOrders,
            'ordersCount' => $ordersCount,
            'usersCount' => $usersCount,
            'todayOrdersCount' => $todayOrdersCount,
            'ordersByPaymentMethod' => $ordersByPaymentMethod,
            'lowStockProducts' => $lowStockProducts,
            'totalTodayOrdersAmount' => $totalTodayOrdersAmount,
            'company' => $company,
            'currentSubscription' => $currentSubscription,
            'setupChecklist' => $setupChecklist,
        ]);
    }
}
