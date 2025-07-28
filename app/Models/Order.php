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
        'total',
        'direction_delivery',
        'order_origin',
        'payments_method_id',
        'user_id',
        // 'client_id',
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

    // public function stores()
    // {
    //     return $this->belongsToMany(Store::class, 'store_orders');
    // }
}