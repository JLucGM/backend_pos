<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct()
    {

        $this->middleware('can:admin.products.index')->only('index');
        $this->middleware('can:admin.products.create')->only('create', 'store');
        $this->middleware('can:admin.products.edit')->only('edit', 'update');
        $this->middleware('can:admin.products.delete')->only('delete');
    }
    /**
     * Display a listing of the resource.s
     */
    public function index()
    {
        $product = Product::all();
        $taxes = Tax::all();
        $categories = Category::all();
        
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        return Inertia::render('Products/Index', compact('product', 'taxes', 'categories', 'role','permission'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validar los datos de entrada
    $request->validate([
        'product_name' => 'required|string|max:255',
        'product_description' => 'nullable|string',
        'product_price' => 'required|numeric',
        'tax_id' => 'required|exists:taxes,id',
        'categories' => 'required|array', // Asegúrate de que se envíe un array de categorías
        'categories.*' => 'exists:categories,id', // Cada categoría debe existir en la tabla categories
    ]);

    // Extraer los datos del producto
    $data = $request->only('product_name', 'product_description', 'product_price', 'tax_id');

    // Crear el producto
    $product = Product::create($data);

    // Asociar las categorías al producto
    $product->categories()->attach($request->categories);

    return to_route('products.index')->with('success', 'Producto creado con éxito.');
}

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['tax', 'categories']); // Carga ambas relaciones

        $taxes = Tax::all();
        $categories = Category::all();

        return Inertia::render('Products/Edit', compact('product', 'taxes','categories'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // Validar los datos de entrada
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric',
            'tax_id' => 'required|exists:taxes,id',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
        ]);
    
        // Extraer los datos del producto
        $data = $request->only('product_name', 'product_description', 'product_price', 'tax_id');
    
        // Actualizar el producto
        $product->update($data);
    
        // Actualizar las categorías asociadas
        $product->categories()->sync($request->categories); // Sincroniza las categorías
    
        return to_route('products.edit', $product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
{
    // Eliminar las relaciones en la tabla pivote
    $product->categories()->detach(); // Esto elimina las relaciones en product_categories

    // Ahora puedes eliminar el producto
    $product->delete();

    return to_route('products.index')->with('success', 'Producto eliminado con éxito.');
}
}
