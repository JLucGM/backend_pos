<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethodDetail extends Model
{
    use HasFactory;

    protected $table = 'payments_method_details';

    protected $fillable = [
        'payments_method_details_data_types',
        'payments_method_details_value',
        'payments_method_id',
    ];
}
