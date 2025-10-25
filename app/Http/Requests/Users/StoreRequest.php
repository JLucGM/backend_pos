<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:15',
            'identification' => 'nullable|string|unique:users',
            'is_active' => 'required|boolean',
            'role' => 'required|exists:roles,id', // Validar que el rol existe
            // 'store_id' => 'required|exists:stores,id', // Validar que el store_id existe
            'password' => 'required|string|min:8', // Validar la contraseña
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',
            'email.required' => 'The email is required.',
            'email.string' => 'The email must be a string.',
            'email.email' => 'The email must be a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',
            'email.unique' => 'The email has already been taken.',
            'phone.string' => 'The phone must be a string.',
            'phone.max' => 'The phone may not be greater than 15 characters.',
            'identification.string' => 'The identification must be a string.',
            'identification.unique' => 'The identification has already been taken.',
            'is_active.required' => 'The is_active is required.',
            'is_active.boolean' => 'The is_active must be true or false.',
            'role.required' => 'The role is required.',
            'role.exists' => 'The selected role is invalid.',
            // 'store_id.required' => 'The store is required.',
            // 'store_id.exists' => 'The selected store is invalid.',
            'password.required' => 'The password is required.',
            'password.string' => 'The password must be a string.',
            'password.min' => 'The password must be at least 8 characters.',
            'avatar.image' => 'The avatar must be an image.',
            'avatar.max' => 'The avatar may not be greater than 2048 kilobytes.',
        ];
    }
}
