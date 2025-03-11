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

    // Relación inversa con OrderItem
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'combination_id');
    }

    public function attributeValues()
    {
        return $this->hasMany(CombinationAttributeValue::class);
    }
}
