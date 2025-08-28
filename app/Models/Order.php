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
        'totaldiscounts',
        'subtotal',
        'tax_amount',
        'total',
        'order_origin',
        'payments_method_id',
        'user_id',
        'delivery_location_id',
        'company_id',
    ];

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function orderItems()
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

        // ... dentro de la clase Order
    public function deliveryLocation()
    {
        return $this->belongsTo(DeliveryLocation::class);
    }
    
}