<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class UsersApiController extends Controller
{
    public function show($id)
    {
        $user = User::find($id)->load('roles', 'permissions', 'media'); // Cargar roles, permisos y medios relacionados
        if (!$user) {
            return response()->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($user, Response::HTTP_OK);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Manejar la actualización del avatar
        if ($request->hasFile('avatar')) {
            // Eliminar el avatar anterior si existe
            $user->clearMediaCollection('avatars'); // Elimina todos los avatares anteriores
            // Agregar el nuevo avatar
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
        }

        $user->update($request->all());

        return response()->json($user, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted'], Response::HTTP_OK);
    }

}
