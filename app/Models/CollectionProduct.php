<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CollectionProduct extends Pivot
{
    protected $table = 'collection_products';

    protected $fillable = [
        'collection_id',
        'product_id',
        'sort_order',
    ];
}
