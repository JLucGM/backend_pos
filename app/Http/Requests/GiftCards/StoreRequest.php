<?php

namespace App\Http\Requests\GiftCards;

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
            'code' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'initial_balance' => 'required|numeric|min:0',
            'expiration_date' => 'nullable|date',
            'is_active' => 'boolean',
            'user_id' => 'nullable|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'The code is required.',
            'code.string' => 'The code must be a string.',
            'code.max' => 'The code may not be greater than 255 characters.',
            'description.string' => 'The description must be a string.',
            'description.max' => 'The description may not be greater than 255 characters.',
            'initial_balance.required' => 'The initial balance is required.',
            'initial_balance.numeric' => 'The initial balance must be a number.',
            'initial_balance.min' => 'The initial balance must be at least 0.',
            'expiration_date.date' => 'The expiration date must be a valid date.',
            'is_active.boolean' => 'The is active field must be true or false.',
            'user_id.exists' => 'The selected user is invalid.',
        ];
    }

}
