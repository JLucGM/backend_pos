<?php

namespace App\Http\Controllers;

// use App\Http\Requests\Users\StoreRequest;
// use App\Http\Requests\Users\UpdateRequest;
use App\Models\User;
use App\Models\Role;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
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
        // $this->middleware('can:admin.user.delete')->only('delete');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Cargar todos los usuarios que no sean super admin
        $users = User::with('media', 'roles')
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'super admin');
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

        return Inertia::render('User/Index', compact('users', 'roles', 'role', 'permission'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        // $stores = Store::all();

        $roles = Role::where('name', '!=', 'super admin')->get();
        $role = $user->getRoleNames();

        return Inertia::render('User/Create', compact('roles', 'role'));
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
            'role' => 'required|exists:roles,id', // Validar que el rol existe
            // 'store_id' => 'required|exists:stores,id', // Validar que el store_id existe
            'password' => 'required|string|min:8', // Validar la contraseña
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ]);

        // Obtener los datos de la solicitud
        $data = $request->only('name', 'email', 'phone', 'status', 'identification');

        // Encriptar la contraseña
        $data['password'] = bcrypt($request['password']);

        // Crear el nuevo usuario
        $user = User::create($data);

        // Manejar la carga del avatar
        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        // Asignar el rol al usuario
        if ($request->filled('role')) {
            // Obtener el nombre del rol usando el ID
            $roleId = $request->input('role');
            $role = Role::find($roleId); // Asegúrate de importar el modelo Role

            if ($role) {
                $user->assignRole($role->name); // Asignar el rol usando el nombre
            }
        }

        // Relacionar el usuario con la tienda
        // if ($request->filled('store_id')) {
        //     $user->stores()->attach($request->input('store_id'));
        // }

        // return to_route('user.index'); // Redirigir a la lista de usuarios
        return to_route('user.edit', $user->slug)->with('success', 'Producto creado con éxito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $users = Auth::user();

        if (!Auth::user()->hasRole('super admin')) {
            if ($users->company_id !== $user->company_id) {
                abort(403, 'No tienes permiso para esta operación.');
            }
        }

        $user->load('roles', 'media')->get();
        $user->avatar_url = $user->getFirstMediaUrl('avatars'); // Asegúrate de que 'avatars' sea el nombre de la colección

        $roles = Role::where('name', '!=', 'super admin')->get();
        // $stores = Store::all();
        //  $stores = Store::where('company_id', $users->company_id)->get();

        $role = $users->getRoleNames();
        $permission = $users->getAllPermissions();

        return Inertia::render('User/Edit', compact('user', 'roles', 'role', 'permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // if (!Auth::user()->hasRole('super admin')) {
        //     $users = Auth::user();
        //     if ($users->company_id !== $user->company_id) {
        //         abort(403, 'No tienes permiso para esta operación.');
        //     }
        // }

        // Validar la solicitud
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15',
            'status' => 'required|boolean',
            'role' => 'required|exists:roles,id',
            'identification' => 'nullable|string|unique:users,identification,' . $user->id,
            // 'store_id' => 'required|exists:stores,id', // Asegúrate de validar el store_id
            'password' => 'nullable|string|min:8', // La contraseña es opcional
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ]);

        // Obtener los datos de la solicitud
        $data = $request->only('name', 'email', 'phone', 'status', 'identification');

        // Encriptar la contraseña si se proporciona
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request['password']);
        }

        // Actualizar el usuario con los nuevos datos
        $user->update($data);

        // Manejar la carga del avatar
        if ($request->hasFile('avatar')) {
            // Eliminar el avatar anterior si existe
            $user->clearMediaCollection('avatars'); // Elimina todos los avatares anteriores
            // Agregar el nuevo avatar
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        // Actualizar el rol del usuario
        if ($request->filled('role')) {
            // Sincronizar roles
            $user->syncRoles([$request->input('role')]);
        }

        // Relacionar el usuario con la tienda
        // if ($request->filled('store_id')) {
        //     // Sincronizar tiendas
        //     $user->stores()->sync([$request->input('store_id')]);
        // }

        return to_route('user.edit', $user); // Redirigir a la edición del usuario
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Verificar si el avatar existe y no es el default
        if ($user->avatar && $user->avatar != asset('img/profile/default.jpg')) {
            // Extraer el nombre del archivo de la URL completa
            $nombreAvatar = basename($user->avatar);

            // Verificar que el archivo exista antes de intentar eliminarlo
            if (file_exists(public_path('img/profile/' . $nombreAvatar))) {
                unlink(public_path('img/profile/' . $nombreAvatar));
            }
        }

        // Eliminar el usuario
        $user->delete();
    }
}
