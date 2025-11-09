<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftCardUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'gift_card_id',
        'order_id',
        'amount_used',
    ];

    protected $casts = [
        'amount_used' => 'decimal:2',
    ];

    // Relación con GiftCard
    public function giftCard()
    {
        return $this->belongsTo(GiftCard::class);
    }

    // Relación con Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}