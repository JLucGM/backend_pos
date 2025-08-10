<?php

namespace App\Http\Requests\Taxes;

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
            'tax_name' => 'required|string|max:255',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'tax_description' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'tax_name.required' => 'The tax name is required.',
            'tax_name.string' => 'The tax name must be a string.',
            'tax_name.max' => 'The tax name may not be greater than 255 characters.',
            'tax_rate.required' => 'The tax rate is required.',
            'tax_rate.numeric' => 'The tax rate must be a number.',
            'tax_rate.min' => 'The tax rate must be at least 0.',
            'tax_rate.max' => 'The tax rate may not be greater than 100.',
            'tax_description.string' => 'The tax description must be a string.',
            'tax_description.max' => 'The tax description may not be greater than 255 characters.',
        ];
    }
}
