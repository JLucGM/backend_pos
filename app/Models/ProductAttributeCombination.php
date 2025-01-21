<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttributeCombination extends Model
{
    use HasFactory;
    
    protected $table = 'product_attribute_combinations';

    protected $fillable = [
        'product_id',
        'attribute_value_ids',
        'price',
    ];
}
