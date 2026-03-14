<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Refund;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.reports.index');
    }
    public function index(Request $request)
    {
        $desde = $request->input('desde')
            ? Carbon::parse($request->input('desde'))->startOfDay()
            : Carbon::today()->startOfDay();

        $hasta = $request->input('hasta')
            ? Carbon::parse($request->input('hasta'))->endOfDay()
            : Carbon::today()->endOfDay();

        $storeId = $request->input('store_id');
        $currencyId = $request->input('currency_id');

        // Obtener la moneda configurada para la compañía (Base) e enabled currencies
        $company = auth()->user()->company;
        $settings = $company->setting()->with('currency')->first();
        $baseCurrency = $settings->currency ?? null;
        
        // Monedas habilitadas por el owner (CompanyCurrency)
        $companyCurrencies = \App\Models\CompanyCurrency::with('currency')
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->get();
            
        $availableCurrencies = $companyCurrencies->map(function($cc) {
            return [
                'id' => $cc->currency->id,
                'name' => $cc->currency->name,
                'symbol' => $cc->currency->symbol,
                'code' => $cc->currency->code,
                'is_base' => $cc->is_base
            ];
        });

        // Si no hay currency_id, usamos la base por defecto
        if (!$currencyId && $baseCurrency) {
            $currencyId = $baseCurrency->id;
        }

        $query = Order::with(
            'orderItems.product.categories',
            'deliveryLocation.country',
            'deliveryLocation.state',
            'deliveryLocation.city',
            'store',
            'currency'
        )
            ->whereBetween('created_at', [$desde, $hasta]);

        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        if ($currencyId) {
            $query->where('currency_id', $currencyId);
        }

        $orders = $query->get();

        // La moneda "activa" para el reporte es la que se filtró
        $activeCurrency = $currencyId 
            ? \App\Models\Currency::find($currencyId) 
            : $baseCurrency;

        // Ventas por Tienda (Comparativo)
        $ventasPorTienda = $orders->groupBy(function ($order) {
            return $order->store ? $order->store->name : 'Venta Online/Sin Tienda';
        })->map(function ($group) {
            return [
                'total' => $group->sum('total'),
                'count' => $group->count()
            ];
        })->toArray();

        $ordersByDeliveryTypeByDay = $orders->groupBy(function ($order) {
            return Carbon::parse($order->created_at)->format('Y-m-d') . '-' . $order->delivery_type;
        })->map(function (Collection $group) {
            return $group->count();
        })->sortKeys()->toArray();

        $totalReembolsosQuery = Refund::whereBetween('refunded_at', [$desde, $hasta]);
        // Si hay store_id, necesitaríamos que los reembolsos tengan store_id o filtrar por órdenes
        // Por ahora mantenemos el total de la compañía si no hay store_id en Refund
        $totalReembolsos = $totalReembolsosQuery->sum('amount');

        $totalDiscounts = $orders->sum('totaldiscounts');
        $totalShipping = $orders->sum('totalshipping');
        $subtotal = $orders->sum('subtotal');
        $taxAmount = $orders->sum('tax_amount');
        $total = $orders->sum('total');

        $totalCompletados = $orders->where('status', 'completed')->count();
        $totalCancelados = $orders->where('status', 'cancelled')->count();
        $totalPendientes = $orders->where('status', 'pending')->count();
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

        // Top 5 Productos más vendidos
        $productStats = [];
        foreach ($orders as $order) {
            foreach ($order->orderItems as $item) {
                $productId = $item->product_id;
                if (!$productId) continue;

                if (!isset($productStats[$productId])) {
                    $productStats[$productId] = [
                        'name' => $item->name_product,
                        'qty' => 0,
                        'revenue' => 0
                    ];
                }
                $productStats[$productId]['qty'] += $item->quantity;
                $productStats[$productId]['revenue'] += $item->subtotal;
            }
        }

        $topProductos = collect($productStats)
            ->sortByDesc('revenue')
            ->take(5)
            ->values()
            ->toArray();

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

        // --- NUEVAS MÉTRICAS AVANZADAS ---

        // 1. Top Clientes (Fidelidad)
        $topClientes = $orders->whereNotNull('user_id')
            ->groupBy('user_id')
            ->map(function ($group) {
                $user = $group->first()->user;
                return [
                    'name' => $user ? $user->name : 'Usuario Desconocido',
                    'email' => $user ? $user->email : '',
                    'total' => $group->sum('total'),
                    'orders_count' => $group->count()
                ];
            })
            ->sortByDesc('total')
            ->take(5)
            ->values()
            ->toArray();

        // 2. Alertas de Bajo Stock (Umbral < 5)
        $stockQuery = \App\Models\Stock::with(['product', 'combination.combinationAttributeValue.attributeValue'])
            ->where('company_id', $company->id);
            
        if ($storeId) {
            $stockQuery->where('store_id', $storeId);
        }

        $lowStockProducts = $stockQuery->get()
            ->groupBy(function($stock) {
                return $stock->product_id . '-' . ($stock->combination_id ?? 'simple');
            })
            ->map(function($group) {
                $first = $group->first();
                $totalQty = $group->sum('quantity');
                
                $name = $first->product ? $first->product->product_name : 'Producto Desconocido';
                if ($first->combination) {
                    $attrs = $first->combination->combinationAttributeValue->map(function($cav) {
                        return $cav->attributeValue->attribute_value_name;
                    })->implode(', ');
                    $name .= " ($attrs)";
                }

                return [
                    'name' => $name,
                    'sku' => $first->product_sku,
                    'quantity' => $totalQty,
                    'store' => $group->count() > 1 ? 'Consolidado (Todas las sucursales)' : ($first->store ? $first->store->name : 'N/A')
                ];
            })
            ->filter(function($item) {
                return $item['quantity'] < 5;
            })
            ->values()
            ->toArray();

        // 4. Top Productos por Vistas
        $topVistos = \App\Models\Product::orderByDesc('views_count')
            ->where('company_id', $company->id)
            ->take(5)
            ->get(['product_name', 'views_count', 'product_price'])
            ->toArray();

        // Obtener todas las tiendas para el selector
        $stores = $company->stores()->get(['id', 'name']);

        return Inertia::render('Reports/Index', [
            'desde' => $desde->toDateString(),
            'hasta' => $hasta->toDateString(),
            'store_id' => $storeId,
            'stores' => $stores,
            'currency_id' => $currencyId,
            'currencies' => $availableCurrencies,
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
            'topProductos' => $topProductos,
            'ventasNetas' => $total - $totalReembolsos - $totalDiscounts,
            'ventasPorTienda' => $ventasPorTienda,
            'currency' => $activeCurrency,
            // Nuevos datos
            'topClientes' => $topClientes,
            'lowStockProducts' => $lowStockProducts,
            'topVistos' => $topVistos,
        ]);
    }
}
