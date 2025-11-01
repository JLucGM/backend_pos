<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountUsage extends Model
{
    protected $fillable = [
        'discount_id',
        'order_id',
        'user_id',
        'discount_amount',
    ];

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }
}
