<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Company extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name', 
        'slug', 
        'phone', 
        'address',
        'email',
        'current_subscription_id',
        'is_trial',
        'trial_ends_at',
        'subscription_limits',
    ];

    protected $casts = [
        'is_trial' => 'boolean',
        'trial_ends_at' => 'datetime',
        'subscription_limits' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Si tienes otros modelos asociados a la empresa, como productos:
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    public function setting()
    {
        return $this->hasOne(Setting::class);
    }

    public function menus()
    {
        return $this->hasMany(Menu::class);
    }

    public function PaymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function shippingRates()
    {
        return $this->hasMany(ShippingRate::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function discounts()
    {
        return $this->hasMany(Discount::class);
    }

    // Relaciones de suscripción
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function currentSubscription()
    {
        return $this->belongsTo(Subscription::class, 'current_subscription_id');
    }

    public function subscriptionPayments()
    {
        return $this->hasMany(SubscriptionPayment::class);
    }

    // Métodos de suscripción
    public function hasActiveSubscription()
    {
        return $this->currentSubscription && $this->currentSubscription->isActive();
    }

    public function onTrial()
    {
        return $this->is_trial && $this->trial_ends_at && $this->trial_ends_at > now();
    }

    public function trialExpired()
    {
        return $this->is_trial && $this->trial_ends_at && $this->trial_ends_at < now();
    }

    public function canCreateOrders()
    {
        // Si tiene suscripción activa, puede crear órdenes
        if ($this->hasActiveSubscription()) {
            return true;
        }

        // Si está en período de prueba, no puede crear órdenes
        if ($this->onTrial()) {
            return false;
        }

        return false;
    }

    public function getSubscriptionLimit($key)
    {
        if ($this->hasActiveSubscription()) {
            return $this->currentSubscription->plan->getLimit($key);
        }

        // Límites para período de prueba
        $trialLimits = [
            'orders' => 0,
            'products' => 10,
            'users' => 1,
        ];

        return $trialLimits[$key] ?? null;
    }
}