<?php

namespace App\Http\Controllers\Frontend\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Mostrar formulario de login para clientes
     */
    public function create(Request $request)
    {
        $company = $request->attributes->get('company');

        return Inertia::render('Frontend/Auth/Login', [
            'companyId' => $company->id,
            'companyName' => $company->company_name,
        ]);
    }

    /**
     * Autenticar cliente
     */
    public function store(Request $request)
    {
        \Log::info('=== LOGIN CONTROLLER START ===');
        \Log::info('Email: ' . $request->email);
        \Log::info('Session ID: ' . session()->getId());
        \Log::info('URL intended before login: ' . session()->get('url.intended'));

        $company = $request->attributes->get('company');
        \Log::info('Company: ' . ($company ? $company->id : 'null'));

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Buscar usuario
        $user = \App\Models\User::where('email', $request->email)
            ->where('company_id', $company->id)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'client');
            })
            ->first();

        \Log::info('User found: ' . ($user ? $user->id : 'null'));

        if (!$user || !Hash::check($request->password, $user->password)) {
            \Log::warning('Invalid credentials');
            throw ValidationException::withMessages([
                'email' => 'Las credenciales proporcionadas no son correctas.',
            ]);
        }

        if (!$user->is_active) {
            \Log::warning('User inactive');
            throw ValidationException::withMessages([
                'email' => 'Tu cuenta está desactivada.',
            ]);
        }

        // Iniciar sesión
        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        \Log::info('User authenticated: ' . auth()->id());
        \Log::info('URL intended after login: ' . session()->get('url.intended'));

        // Forzar redirección a la raíz
        \Log::info('Redirecting to: /');

        // return redirect('/');
        // return redirect()->route('subdomain.page');
        return back();
    }

    /**
     * Cerrar sesión del cliente
     */
    public function destroy(Request $request)
    {
        $company = $request->attributes->get('company');

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // return redirect()->route('subdomain.page', ['company_slug' => $company->slug]);
        return redirect('/');
    }
}
