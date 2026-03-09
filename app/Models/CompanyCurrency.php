<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyCurrency extends Model
{
    protected $fillable = [
        'company_id',
        'currency_id',
        'exchange_rate',
        'is_base',
        'is_active',
    ];

    protected $casts = [
        'exchange_rate' => 'decimal:8',
        'is_base' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function booted()
    {
        // Aplicar el ámbito global de compañía
        static::addGlobalScope(new CompanyScope);
    }

    /**
     * Relación con la moneda maestra
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    /**
     * Relación con la empresa
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
