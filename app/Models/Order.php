<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'delivery_type',
        'payment_status',
        'totalshipping',
        'totaldiscounts',
        'subtotal',
        'tax_amount',
        'total',
        'order_origin',
        'payments_method_id',
        'user_id',
        'delivery_location_id',
        'company_id',
        'shipping_rate_id',
        'store_id',
    ];

    // protected $casts = [
    //     'status' => 'string',
    //     'delivery_type' => 'string',
    //     'payment_status' => 'string',
    //     'totalshipping' => 'decimal:2',
    //     'totaldiscounts' => 'decimal:2',
    //     'subtotal' => 'decimal:2',
    //     'tax_amount' => 'decimal:2',
    //     'total' => 'decimal:2',
    //     'order_origin' => 'string',
    // ];

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payments_method_id');
    }

    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocation::class);
    }

    public function shippingRate()
    {
        return $this->belongsTo(ShippingRate::class, 'shipping_rate_id');
    }

    public function giftCardUsages()
    {
        return $this->hasMany(GiftCardUsage::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    
}