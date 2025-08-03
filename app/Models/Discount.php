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
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
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
