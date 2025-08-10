<?php

namespace App\Http\Requests\Discounts;

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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|string|in:percentage,fixed_amount',
            'value' => 'required|numeric|min:0',
            'applies_to' => 'required|string|in:product,category,order_total',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:0',
            'code' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
            'automatic' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name is required.',
            'description.string' => 'The description must be a string.',
            'discount_type.required' => 'The discount type is required.',
            'discount_type.in' => 'The selected discount type is invalid.',
            'value.required' => 'The value is required.',
            'value.numeric' => 'The value must be a number.',
            'value.min' => 'The value must be at least 0.',
            'applies_to.required' => 'The applies to field is required.',
            'applies_to.in' => 'The selected applies to is invalid.',
            'start_date.required' => 'The start date is required.',
            'start_date.date' => 'The start date must be a valid date.',
            'end_date.required' => 'The end date is required.',
            'end_date.date' => 'The end date must be a valid date.',
            'end_date.after' => 'The end date must be after the start date.',
            'minimum_order_amount.numeric' => 'The minimum order amount must be a number.',
            'minimum_order_amount.min' => 'The minimum order amount must be at least 0.',
            'usage_limit.integer' => 'The usage limit must be an integer.',
            'usage_limit.min' => 'The usage limit must be at least 0.',
            'code.string' => 'The code must be a string.',
            'code.max' => 'The code may not be greater than 255 characters.',
            'is_active.required' => 'The is active field is required.',
            'is_active.boolean' => 'The is active field must be true or false.',
            'automatic.boolean' => 'The automatic field must be true or false.',
        ];
    }

}
