<?php

namespace App\Http\Requests\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

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
     */
    public function rules(): array
    {
        $companyId = Auth::user()->company_id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // Único por nombre y compañía
                Rule::unique('roles', 'name')->where(fn ($query) => $query->where('company_id', $companyId))
            ],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del rol es obligatorio.',
            'name.unique' => 'Ya existe un rol con este nombre en tu empresa.',
            'permissions.array' => 'Los permisos deben ser una lista.',
            'permissions.*.exists' => 'Uno de los permisos seleccionados no es válido.',
        ];
    }
}
