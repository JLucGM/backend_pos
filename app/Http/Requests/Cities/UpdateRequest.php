<?php

namespace App\Http\Requests\Cities;

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
        return [
            'city_name' => 'required|string|max:255',
            'state_id' => 'required|exists:states,id',
        ];
    }

    public function messages(): array
    {
        return [
            'city_name.required' => 'The city name is required.',
            'state_id.required' => 'The state ID is required.',
            'state_id.exists' => 'The selected state does not exist.',
        ];
    }
}
