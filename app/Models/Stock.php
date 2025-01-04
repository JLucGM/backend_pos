<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\SlugOptions;

class Stock extends Model
{
    protected $fillable = [
        'quantity',
        'status',
        'product_id',
        'store_id',
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
}
