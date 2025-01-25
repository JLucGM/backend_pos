<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Combination extends Model
{
    protected $table = 'combinations';

    protected $fillable = [
        'combination_price',
        'product_id',
    ];

    public function combinationAttributeValue()
{
    return $this->hasMany(CombinationAttributeValue::class);
}

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
