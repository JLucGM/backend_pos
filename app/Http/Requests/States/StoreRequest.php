<?php

namespace App\Http\Requests\States;

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
            'state_name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
        ];
    }

    public function messages(): array
    {
        return [
            'state_name.required' => 'The state name is required.',
            'country_id.required' => 'The country ID is required.',
            'country_id.exists' => 'The selected country does not exist.',
        ];
    }
}
