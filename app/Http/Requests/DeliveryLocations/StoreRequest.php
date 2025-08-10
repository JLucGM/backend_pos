<?php

namespace App\Http\Requests\DeliveryLocations;

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
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:500',
            'country_id' => 'nullable|exists:countries,id',
            'state_id' => 'nullable|exists:states,id',
            'city_id' => 'nullable|exists:cities,id',
            'is_default' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'address_line_1.required' => 'La dirección es obligatoria.',
            'address_line_1.string' => 'La dirección debe ser un texto.',
            'address_line_1.max' => 'La dirección no puede tener más de 255 caracteres.',
            'address_line_2.string' => 'La dirección 2 debe ser un texto.',
            'address_line_2.max' => 'La dirección 2 no puede tener más de 255 caracteres.',
            'postal_code.string' => 'El código postal debe ser un texto.',
            'postal_code.max' => 'El código postal no puede tener más de 20 caracteres.',
            'phone_number.string' => 'El número de teléfono debe ser un texto.',
            'phone_number.max' => 'El número de teléfono no puede tener más de 20 caracteres.',
            'notes.string' => 'Las notas deben ser un texto.',
            'notes.max' => 'Las notas no pueden tener más de 500 caracteres.',
            'country_id.exists' => 'El país seleccionado no es válido.',
            'state_id.exists' => 'El estado seleccionado no es válido.',
            'city_id.exists' => 'La ciudad seleccionada no es válida.',
            'is_default.required' => 'El campo predeterminado es obligatorio.',
            'is_default.boolean' => 'El campo predeterminado debe ser verdadero o falso.',
        ];
    }

}
