<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\SlugOptions;

class Stock extends Model
{
    protected $fillable = [
        'quantity',
        'status',
        'product_sku',
        'product_barcode',
        'product_id',
        'store_id',
        'combination_id',
    ];

    // public function getRouteKeyName()
    // {
    //     return 'slug';
    // }

    // public function getSlugOptions(): SlugOptions
    // {
    //     return SlugOptions::create()
    //         ->generateSlugsFrom('category_name')
    //         ->saveSlugsTo('slug');
    // }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    public function combination()
    {
        return $this->belongsTo(Combination::class);
    }
}
