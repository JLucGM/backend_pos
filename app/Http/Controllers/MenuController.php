<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem; // Necesitas este modelo para las acciones en los items
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Para transacciones
use Inertia\Inertia;

class MenuController extends RoutingController
{
    public function __construct()
    {
        $this->middleware('can:admin.menus.index')->only('index');
        $this->middleware('can:admin.menus.create')->only('create', 'store');
        $this->middleware('can:admin.menus.edit')->only('edit', 'update');
        $this->middleware('can:admin.menus.delete')->only('destroy');
    }
    /**
     * Muestra la lista de menús de la compañía actual.
     */
    public function index()
    {
        // 1. Obtener la compañía del usuario autenticado
        $companyId = Auth::user()->company_id;

        // 2. Cargar todos los menús de la compañía
        // Usamos la relación 'items' para obtener solo los de nivel superior, ordenados.
        $menus = Menu::where('company_id', $companyId)
            ->with(['items' => function ($query) {
                $query->whereNull('parent_id')->orderBy('order');
            }])
            ->get();

        // 3. Obtener datos del usuario y permisos (se mantiene tu lógica)
        $user = Auth::user();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions()->pluck('name'); // Usamos pluck('name') para un array simple

        return Inertia::render('Menus/Index', [
            'menus' => $menus,
            'role' => $role,
            'permission' => $permission,
        ]);
    }

    /**
     * Carga páginas dinámicas para el formulario.
     */
    protected function getDynamicPages()
    {
        // Asumiendo que el modelo es App\Models\Page
        // Solo necesitamos el slug (para la URL) y el título/nombre (para el select).
        return Page::select('title', 'slug')
                   ->where('is_published', true) // Solo páginas publicadas
                   ->orderBy('title')
                   ->get();
    }

    /**
     * Muestra el formulario para crear un nuevo menú.
     */
    public function create()
    {
        // $pages = Page::all();
        // dd($pages);

return Inertia::render('Menus/Create', [
            // Añadimos la lista de páginas dinámicas
            'dynamicPages' => $this->getDynamicPages(),
        ]);
        }

