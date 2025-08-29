<?php

namespace App\Http\Requests\Orders;

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
            'status' => 'required|string|max:255',
            'total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'totaldiscounts' => 'nullable|numeric|min:0',
            'direction_delivery' => 'nullable|string|max:255',
            'payments_method_id' => 'required|exists:payments_methods,id',
            'user_id' => 'nullable|exists:users,id',
            'order_items' => 'required|array|min:1',
            'order_items.*.id' => 'nullable', // Permitir IDs numéricos (existentes) o UUIDs (temporales)
            'order_items.*.product_id' => 'nullable|exists:products,id', // 'nullable' porque puede no venir si no se modifica el producto
            'order_items.*.name_product' => 'nullable|string|max:255', // 'nullable'
            'order_items.*.product_price' => 'nullable|numeric|min:0', // 'nullable'
            'order_items.*.original_display_price' => 'nullable|numeric|min:0',
            'order_items.*.quantity' => 'nullable|integer|min:1', // 'nullable'
            'order_items.*.subtotal' => 'nullable|numeric|min:0', // 'nullable'
            'order_items.*.combination_id' => 'nullable|exists:combinations,id',
            'order_items.*.product_details' => 'nullable|string',

            'order_items.*.tax_rate' => 'required|numeric|min:0',       // <-- Añadido
        'order_items.*.tax_amount' => 'required|numeric|min:0',     // <-- Añadido

        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'The status is required.',
            'status.string' => 'The status must be a string.',
            'status.max' => 'The status may not be greater than 255 characters.',
            'total.required' => 'The total is required.',
            'total.numeric' => 'The total must be a number.',
            'total.min' => 'The total must be at least 0.',
            'subtotal.required' => 'The subtotal is required.',
            'subtotal.numeric' => 'The subtotal must be a number.',
            'subtotal.min' => 'The subtotal must be at least 0.',
            'totaldiscounts.numeric' => 'The total discounts must be a number.',
            'totaldiscounts.min' => 'The total discounts must be at least 0.',
            'direction_delivery.string' => 'The delivery direction must be a string.',
            'direction_delivery.max' => 'The delivery direction may not be greater than 255 characters.',
            'payments_method_id.required' => 'The payments method is required.',
            'payments_method_id.exists' => 'The selected payments method is invalid.',
            'user_id.exists' => 'The selected user is invalid.',
            'order_items.required' => 'The order items are required.',
            'order_items.array' => 'The order items must be an array.',
            'order_items.min' => 'The order must have at least one item.',
            'order_items.*.id' => 'The item ID must be a valid ID.',
            'order_items.*.product_id.exists' => 'The selected product is invalid.',
            'order_items.*.name_product.string' => 'The product name must be a string.',
            'order_items.*.name_product.max' => 'The product name may not be greater than 255 characters.',
            'order_items.*.product_price.numeric' => 'The product price must be a number.',
            'order_items.*.product_price.min' => 'The product price must be at least 0.',
            'order_items.*.original_display_price.numeric' => 'The original display price must be a number.',
            'order_items.*.original_display_price.min' => 'The original display price must be at least 0.',
            'order_items.*.quantity.integer' => 'The quantity must be an integer.',
            'order_items.*.quantity.min' => 'The quantity must be at least 1.',
            'order_items.*.subtotal.numeric' => 'The subtotal must be a number.',
            'order_items.*.subtotal.min' => 'The subtotal must be at least 0.',
            'order_items.*.combination_id.exists' => 'The selected combination is invalid.',
            'order_items.*.product_details.string' => 'The product details must be a string.',

            'tax_rate.required' => 'La tasa de impuesto es requerida para cada ítem.',
'tax_rate.numeric' => 'La tasa de impuesto debe ser un número válido.',
'tax_rate.min' => 'La tasa de impuesto no puede ser negativa.',
'tax_amount.required' => 'El monto de impuesto es requerido para cada ítem.',
'tax_amount.numeric' => 'El monto de impuesto debe ser un número válido.',
'tax_amount.min' => 'El monto de impuesto no puede ser negativo.',

        ];
    }
}
