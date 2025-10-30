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
        'product_details',
        'discount_id', // Nuevo
        'discount_amount', // Nuevo
        'discounted_price', // Nuevo
        'discounted_subtotal', // Nuevo
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discounted_price' => 'decimal:2',
        'discounted_subtotal' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // App\Models\OrderItem.php

public function combination()
{
    return $this->belongsTo(Combination::class, 'combination_id');
}


}
