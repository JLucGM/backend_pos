<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeliveryLocations\StoreRequest as DeliveryLocationsStoreRequest;
use App\Http\Requests\DeliveryLocations\UpdateRequest as DeliveryLocationsUpdateRequest;
use App\Http\Requests\Users\StoreRequest;
use App\Http\Requests\Users\UpdateRequest;
use App\Models\City;
use App\Models\Country;
use App\Models\DeliveryLocation;
use App\Models\User;
use App\Models\Role;
use App\Models\State;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');

        $this->middleware('can:admin.user.index')->only('index');
        $this->middleware('can:admin.user.create')->only('create', 'store');
        $this->middleware('can:admin.user.edit')->only('edit', 'update');
    }

    /**
     * Verifica si el usuario actual es el Super Admin (vía email).
     */
    private function isSuperAdmin()
    {
        return Auth::user()->isSuperAdmin();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authUser = Auth::user();
        $isSuperAdmin = $this->isSuperAdmin();

        $query = User::with('media', 'roles');

        // Los Super Admins reales (vía email) son protegidos
        if (!$isSuperAdmin) {
            $query->where('email', '!=', config('app.super_admin_email'));
            $query->where('company_id', $authUser->company_id);
            
            // ✅ Protegemos a los dueños (owner): No son visibles para otros empleados
            $query->whereDoesntHave('roles', function($q) {
                $q->where('name', 'owner');
            });
        }

        $users = $query->get();
        
        // ✅ Filtrar roles disponibles: 'owner' no se puede asignar manualmente
        $rolesQuery = Role::query();
        if (!$isSuperAdmin) {
            $rolesQuery->where('name', '!=', 'owner');
        }
        $roles = $rolesQuery->get();

        $roleNames = $authUser->getRoleNames();
        $permission = $authUser->getAllPermissions();

        foreach ($users as $user) {
            $user->avatar_url = $user->getFirstMediaUrl('avatars');
        }

        return Inertia::render('User/Index', [
            'users' => $users,
            'roles' => $roles,
            'role' => $roleNames,
            'permission' => $permission
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $authUser = Auth::user();
        $isSuperAdmin = $this->isSuperAdmin();

        // ✅ No permitir asignar el rol 'owner' manualmente
        $rolesQuery = Role::query();
        if (!$isSuperAdmin) {
            $rolesQuery->where('name', '!=', 'owner');
        }
        $roles = $rolesQuery->get();

        $roleNames = $authUser->getRoleNames();

        return Inertia::render('User/Create', [
            'roles' => $roles,
            'role' => $roleNames
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $authUser = Auth::user();
        $isSuperAdmin = $this->isSuperAdmin();

        // No se puede crear un usuario con el email protegido
        if ($request->email === config('app.super_admin_email') && !$isSuperAdmin) {
            abort(403, 'Este email está reservado para el Super Administrador del sistema.');
        }

        // ✅ Validar que no se intente asignar el rol 'owner' si no es Super Admin
        if ($request->filled('role')) {
            $role = Role::find($request->input('role'));
            if ($role && $role->name === 'owner' && !$isSuperAdmin) {
                abort(403, 'No tienes permiso para asignar el rol de Dueño (Owner).');
            }
        }

        $data = array_merge(
            $request->only('name', 'email', 'phone', 'is_active', 'identification'),
            ['company_id' => $authUser->company_id]
        );

        $data['password'] = bcrypt($request['password']);
        $user = User::create($data);

        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        if ($request->filled('role')) {
            $role = Role::find($request->input('role'));
            if ($role) {
                $user->assignRole($role->name);
            }
        }

        return to_route('user.edit', $user->slug)->with('success', 'Usuario creado con éxito.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $authUser = Auth::user();
        $isSuperAdmin = $this->isSuperAdmin();

        // Proteger al Super Admin real de edición
        if ($user->email === config('app.super_admin_email') && !$isSuperAdmin) {
            abort(403, 'No tienes permiso para editar al Super Administrador.');
        }

        // ✅ Proteger al 'owner' de edición por parte de otros usuarios
        if ($user->hasRole('owner') && !$isSuperAdmin) {
            abort(403, 'No tienes permiso para editar al Dueño de la compañía.');
        }

        // Proteger pertenencia a compañía
        if (!$isSuperAdmin && $authUser->company_id !== $user->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }

        $user->load('roles', 'media');
        $user->avatar_url = $user->getFirstMediaUrl('avatars');

        // ✅ Filtrar roles para asignar
        $rolesQuery = Role::query();
        if (!$isSuperAdmin) {
            $rolesQuery->where('name', '!=', 'owner');
        }
        $roles = $rolesQuery->get();

        $roleNames = $authUser->getRoleNames();
        $permission = $authUser->getAllPermissions();
        $countries = Country::all();
        $states = State::all();
        $cities = City::all();
        $deliveryLocations = $user->deliveryLocations()->with(['city', 'state', 'country'])->get();

        return Inertia::render('User/Edit', compact('user', 'roles', 'roleNames', 'permission', 'countries', 'states', 'cities', 'deliveryLocations'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, User $user)
    {
        $authUser = Auth::user();
        $isSuperAdmin = $this->isSuperAdmin();

        // Proteger al Super Admin real de actualización
        if ($user->email === config('app.super_admin_email') && !$isSuperAdmin) {
            abort(403, 'No tienes permiso para editar al Super Administrador.');
        }

        // ✅ Proteger al 'owner'
        if ($user->hasRole('owner') && !$isSuperAdmin) {
            abort(403, 'No tienes permiso para modificar al Dueño de la compañía.');
        }

        // ✅ Validar asignación de rol 'owner'
        if ($request->filled('role')) {
            $role = Role::find($request->input('role'));
            if ($role && $role->name === 'owner' && !$isSuperAdmin) {
                abort(403, 'No tienes permiso para asignar el rol de Dueño (Owner).');
            }
        }

        $data = $request->only('name', 'email', 'phone', 'is_active', 'identification');

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request['password']);
        }

        $user->update($data);

        if ($request->hasFile('avatar')) {
            $user->clearMediaCollection('avatars');
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        if ($request->filled('role')) {
            $role = Role::find($request->input('role'));
            if ($role) {
                $user->syncRoles([$role->name]);
            }
        }

        return to_route('user.edit', $user->slug)->with('success', 'Usuario actualizado con éxito.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $isSuperAdmin = $this->isSuperAdmin();

        // El Super Admin real es inmortal
        if ($user->email === config('app.super_admin_email')) {
            abort(403, 'El Super Administrador no puede ser eliminado.');
        }

        // ✅ El rol 'owner' es protegido: un empleado no puede borrar a su jefe
        if ($user->hasRole('owner') && !$isSuperAdmin) {
            abort(403, 'El Dueño de la compañía no puede ser eliminado.');
        }

        if (Auth::id() === $user->id) {
            abort(403, 'No puedes eliminar tu propia cuenta.');
        }

        $user->clearMediaCollection('avatars');
        $user->delete();
        
        return to_route('user.index')->with('success', 'Usuario eliminado.');
    }

    public function storeDeliveryLocation(DeliveryLocationsStoreRequest $request, User $user)
    {
        DB::transaction(function () use ($user, $request) {
            if ($request['is_default']) {
                $user->deliveryLocations()->update(['is_default' => false]);
            }
            $user->deliveryLocations()->create($request->validated());
        });

        return redirect()->back();
    }

    public function updateDeliveryLocation(DeliveryLocationsUpdateRequest $request, User $user, DeliveryLocation $deliveryLocation)
    {
        DB::transaction(function () use ($user, $deliveryLocation, $request) {
            if ($request['is_default']) {
                $user->deliveryLocations()
                    ->where('id', '!=', $deliveryLocation->id)
                    ->update(['is_default' => false]);
            }
            $deliveryLocation->update($request->validated());
        });

        return redirect()->route('user.edit', $user->slug)->with('success', 'Dirección de entrega actualizada con éxito.');
    }
}
