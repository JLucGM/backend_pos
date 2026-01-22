<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\DeliveryLocation;
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
            'deliveryLocations' => $user->deliveryLocations()->with(['country', 'state', 'city'])->get(),
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

    /**
     * Crear nueva dirección de entrega
     */
    public function storeAddress(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_default' => ['boolean'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'state_id' => ['nullable', 'exists:states,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
        ]);

        // Si esta dirección se marca como principal, desmarcar las demás
        if ($request->is_default) {
            $user->deliveryLocations()->update(['is_default' => false]);
        }

        $deliveryLocation = $user->deliveryLocations()->create([
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'postal_code' => $request->postal_code,
            'phone_number' => $request->phone_number,
            'notes' => $request->notes,
            'is_default' => $request->is_default ?? false,
            'country_id' => $request->country_id,
            'state_id' => $request->state_id,
            'city_id' => $request->city_id,
        ]);

        return redirect()->back()->with('success', 'Dirección agregada correctamente.');
    }

    /**
     * Actualizar dirección de entrega
     */
    public function updateAddress(Request $request, DeliveryLocation $deliveryLocation)
    {
        $user = Auth::user();
        
        // Verificar que la dirección pertenece al usuario autenticado
        if ($deliveryLocation->user_id !== $user->id) {
            abort(403, 'No tienes permiso para editar esta dirección.');
        }
        
        $request->validate([
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:500'],
            'is_default' => ['boolean'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'state_id' => ['nullable', 'exists:states,id'],
            'city_id' => ['nullable', 'exists:cities,id'],
        ]);

        // Si esta dirección se marca como principal, desmarcar las demás
        if ($request->is_default) {
            $user->deliveryLocations()->where('id', '!=', $deliveryLocation->id)->update(['is_default' => false]);
        }

        $deliveryLocation->update([
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'postal_code' => $request->postal_code,
            'phone_number' => $request->phone_number,
            'notes' => $request->notes,
            'is_default' => $request->is_default ?? false,
            'country_id' => $request->country_id,
            'state_id' => $request->state_id,
            'city_id' => $request->city_id,
        ]);

        return redirect()->back()->with('success', 'Dirección actualizada correctamente.');
    }

    /**
     * Eliminar dirección de entrega
     */
    public function destroyAddress(DeliveryLocation $deliveryLocation)
    {
        $user = Auth::user();
        
        // Verificar que la dirección pertenece al usuario autenticado
        if ($deliveryLocation->user_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta dirección.');
        }

        // No permitir eliminar si es la única dirección y es la principal
        if ($deliveryLocation->is_default && $user->deliveryLocations()->count() === 1) {
            return redirect()->back()->with('error', 'No puedes eliminar tu única dirección principal.');
        }

        $deliveryLocation->delete();

        // Si era la dirección principal y hay otras, hacer principal la primera
        if ($deliveryLocation->is_default) {
            $firstAddress = $user->deliveryLocations()->first();
            if ($firstAddress) {
                $firstAddress->update(['is_default' => true]);
            }
        }

        return redirect()->back()->with('success', 'Dirección eliminada correctamente.');
    }
}