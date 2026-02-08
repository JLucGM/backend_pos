<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\SlugOptions;

class Stock extends Model
{
    protected $fillable = [
        'quantity',
        'product_sku',
        'product_barcode',
        'product_id',
        'combination_id',
        'company_id',
        'store_id',
    ];

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function combination()
    {
        return $this->belongsTo(Combination::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
