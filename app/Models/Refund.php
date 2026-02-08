<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{

    protected $fillable = [
        'order_id',
        'amount',
        'reason',
        'restock_items',
        'refunded_at',
        'user_id',
        'company_id',
        // 'payment_method_id',
        'store_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'restock_items' => 'boolean',
        'refunded_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function items()
    {
        return $this->hasMany(RefundItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
