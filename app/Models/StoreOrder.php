<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreOrder extends Model
{
    use HasFactory;

    protected $table = 'store_orders';

    public $timestamps = false; // Si no tienes timestamps en esta tabla
}