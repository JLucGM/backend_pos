<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'yearly_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'is_active' => ['required', 'boolean'],
            'is_trial' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'trial_days' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'limits' => ['nullable', 'array'],
            'limits.staff_users' => ['nullable', 'integer'],
            'limits.stores' => ['nullable', 'integer'],
            'limits.pages' => ['nullable', 'integer'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'description' => 'descripción',
            'price' => 'precio',
            'yearly_price' => 'precio anual',
            'currency' => 'moneda',
            'is_active' => 'estado',
            'is_trial' => 'plan de prueba',
            'is_featured' => 'plan destacado',
            'trial_days' => 'días de prueba',
            'features' => 'características',
            'limits' => 'límites',
            'sort_order' => 'orden de visualización',
        ];
    }
}
