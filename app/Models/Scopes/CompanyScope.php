<?php

// app/Models/Scopes/CompanyScope.php
namespace App\Models\Scopes;

use App\Services\CompanyManager; // <-- Usar el nuevo manager
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $companyId = CompanyManager::getCompanyId();

        // 1. Solo aplicar el filtro si el ID ya ha sido establecido por el middleware
        if ($companyId) {
            $builder->where('company_id', $companyId);
        }

        // 2. Opcional, pero esencial si el usuario está logeado en el panel:
        // Si el Global Scope está pensado para el PANEL DE CONTROL (dashboard), 
        // probablemente debas usar Auth::check() o un scope condicional.
    }
}