<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefundItem extends Model
{
    protected $fillable = [
        'refund_id',
        'order_item_id',
        'quantity',
        'restock_action',
    ];
    
    protected $casts = [
        'refund_id' => 'integer',
        'order_item_id' => 'integer',
        'quantity' => 'integer',
        'restock_action' => 'string',
    ];

    public function refund()
    {
        return $this->belongsTo(Refund::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }
}
