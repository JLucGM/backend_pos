<?php

namespace App\Http\Requests\Products;

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
            'product_name' => 'required|string|max:255',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'attribute_names' => 'nullable|array|max:3',
            'attribute_names.*' => 'nullable|string|max:255',
            'attribute_values' => 'nullable|array',
            'attribute_values.*' => 'nullable|array',
            'attribute_values.*.*' => 'nullable|string|max:255',
            'prices' => 'nullable|array', // Ensure prices is an array
            'stocks' => 'nullable|array', // Ensure stocks is an array
            'quantity' => 'required|integer|min:0',
            'product_barcode' => 'nullable|string|max:255',
            'product_sku' => 'nullable|string|max:255',
            'images.*' => 'nullable|image|max:2048', // Add validation for images
            'tax_id' => 'nullable|exists:taxes,id', // Validar tax_id
            'is_active' => 'required|boolean', // Assuming is_active is a boolean
            'product_status_pos' => 'required|boolean', // Assuming product_status_pos is a boolean
        ];
    }

    public function messages(): array
    {
        return [
            'product_name.required' => 'The product name is required.',
            'product_name.string' => 'The product name must be a string.',
            'product_name.max' => 'The product name may not be greater than 255 characters.',
            'product_description.string' => 'The product description must be a string.',
            'product_price.required' => 'The product price is required.',
            'product_price.numeric' => 'The product price must be a number.',
            'categories.required' => 'The categories are required.',
            'categories.array' => 'The categories must be an array.',
            'categories.*.exists' => 'The selected category is invalid.',
            'attribute_names.array' => 'The attribute names must be an array.',
            'attribute_names.max' => 'The attribute names may not have more than 3 items.',
            'attribute_names.*.string' => 'The attribute name must be a string.',
            'attribute_names.*.max' => 'The attribute name may not be greater than 255 characters.',
            'attribute_values.array' => 'The attribute values must be an array.',
            'attribute_values.*.array' => 'The attribute values must be an array.',
            'attribute_values.*.*.string' => 'The attribute value must be a string.',
            'attribute_values.*.*.max' => 'The attribute value may not be greater than 255 characters.',
            'prices.array' => 'The prices must be an array.',
            'stocks.array' => 'The stocks must be an array.',
            'quantity.required' => 'The quantity is required.',
            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 0.',
            'product_barcode.string' => 'The product barcode must be a string.',
            'product_barcode.max' => 'The product barcode may not be greater than 255 characters.',
            'product_sku.string' => 'The product SKU must be a string.',
            'product_sku.max' => 'The product SKU may not be greater than 255 characters.',
            'images.*.image' => 'The image must be an image.',
            'images.*.max' => 'The image may not be greater than 2048 kilobytes.',
            'tax_id.exists' => 'The selected tax is invalid.',
            'is_active.required' => 'The is_active field is required.',
            'is_active.boolean' => 'The is_active must be true or false.',
            'product_status_pos.required' => 'The product status POS is required.',
            'product_status_pos.boolean' => 'The product status POS must be true or false.',
        ];
    }
}
