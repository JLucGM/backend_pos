<?php

namespace App\Http\Requests\Clients;

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
            'password' => 'required|string|min:8', // Validar la contraseña
            'avatar' => 'nullable|image|max:2048', // Validación para el avatar
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name is required.',
            'email.required' => 'The email is required.',
            'email.email' => 'The email must be a valid email address.',
            'email.unique' => 'The email has already been taken.',
            'phone.max' => 'The phone number may not be greater than 15 characters.',
            'identification.unique' => 'The identification has already been taken.',
            'is_active.required' => 'The is_active is required.',
            'password.required' => 'The password is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'avatar.image' => 'The avatar must be an image.',
            'avatar.max' => 'The avatar may not be greater than 2048 kilobytes.',
        ];
    }
}
