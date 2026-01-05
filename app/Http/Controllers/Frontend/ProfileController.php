<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Mostrar formulario de perfil del cliente
     */
    public function edit(Request $request)
    {
        $company = $request->attributes->get('company');
        $user = Auth::user();
        
        return Inertia::render('Frontend/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'deliveryLocations' => $user->deliveryLocations,
            'companyName' => $company->company_name,
        ]);
    }
    
    /**
     * Actualizar perfil del cliente
     */
    public function update(Request $request)
    {
        $company = $request->attributes->get('company');
        $user = Auth::user();
        
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)->where('company_id', $company->id)
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'current_password' => ['nullable', 'required_with:password', 'current_password'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);
        
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();
        
        return redirect()->back()->with('success', 'Perfil actualizado correctamente.');
    }
}