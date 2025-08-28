<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_product',
        'price_product',
        'subtotal',
        'quantity',
        'tax_amount',
        'order_id',
        'product_id',
        'combination_id',
        'product_details'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

}
