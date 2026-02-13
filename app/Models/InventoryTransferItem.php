<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransferItem extends Model
{
    protected $fillable = [
        'inventory_transfer_id',
        'product_id',
        'combination_id',
        'requested_quantity',
        'shipped_quantity',
        'received_quantity',
    ];

    public function inventoryTransfer()
    {
        return $this->belongsTo(InventoryTransfer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function combination()
    {
        return $this->belongsTo(Combination::class);
    }
}
