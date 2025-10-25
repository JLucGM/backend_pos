<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:15',
            'is_active' => 'required|boolean',
            'role' => 'required|exists:roles,id',
            'identification' => 'nullable|string|unique:users,identification,' . $user->id,
            // 'store_id' => 'required|exists:stores,id', // Asegúrate de validar el store_id
            'password' => 'nullable|string|min:8', // La contraseña es opcional
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => $this->route('user')->id,
        ]);
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'phone.max' => 'El número de teléfono no puede tener más de 15 caracteres.',
            'is_active.required' => 'El estado es obligatorio.',
            'role.required' => 'El rol es obligatorio.',
            'role.exists' => 'El rol seleccionado no es válido.',
            'identification.unique' => 'La identificación ya está en uso.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'avatar.image' => 'El avatar debe ser una imagen.',
            'avatar.max' => 'El avatar no puede tener más de 2 MB.',
        ];
    }
}
