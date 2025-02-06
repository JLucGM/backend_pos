<?php

namespace App\Http\Controllers;

// use App\Http\Requests\Users\StoreRequest;
// use App\Http\Requests\Users\UpdateRequest;
use App\Models\User;
use App\Models\Role;
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
    $users = User::with('media')->get(); // Asegúrate de cargar la relación media
    $roles = Role::all();

    $user = Auth::user();
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
        $roles = Role::where('name', '!=', 'client')->get();
        $role = $user->getRoleNames();

        return Inertia::render('User/Create', compact('roles','role'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->only('name', 'email', 'phone', 'status', 'role');

        $data['password'] = bcrypt($request['password']);

        // AGREGAR AVATAR
        // if ($request->hasFile('avatar')) {
        //     $image = $request->file('avatar');
        //     $nombreImagen = time() . '_' . $image->getClientOriginalName(); // Asegúrate de que el nombre sea único
        //     $image->move(public_path('img/profile'), $nombreImagen);

        //     // Guardar la ruta completa del avatar
        //     $data['avatar'] = asset('img/profile/' . $nombreImagen); // Guarda la URL completa
        // } else {
        //     $data['avatar'] = asset('img/profile/default.jpg'); // Guarda la URL por defecto
        // }

        
        $user = User::create($data); // Crear el nuevo usuario
        
        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }
        // Asignar el rol al usuario
        if ($request->filled('role')) {
            $user->assignRole($request->input('role'));
        }

        return to_route('user.index'); // Redirigir a la lista de usuarios
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
        $user->load('roles', 'media');
        $user->avatar_url = $user->getFirstMediaUrl('avatars'); // Asegúrate de que 'avatars' sea el nombre de la colección

        $roles = Role::where('name', '!=', 'client')->get();

        $users = Auth::user();
        $role = $users->getRoleNames();
        $permission = $users->getAllPermissions();

        return Inertia::render('User/Edit', compact('user', 'roles','role','permission'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->only('name', 'email', 'phone', 'status', 'role');

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request['password']);
        }

        // if ($request->hasFile('avatar')) {
        //     $image = $request->file('avatar');
        //     $nombreImagen = time() . '_' . $image->getClientOriginalName(); // Asegúrate de que el nombre sea único
        //     $image->move(public_path('img/profile'), $nombreImagen);

        //     // Guardar la ruta completa del avatar
        //     $data['avatar'] = asset('img/profile/' . $nombreImagen); // Guarda la URL completa

        //     // Eliminar la imagen existente si no es el por defecto
        //     if ($user->avatar != 'default.jpg') {
        //         // Eliminar la imagen existente
        //         unlink(public_path('img/profile/' . basename($user->avatar)));
        //     }
        // } else {
        //     // Si no se sube una nueva imagen, conservar la existente
        //     $data['avatar'] = $user->avatar; // Mantener la URL existente
        // }

        $user->update($data); // Actualizar el usuario con los nuevos datos

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
