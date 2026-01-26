<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'subscription_plan_id',
        'status',
        'billing_cycle',
        'amount',
        'currency',
        'starts_at',
        'ends_at',
        'trial_ends_at',
        'cancelled_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Relación con la empresa
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relación con el plan de suscripción
     */
    public function plan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    /**
     * Relación con los pagos
     */
    public function payments()
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    /**
     * Scope para suscripciones activas
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope para suscripciones en período de prueba
     */
    public function scopeTrial($query)
    {
        return $query->where('status', 'trial');
    }

    /**
     * Scope para suscripciones expiradas
     */
    public function scopeExpired($query)
    {
        return $query->where('ends_at', '<', now());
    }

    /**
     * Verificar si la suscripción está activa
     */
    public function isActive()
    {
        return $this->status === 'active' && $this->ends_at > now();
    }

    /**
     * Verificar si está en período de prueba
     */
    public function onTrial()
    {
        return $this->status === 'trial' && 
               $this->trial_ends_at && 
               $this->trial_ends_at > now();
    }

    /**
     * Verificar si la suscripción ha expirado
     */
    public function expired()
    {
        return $this->ends_at < now();
    }

    /**
     * Días restantes de la suscripción
     */
    public function daysRemaining()
    {
        if ($this->onTrial()) {
            return $this->trial_ends_at->diffInDays(now());
        }
        
        return $this->ends_at->diffInDays(now());
    }

    /**
     * Cancelar la suscripción
     */
    public function cancel()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Renovar la suscripción
     */
    public function renew($months = 1)
    {
        $this->update([
            'status' => 'active',
            'ends_at' => $this->billing_cycle === 'yearly' 
                ? $this->ends_at->addYear() 
                : $this->ends_at->addMonths($months),
        ]);
    }
}