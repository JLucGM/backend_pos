<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Discount extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'discount_type',
        'value',
        'applies_to',
        'start_date',
        'end_date',
        'automatic',
        'minimum_order_amount',
        'usage_limit',
        'code',
        'is_active',
        'company_id'
    ];

    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
        'description' => 'string',
        'discount_type' => 'string',
        'value' => 'decimal:2',
        'applies_to' => 'string',
        'start_date' => 'datetime',
        'automatic' => 'boolean',
        'end_date' => 'datetime',
        'minimum_order_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'code' => 'string',
        'is_active' => 'boolean',
        'company_id' => 'integer'
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

    protected static function booted()
    {
        // Lógica para forzar usage_limit a null si el descuento es automático
        static::saving(function ($discount) {
            if ($discount->automatic && $discount->usage_limit !== null) {
                $discount->usage_limit = null; // Fuerza a null para descuentos automáticos
            }
        });
        // Agregar el global scope para CompanyScope
        static::addGlobalScope(new CompanyScope);
    }

    public function products()
      {
          return $this->belongsToMany(Product::class, 'discount_product')
                      ->withPivot('combination_id') // Incluye combination_id en queries (clave)
                      ->withTimestamps();
      }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function usages()
    {
        return $this->hasMany(DiscountUsage::class); // Asume que creas el modelo DiscountUsage
    }
    // Método para contar usos
    public function getUsedCountAttribute()
    {
        return $this->usages()->count();
    }
    // Método para verificar si está agotado
    public function isExhausted()
    {
        return $this->usage_limit && $this->used_count >= $this->usage_limit;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeAutomatic($query)
    {
        return $query->where('automatic', true);
    }


}
