<?php

namespace App\Http\Controllers;

use App\Http\Requests\Roles\StoreRequest;
use App\Http\Requests\Roles\UpdateRequest;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.roles.index')->only('index');
        $this->middleware('can:admin.roles.create')->only('create', 'store');
        $this->middleware('can:admin.roles.edit')->only('edit', 'update');
        $this->middleware('can:admin.roles.delete')->only('destroy');
    }

    /**
     * Verifica si el usuario actual es el Super Admin (vía email).
     */
    private function isSuperAdmin()
    {
        return Auth::user()->isSuperAdmin();
    }

    /**
     * Obtiene la lista de permisos filtrada para el tenant.
     */
    private function getFilteredPermissions()
    {
        $query = Permission::query();

        // Si no es Super Admin, ocultar permisos globales/técnicos
        if (!$this->isSuperAdmin()) {
            $query->where('name', 'NOT LIKE', 'admin.category.%')
                  ->where('name', 'NOT LIKE', 'admin.countries.%')
                  ->where('name', 'NOT LIKE', 'admin.states.%')
                  ->where('name', 'NOT LIKE', 'admin.cities.%')
                  ->where('name', 'NOT LIKE', 'admin.subscriptionPlan.%')
                  ->where('name', 'NOT LIKE', 'admin.attribute.%');
        }

        return $query->get();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Role::with('permissions');
        
        // El rol Super Admin (virtual) no existe en DB, 
        // pero protegemos el rol 'owner' para que no sea manipulable por otros
        if (!$this->isSuperAdmin()) {
            $query->where('name', '!=', 'owner');
        }

        $roles = $query->get();
        $permissionsList = $this->getFilteredPermissions();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissionsList' => $permissionsList,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissionsList = $this->getFilteredPermissions();

        return Inertia::render('Roles/Create', [
            'permissionsList' => $permissionsList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        // Prohibir la creación de roles protegidos
        if (in_array(strtolower($request->name), ['super admin', 'owner'])) {
            abort(403, 'El nombre "' . $request->name . '" está reservado por el sistema.');
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web'
        ]);

        if ($request->has('permissions')) {
            // ✅ Validar que el usuario no intente asignar permisos prohibidos vía API/Postman
            $allowedIds = $this->getFilteredPermissions()->pluck('id')->toArray();
            $filteredPermissions = array_intersect($request->permissions, $allowedIds);
            
            $role->syncPermissions($filteredPermissions);
        }

        return to_route('roles.index')->with('success', 'Rol creado con éxito.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        // Proteger el rol owner de edición por otros
        if ($role->name === 'owner' && !$this->isSuperAdmin()) {
            abort(403, 'El rol "owner" es inmutable.');
        }

        $role->load('permissions');
        $permissionsList = $this->getFilteredPermissions();

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissionsList' => $permissionsList,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Role $role)
    {
        // No permitir renombrar nada a owner ni tocar el rol owner si no eres super admin
        if (in_array(strtolower($request->name), ['super admin', 'owner']) || ($role->name === 'owner' && !$this->isSuperAdmin())) {
            abort(403, 'El rol "owner" es inmutable.');
        }

        $role->update([
            'name' => $request->name,
        ]);

        if ($request->has('permissions')) {
            // ✅ Validar permisos permitidos
            $allowedIds = $this->getFilteredPermissions()->pluck('id')->toArray();
            $filteredPermissions = array_intersect($request->permissions, $allowedIds);

            $role->syncPermissions($filteredPermissions);
        }

        return to_route('roles.index')->with('success', 'Rol actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role->name === 'owner') {
            abort(403, 'El rol "owner" no puede ser eliminado ya que es vital para el sistema.');
        }

        $role->delete();
        return to_route('roles.index')->with('success', 'Rol eliminado con éxito.');
    }
}
