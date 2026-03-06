<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CollectionController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────────
    // INDEX
    // ──────────────────────────────────────────────────────────────────────────

    public function index()
    {
        $collections = Collection::withCount('products')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Collections/Index', [
            'collections' => $collections,
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CREATE
    // ──────────────────────────────────────────────────────────────────────────

    public function create()
    {
        $products = Product::with(
            'media',
            'categories',
            'stocks',
            'combinations.stocks',
            'combinations.combinationAttributeValue.attributeValue.attribute'
        )->get();
        $categories = Category::all();

        return Inertia::render('Collections/Create', compact('products', 'categories'));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // STORE
    // ──────────────────────────────────────────────────────────────────────────

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'type'             => 'required|in:manual,smart',
            'conditions'       => 'nullable|array',
            'conditions_match' => 'in:all,any',
            'is_active'        => 'boolean',
            'starts_at'        => 'nullable|date',
            'ends_at'          => 'nullable|date|after_or_equal:starts_at',
            'product_ids'      => 'nullable|array',
            'product_ids.*'    => 'integer|exists:products,id',
            // SEO fields
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array|max:10',
            'meta_keywords.*' => 'string|max:50',
            'og_title' => 'nullable|string|max:60',
            'og_description' => 'nullable|string|max:160',
            'og_image' => 'nullable|url',
            'twitter_title' => 'nullable|string|max:60',
            'twitter_description' => 'nullable|string|max:160',
            'twitter_image' => 'nullable|url',

        ]);

        DB::transaction(function () use ($validated, $user) {
            $collection = Collection::create(array_merge(
                $validated,
                ['company_id' => $user->company_id]
            ));

            if ($validated['type'] === 'manual' && !empty($validated['product_ids'])) {
                $syncData = [];
                foreach (array_values($validated['product_ids']) as $order => $productId) {
                    $syncData[$productId] = ['sort_order' => $order];
                }
                $collection->products()->sync($syncData);
            }
        });

        return to_route('collections.index')->with('success', 'Colección creada con éxito.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // EDIT
    // ──────────────────────────────────────────────────────────────────────────

    public function edit(Collection $collection)
    {
        $user = Auth::user();
        if ($collection->company_id !== $user->company_id) {
            abort(403);
        }

        $collection->load(
            'products.media',
            'products.stocks',
            'products.categories',
            'products.combinations.stocks',
            'products.combinations.combinationAttributeValue.attributeValue.attribute'
        );

        $products = Product::with(
            'media',
            'categories',
            'stocks',
            'combinations.stocks',
            'combinations.combinationAttributeValue.attributeValue.attribute'
        )->get();
        $categories = Category::all();

        // Para colecciones inteligentes, calculamos el preview de productos
        $smartProducts = [];
        if ($collection->type === 'smart' && !empty($collection->conditions)) {
            $smartProducts = Collection::buildSmartQuery(
                $collection->conditions,
                $collection->conditions_match
            )->with('media', 'stocks', 'categories')->get()->toArray();
        }

        return Inertia::render('Collections/Edit', compact(
            'collection',
            'products',
            'categories',
            'smartProducts'
        ));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // UPDATE
    // ──────────────────────────────────────────────────────────────────────────

    public function update(Request $request, Collection $collection)
    {
        $user = Auth::user();
        if ($collection->company_id !== $user->company_id) {
            abort(403);
        }

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'type'             => 'required|in:manual,smart',
            'conditions'       => 'nullable|array',
            'conditions_match' => 'in:all,any',
            'is_active'        => 'boolean',
            'starts_at'        => 'nullable|date',
            'ends_at'          => 'nullable|date|after_or_equal:starts_at',
            'product_ids'      => 'nullable|array',
            'product_ids.*'    => 'integer|exists:products,id',
            // SEO fields
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array|max:10',
            'meta_keywords.*' => 'string|max:50',
            'og_title' => 'nullable|string|max:60',
            'og_description' => 'nullable|string|max:160',
            'og_image' => 'nullable|url',
            'twitter_title' => 'nullable|string|max:60',
            'twitter_description' => 'nullable|string|max:160',
            'twitter_image' => 'nullable|url',

        ]);

        DB::transaction(function () use ($validated, $collection) {
            $collection->update($validated);

            if ($validated['type'] === 'manual') {
                $syncData = [];
                foreach (array_values($validated['product_ids'] ?? []) as $order => $productId) {
                    $syncData[$productId] = ['sort_order' => $order];
                }
                $collection->products()->sync($syncData);
            } else {
                // Smart: remove all manual products since membership is dynamic
                $collection->products()->detach();
            }
        });

        return to_route('collections.edit', $collection->slug)
            ->with('success', 'Colección actualizada con éxito.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // DESTROY
    // ──────────────────────────────────────────────────────────────────────────

    public function destroy(Collection $collection)
    {
        $user = Auth::user();
        if ($collection->company_id !== $user->company_id) {
            abort(403);
        }

        DB::transaction(function () use ($collection) {
            $collection->products()->detach();
            $collection->delete();
        });

        return to_route('collections.index')->with('success', 'Colección eliminada con éxito.');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // PREVIEW SMART (AJAX)
    // ──────────────────────────────────────────────────────────────────────────

    public function previewSmart(Request $request)
    {
        $request->validate([
            'conditions'       => 'nullable|array',
            'conditions_match' => 'in:all,any',
        ]);

        $matchedProducts = Collection::buildSmartQuery(
            $request->input('conditions', []),
            $request->input('conditions_match', 'all')
        )->with('media', 'stocks', 'categories')->get();

        return response()->json([
            'count'    => $matchedProducts->count(),
            'products' => $matchedProducts->map(function ($p) {
                $hasCombinations = $p->combinations->isNotEmpty();

                // Stock total (suma de todos los stocks: simples + variantes)
                $totalStock = $p->stocks->sum('quantity');

                // Recuento de variantes
                $variantsCount = $hasCombinations ? $p->combinations->count() : 0;

                // Precio a mostrar: si hay variantes, rango de precios de combinaciones
                $minPrice = $hasCombinations ? $p->combinations->min('combination_price') : $p->product_price;
                $maxPrice = $hasCombinations ? $p->combinations->max('combination_price') : $p->product_price;

                $priceDisplay = $hasCombinations
                    ? '$' . number_format($minPrice, 2) . ' – $' . number_format($maxPrice, 2)
                    : '$' . number_format($p->product_price, 2);

                return [
                    'id'             => $p->id,
                    'product_name'   => $p->product_name,
                    'product_price'  => $p->product_price,
                    'min_price'      => $minPrice,
                    'max_price'      => $maxPrice,
                    'price_display'  => $priceDisplay, // Mantenemos para fallback o debug
                    'total_stock'    => $totalStock,
                    'variants_count' => $variantsCount,
                    'has_variants'   => $hasCombinations,
                    'image'          => $p->media->first()?->original_url,
                ];
            }),
        ]);
    }
}
