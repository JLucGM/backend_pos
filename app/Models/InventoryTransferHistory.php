<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryTransferHistory extends Model
{
    protected $fillable = [
        'inventory_transfer_id',
        'status',
        'shipped_quantity',
        'received_quantity',
        'user_id',
        'notes',
    ];

    public function inventoryTransfer()
    {
        return $this->belongsTo(InventoryTransfer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
