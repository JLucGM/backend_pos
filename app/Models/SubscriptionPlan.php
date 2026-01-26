<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'yearly_price',
        'currency',
        'is_active',
        'is_trial',
        'is_featured',
        'trial_days',
        'features',
        'limits',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'limits' => 'array',
        'is_active' => 'boolean',
        'is_trial' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
    ];

    /**
     * Relación con suscripciones
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Scope para planes activos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para planes de prueba
     */
    public function scopeTrial($query)
    {
        return $query->where('is_trial', true);
    }

    /**
     * Scope para planes de pago
     */
    public function scopePaid($query)
    {
        return $query->where('is_trial', false);
    }

    /**
     * Scope para planes destacados
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Obtener el precio según el ciclo de facturación
     */
    public function getPriceForCycle($cycle = 'monthly')
    {
        return $cycle === 'yearly' && $this->yearly_price ? $this->yearly_price : $this->price;
    }

    /**
     * Verificar si el plan tiene una característica específica
     */
    public function hasFeature($feature)
    {
        return in_array($feature, $this->features ?? []);
    }

    /**
     * Obtener el límite de una característica específica
     */
    public function getLimit($key)
    {
        return $this->limits[$key] ?? null;
    }
}