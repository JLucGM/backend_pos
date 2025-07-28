<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth; // Asegúrate de importar Auth

class CompanyScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        // Obtener el company_id del usuario autenticado
        // Asegúrate de que tu modelo User tenga una columna 'company_id'
        // y que el usuario esté autenticado.
        $companyId = Auth::check() ? Auth::user()->company_id : null;

        // Si hay un company_id, aplica el filtro
        if ($companyId) {
            $builder->where('company_id', $companyId);
        }
        // Si no hay company_id (ej. usuario no autenticado o no tiene company_id),
        // podrías decidir no mostrar ningún registro o dejar que la consulta siga sin este filtro.
        // Para multitenencia estricta, podrías incluso añadir un where('company_id', null)
        // para asegurar que no se vean registros de otras compañías si no hay un ID.
        // Por ahora, lo dejamos que no filtre si no hay company_id.
    }
}