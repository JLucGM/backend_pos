<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Role;
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
    public function store(Request $request)
    {
        // Validar la solicitud
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:15',
            'identification' => 'nullable|string|unique:users',
            'status' => 'required|boolean',
            'password' => 'required|string|min:8', // Validar la contraseña
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ]);

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
    public function show(Client $client)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $client)
    {
         $user = Auth::user();
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

        return Inertia::render('Clients/Edit', compact('client', 'role', 'permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $client)
    {
         // Validar que el usuario autenticado tenga permiso
        $authUser = Auth::user();
        if (!$authUser->hasRole('super admin') && $authUser->company_id !== $client->company_id) {
            abort(403, 'No tienes permiso para esta operación.');
        }
        // Validar los datos del formulario
        // $validatedData = $request->validate([
        //     'name' => 'required|string|max:255',
        //     'identification' => 'required|string|max:255|unique:clients,identification,'.$client->id,
        //     'phone' => 'required|string|max:20',
        // ]);
        // Actualizar el cliente
        $client->update($request->only('name', 'email', 'phone', 'status', 'identification'));
        // Manejar la actualización del avatar si se proporciona
        if ($request->hasFile('avatar')) {
            $client->clearMediaCollection('avatars');
            $client->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }



        return to_route('client.edit', $client); // Redirigir a la edición del usuario
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
