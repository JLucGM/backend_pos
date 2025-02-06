<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'avatarUrl' => $user->getFirstMediaUrl('avatars'), // Obtener la URL del avatar
            'user' => $user, // Pasar el usuario completo si es necesario
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
{
    $user = $request->user();
    
    // Llenar el modelo con los datos validados
    $user->fill($request->validated());

    // Manejar la actualización del avatar
    if ($request->hasFile('avatar')) {
        // Eliminar el avatar anterior si existe
        $user->clearMediaCollection('avatars'); // Elimina todos los avatares anteriores
        // Agregar el nuevo avatar
        $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
    }

    // Guardar los cambios
    $user->save();

    return Redirect::route('profile.edit');
}

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
