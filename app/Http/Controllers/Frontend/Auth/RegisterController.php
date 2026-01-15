<?php

namespace App\Http\Controllers\Frontend\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RegisterController extends Controller
{
    /**
     * Mostrar formulario de registro para clientes
     */
    public function create(Request $request)
    {
        $company = $request->attributes->get('company');

        return Inertia::render('Frontend/Auth/Register', [
            'companyId' => $company->id,
            'companyName' => $company->company_name,
            'termsUrl' => route('frontend.page.show', [
                'company_slug' => $company->slug,
                'page_path' => 'terminos-de-servicio'
            ]),
            'privacyUrl' => route('frontend.page.show', [
                'company_slug' => $company->slug,
                'page_path' => 'politicas-de-privacidad'
            ]),
        ]);
    }

    /**
     * Registrar nuevo cliente
     */
    public function store(Request $request)
    {
        $company = $request->attributes->get('company');

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,NULL,id,company_id,' . $company->id
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'terms' => ['required', 'accepted'],
        ]);

        // Crear usuario cliente
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'company_id' => $company->id,
            'is_active' => true, // Por defecto activo
        ]);

        // Asignar rol de cliente
        $clientRole = Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);
        $user->assignRole($clientRole);

        // Evento de registro (para enviar email de verificación si es necesario)
        event(new Registered($user));

        // Autenticar al usuario automáticamente después del registro
        Auth::login($user);

        $request->session()->regenerate();

        // Redirigir al home o página anterior
        return redirect()->intended('/');
    }
}