    /**
     * Almacena un nuevo recurso de menú.
     */
    public function store(Request $request)
    {
        // 1. VALIDACIÓN
        $request->validate([
            'name' => 'required|string|max:255',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable', 
            'items.*.title' => 'required_with:items|string|max:255', 
            'items.*.url' => 'required_with:items|string|max:255', 
            'items.*.children' => 'nullable|array', 
        ]);

        try {
            DB::transaction(function () use ($request) {
                
                // 2. CREAR EL MENÚ PRINCIPAL
                $menu = Menu::create([
                    'name' => $request->input('name'),
                    'company_id' => Auth::user()->company_id, // Asumo que usas autenticación y company_id
                ]);

                // 3. CREAR LOS ÍTEMS DE MENÚ USANDO LA FUNCIÓN RECURSIVA
                if ($request->has('items')) {
                    $this->saveMenuItemsRecursively($request->input('items'), $menu->id);
                }
            });

            session()->flash('success', 'Menú creado exitosamente.');
            return to_route('menus.index');

        } catch (\Exception $e) {
            \Log::error("Error al crear el menú: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error interno del servidor al guardar el menú.']);
        }
    }

    private function saveMenuItemsRecursively(array $items, int $menuId, $parentId = null): void
    {
        foreach ($items as $index => $itemData) {
            
            // 1. Crear el ítem actual
            $item = MenuItem::create([
                'menu_id'   => $menuId,
                'parent_id' => $parentId, // 🚨 Asignamos el ID del padre del nivel anterior
                'title'     => $itemData['title'],
                'url'       => $itemData['url'],
                'order'     => $itemData['order'] ?? $index,
            ]);

            // 2. Si tiene hijos, llamamos a la función de nuevo
            if (!empty($itemData['children'])) {
                // Pasamos el ID real ($item->id) del ítem que acabamos de guardar
                // como el nuevo $parentId para el siguiente nivel de recursión.
                $this->saveMenuItemsRecursively($itemData['children'], $menuId, $item->id);
            }
        }
    }

    /**
     * Muestra el formulario para editar un menú existente y sus ítems.
     * @param Menu $menu El menú a editar (usamos Route Model Binding)
     */
    public function edit(Menu $menu)
    {
        // 1. Verificar si el menú pertenece a la compañía del usuario
        if ($menu->company_id !== Auth::user()->company_id) {
            abort(403, 'Acceso no autorizado.');
        }

        // 2. Cargar TODOS los ítems de forma PLANA.
        // Incluir 'id', 'parent_id' y 'order' es CRUCIAL para que React reconstruya el árbol.
        $menuItems = MenuItem::where('menu_id', $menu->id)
                             ->get()
                             ->map(function ($item) {
                                 return [
                                     'id' => $item->id,
                                     'title' => $item->title,
                                     'url' => $item->url,
                                     'parent_id' => $item->parent_id, // 🚨 CLAVE AÑADIDA
                                     'order' => $item->order,         // 🚨 CLAVE AÑADIDA
                                 ];
                             })->toArray(); 

        return Inertia::render('Menus/Edit', [
            'menu' => $menu->only('id', 'name'),
            'menuItems' => $menuItems, // Array plano enviado a React
            'dynamicPages' => $this->getDynamicPages(),
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        if ($menu->company_id !== Auth::user()->company_id) {
            abort(403, 'Acceso no autorizado.');
        }
        
        // 1. VALIDACIÓN
        $request->validate([
            'name' => 'required|string|max:255',
            'items' => 'nullable|array',
            'items.*.id' => 'nullable|integer', // Permite IDs de DB (integer) o null (nuevo)
            'items.*.title' => 'required_with:items|string|max:255', 
            'items.*.url' => 'required_with:items|string|max:255', 
            'items.*.children' => 'nullable|array', 
        ]);

        try {
            DB::transaction(function () use ($request, $menu) {
                
                // 2. Actualizar el nombre del menú
                $menu->update(['name' => $request->input('name')]);

                // 3. Sincronizar (Crear/Actualizar) los ítems y obtener los IDs reales enviados
                $submittedItemIds = $this->syncMenuItemsRecursively($request->input('items', []), $menu->id);
                
                // 4. Eliminar ítems que NO fueron incluidos en el request (fueron borrados en el frontend)
                MenuItem::where('menu_id', $menu->id)
                        ->whereNotIn('id', $submittedItemIds)
                        ->delete();
            });

            session()->flash('success', 'Menú actualizado exitosamente.');
            return to_route('menus.index');

        } catch (\Exception $e) {
            \Log::error("Error al actualizar el menú: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error interno del servidor al guardar el menú.']);
        }
    }

    /**
     * FUNCIÓN RECURSIVA para CREAR, ACTUALIZAR y recolectar IDs de ítems.
     * Esta versión separa la lógica de CREATE y UPDATE para mayor robustez.
     * * @param array $items El array de ítems anidado.
     * @param int $menuId El ID del menú principal.
     * @param int|null $parentId El ID del ítem padre (null en la primera llamada).
     * @param array $submittedIds Array que recolecta los IDs de ítems que sobreviven.
     * @return array IDs de los ítems que han sido creados o actualizados.
     */
    private function syncMenuItemsRecursively(array $items, int $menuId, $parentId = null, array &$submittedIds = []): array
    {
        foreach ($items as $index => $itemData) {
            
            $itemId = $itemData['id'] ?? null;
            
            $attributes = [
                'menu_id'   => $menuId,
                'parent_id' => $parentId, // Clave para la jerarquía
                'title'     => $itemData['title'],
                'url'       => $itemData['url'],
                'order'     => $itemData['order'] ?? $index,
            ];

            if ($itemId && is_numeric($itemId)) {
                // Ítem existente: Lo encontramos y actualizamos.
                $item = MenuItem::find($itemId);
                if ($item) {
                    $item->update($attributes);
                } else {
                    // Si el ID existe en el payload pero no en la DB (raro), lo creamos.
                    $item = MenuItem::create($attributes);
                }
            } else {
                // Ítem nuevo (id es null): Lo creamos.
                // 🚨 Esta es la parte que asegura la creación de "hijo4.1"
                $item = MenuItem::create($attributes);
            }
            
            // Recolectamos el ID real para saber qué ítems NO borrar
            $submittedIds[] = $item->id;

            // 2. Recursión para los hijos
            if (!empty($itemData['children'])) {
                // Pasamos el ID real ($item->id) como el nuevo $parentId
                $this->syncMenuItemsRecursively($itemData['children'], $menuId, $item->id, $submittedIds);
            }
        }
        
        return $submittedIds;
    }

    /**
     * Elimina el menú y todos sus ítems asociados.
     */
    public function destroy(Menu $menu)
    {
        // 1. Verificar si el menú pertenece a la compañía del usuario
        if ($menu->company_id !== Auth::user()->company_id) {
            abort(403, 'Acceso no autorizado.');
        }

        // 2. Eliminar el menú (gracias a onDelete('cascade'), sus ítems también se eliminarán)
        $menu->delete();

        session()->flash('success', 'Menú eliminado exitosamente.');
        return to_route('menus.index');
    }

    // =================================================================
    // MÉTODOS PARA MENU ITEMS (CREATE/UPDATE/DELETE DE ENLACES INDIVIDUALES)
    // =================================================================

    /**
     * Almacena/actualiza un ítem de menú. Esta es la parte más crítica del CRUD de menús.
     */
    public function saveItems(Request $request, Menu $menu)
    {
        // 1. Validar si el menú pertenece a la compañía
        if ($menu->company_id !== Auth::user()->company_id) {
            abort(403, 'Acceso no autorizado.');
        }

        // Asumo que el frontend envía una lista completa de ítems para sincronizar
        $itemsData = $request->input('items', []);

        // Para manejo de transacciones complejas (crear, actualizar, reordenar)
        try {
            DB::transaction(function () use ($menu, $itemsData) {
                // Lógica de sincronización de ítems:
                // 1. Obtener IDs de ítems existentes
                $existingIds = $menu->items()->pluck('id')->toArray();
                $incomingIds = collect($itemsData)->pluck('id')->filter()->toArray();

                // 2. Determinar cuáles eliminar
                $idsToDelete = array_diff($existingIds, $incomingIds);
                MenuItem::whereIn('id', $idsToDelete)->delete();

                // 3. Crear/Actualizar ítems
                foreach ($itemsData as $index => $item) {
                    // Validar si es un ítem nuevo o existente
                    $itemId = $item['id'] ?? null;

                    // Asegurar que el parent_id apunte a un item existente o sea null
                    $parentId = $item['parent_id'] ?? null;

                    MenuItem::updateOrCreate(
                        ['id' => $itemId, 'menu_id' => $menu->id],
                        [
                            'title' => $item['title'],
                            'url' => $item['url'],
                            'order' => $index, // Usamos el índice de la lista como orden
                            'parent_id' => $parentId,
                        ]
                    );
                }
            });
        } catch (\Exception $e) {
            // Manejo de error si la transacción falla
            return back()->withErrors(['error' => 'Error al guardar los ítems del menú: ' . $e->getMessage()]);
        }

        session()->flash('success', 'Ítems del menú actualizados exitosamente.');
        return back(); // Redirigir a la página de edición del menú
    }
}
