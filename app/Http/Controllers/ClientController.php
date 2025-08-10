<?php

namespace App\Http\Controllers;

use App\Http\Requests\Clients\StoreRequest;
use App\Http\Requests\Clients\UpdateRequest;
use App\Models\City;
use App\Models\Client;
use App\Models\Country;
use App\Models\Role;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:admin.client.index')->only('index');
        $this->middleware('can:admin.client.create')->only('create', 'store');
        $this->middleware('can:admin.client.edit')->only('edit', 'update');
        $this->middleware('can:admin.client.delete')->only('destroy');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Cargar todos los usuarios que no sean super admin y que tengan el rol de 'client'
        $users = User::with('media', 'roles')
            ->whereHas('roles', function ($query) {
                $query->where('name', 'client'); // Filtrar por el rol 'client'
            });

        // Si el usuario autenticado no es super admin, filtrar por company_id
        if (!$user->hasRole('super admin')) {
            $users->where('company_id', $user->company_id);
        }

        $users = $users->get(); // Obtener los usuarios filtrados

        $roles = Role::all();
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();

        // Agregar la URL del avatar a cada usuario
        foreach ($users as $user) {
            $user->avatar_url = $user->getFirstMediaUrl('avatars'); // 'avatars' es el nombre de la colección
        }

        return Inertia::render('Clients/Index', compact('users', 'roles', 'role', 'permission'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        // $stores = Store::all();

        // $roles = Role::where('name', '!=', 'super admin')->get();
        $role = $user->getRoleNames();

        return Inertia::render('Clients/Create', compact('role'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $user = Auth::user();

        // Obtener los datos de la solicitud
        $data = array_merge(
            $request->only('name', 'email', 'phone', 'status', 'identification'),
            ['company_id' => $user->company_id]
        );

        // Encriptar la contraseña
        $data['password'] = bcrypt($request['password']);

        // Crear el nuevo usuario
        $client  = User::create($data);

        // Manejar la carga del avatar
        if ($request->hasFile('avatar')) {
            $client->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        // Asignar el rol 'client' al nuevo usuario
        $client->assignRole('client'); // Asignar el rol 'client' por defecto

        return to_route('client.edit', $client)->with('success', 'Cliente creado con éxito.');
    }


    /**
     * Display the specified resource.
     */
    public function show(User $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $client)
    {
        $user = Auth::user();
        $countries = Country::all(); // Asegúrate de importar el modelo Country
        $states = State::all(); // Asegúrate de importar el modelo State
        $cities = City::all(); // Asegúrate de importar el modelo City
        
        if (!$user->hasRole('super admin')) {
            if ($user->company_id !== $client->company_id) {
                abort(403, 'No tienes permiso para esta operación.');
            }
        }

        $client->load('roles', 'media'); // Cargar roles y medios
        $client->avatar_url = $client->getFirstMediaUrl('avatars'); // Asegúrate de que 'avatars' sea el nombre de la colección
        // Cargar roles y permisos del usuario
        $role = $user->getRoleNames();
        $permission = $user->getAllPermissions();
        $deliveryLocations = $client->deliveryLocations()->with(['city', 'state', 'country'])->get();

        return Inertia::render('Clients/Edit', compact('client', 'role', 'permission', 'countries', 'states', 'cities', 'deliveryLocations'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, User $client)
    {
        // Obtener los datos de la solicitud
        $data = $request->only('name', 'email', 'phone', 'status', 'identification');

                // Encriptar la contraseña si se proporciona
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request['password']);
        }

        // Actualizar el usuario con los nuevos datos
        $client->update($data);

        // Manejar la carga del avatar
        if ($request->hasFile('avatar')) {
            // Eliminar el avatar anterior si existe
            $client->clearMediaCollection('avatars'); // Elimina todos los avatares anteriores
            // Agregar el nuevo avatar
            $client->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        // Actualizar el rol del usuario
        if ($request->filled('role')) {
            // Sincronizar roles
            $client->syncRoles([$request->input('role')]);
        }

        // Relacionar el usuario con la tienda
        // if ($request->filled('store_id')) {
        //     // Sincronizar tiendas
        //     $client->stores()->sync([$request->input('store_id')]);
        // }

        return to_route('client.edit', $client); // Redirigir a la edición del cliente
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $client)
    {
        // dd($client);
        $client->delete();
    }
}
