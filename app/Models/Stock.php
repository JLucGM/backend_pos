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
        'combination_id',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function combination()
    {
        return $this->belongsTo(Combination::class);
    }
}
