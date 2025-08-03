<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, HasSlug;
    use InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('products');
    }

    protected $fillable = [
        'product_name',
        'slug',
        'product_description',
        'product_price',
        'product_price_discount',
        'status',
        'product_status_pos',
        'company_id',
        // 'product_barcode',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('product_name')
            ->saveSlugsTo('slug');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(368)
            ->height(232);

        $this->addMediaConversion('gallery')
            ->width(368)
            ->height(232);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories', 'product_id', 'category_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function combinations()
    {
        return $this->hasMany(Combination::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class);
    }
}
