<?php

namespace App\Http\Requests\Clients;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Client; // Asegúrate de importar el modelo Client

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Cambia esto a true o implementa la lógica de autorización adecuada
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obtén el cliente desde la ruta
        $client = $this->route('client'); // Asegúrate de que el nombre de la ruta sea correcto

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $client->id,
            'phone' => 'nullable|string|max:15',
            'status' => 'required|boolean',
            'role' => 'required|exists:roles,id',
            'identification' => 'nullable|string|unique:users,identification,' . $client->id,
            // 'store_id' => 'required|exists:stores,id', // Asegúrate de validar el store_id
            'password' => 'nullable|string|min:8', // La contraseña es opcional
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
            'status.required' => 'The status is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'avatar.image' => 'The avatar must be an image.',
            'avatar.max' => 'The avatar may not be greater than 2048 kilobytes.',
        ];
    }
}
