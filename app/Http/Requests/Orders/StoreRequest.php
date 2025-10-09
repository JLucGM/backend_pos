<?php

namespace App\Http\Requests\Orders;

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
           'status' => 'required|string|max:255',
            'total' => 'required|numeric|min:0', // Asegura que el total sea no negativo
            'subtotal' => 'required|numeric|min:0', // Valida el subtotal
            'tax_amount' => 'required|numeric|min:0', // AÑADIDO: Validación para el tax_amount total del pedido
            'totaldiscounts' => 'nullable|numeric|min:0', // Valida los descuentos
            'delivery_location_id' => 'nullable|exists:delivery_locations,id', // Validación para delivery_location_id
            'payments_method_id' => 'required|exists:payments_methods,id',
            'order_origin' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id', // Añade la validación para el usuario
            'order_items' => 'required|array|min:1', // Debe haber al menos un producto en la orden
            'order_items.*.product_id' => 'required|exists:products,id', // Valida el product_id para cada item
            'order_items.*.name_product' => 'required|string|max:255',
            'order_items.*.product_price' => 'required|numeric|min:0', // Usar product_price aquí (precio efectivo)
            'order_items.*.original_display_price' => 'nullable|numeric|min:0', // Para el precio original tachado
            'order_items.*.quantity' => 'required|integer|min:1',
            'order_items.*.subtotal' => 'required|numeric|min:0',
            'order_items.*.tax_amount' => 'required|numeric|min:0', // AÑADIDO: Validación para el tax_amount de cada ítem
            'order_items.*.combination_id' => 'nullable|exists:combinations,id', // Valida combination_id
            'order_items.*.product_details' => 'nullable|string', // Se asume que es una cadena JSON
            'manual_discount_code' => 'nullable|string|max:50', // AÑADIDO
          'manual_discount_amount' => 'nullable|numeric|min:0|max:999999',
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
            'tax_amount.required' => 'The tax amount is required.', // AÑADIDO
            'tax_amount.numeric' => 'The tax amount must be a number.', // AÑADIDO
            'tax_amount.min' => 'The tax amount must be at least 0.', // AÑADIDO
            'totaldiscounts.numeric' => 'The total discounts must be a number.',
            'totaldiscounts.min' => 'The total discounts must be at least 0.',
            // 'delivery_location_id.required' => 'The delivery location is required.',
            'delivery_location_id.exists' => 'The selected delivery location is invalid.',
            'payments_method_id.required' => 'The payments method is required.',
            'payments_method_id.exists' => 'The selected payments method is invalid.',
            'order_origin.required' => 'The order origin is required.',
            'order_origin.string' => 'The order origin must be a string.',
            'order_origin.max' => 'The order origin may not be greater than 255 characters.',
            'user_id.required' => 'The user is required.',
            'user_id.exists' => 'The selected user is invalid.',
            'order_items.required' => 'The order items are required.',
            'order_items.array' => 'The order items must be an array.',
            'order_items.min' => 'The order must have at least one item.',
            'order_items.*.product_id.required' => 'The product ID is required.',
            'order_items.*.product_id.exists' => 'The selected product is invalid.',
            'order_items.*.name_product.required' => 'The product name is required.',
            'order_items.*.name_product.string' => 'The product name must be a string.',
            'order_items.*.name_product.max' => 'The product name may not be greater than 255 characters.',
            'order_items.*.product_price.required' => 'The product price is required.',
            'order_items.*.product_price.numeric' => 'The product price must be a number.',
            'order_items.*.product_price.min' => 'The product price must be at least 0.',
            'order_items.*.original_display_price.numeric' => 'The original display price must be a number.',
            'order_items.*.original_display_price.min' => 'The original display price must be at least 0.',
            'order_items.*.quantity.required' => 'The quantity is required.',
            'order_items.*.quantity.integer' => 'The quantity must be an integer.',
            'order_items.*.quantity.min' => 'The quantity must be at least 1.',
            'order_items.*.subtotal.required' => 'The subtotal is required.',
            'order_items.*.subtotal.numeric' => 'The subtotal must be a number.',
            'order_items.*.subtotal.min' => 'The subtotal must be at least 0.',
            'order_items.*.tax_amount.required' => 'The item tax amount is required.', // AÑADIDO
            'order_items.*.tax_amount.numeric' => 'The item tax amount must be a number.', // AÑADIDO
            'order_items.*.tax_amount.min' => 'The item tax amount must be at least 0.', // AÑADIDO
            'order_items.*.combination_id.exists' => 'The selected combination is invalid.',
            'order_items.*.product_details.string' => 'The product details must be a string.',
            'manual_discount_code.string' => 'El código de descuento debe ser texto.',
          'manual_discount_code.max' => 'El código de descuento no puede exceder 50 caracteres.',
          'manual_discount_amount.numeric' => 'El monto de descuento manual debe ser un número.',
          'manual_discount_amount.min' => 'El monto de descuento manual no puede ser negativo.',
        ];
    }

}
