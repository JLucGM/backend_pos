<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;

class InventoryTransfer extends Model
{
    protected $fillable = [
        'company_id',
        'reference_number',
        'from_store_id',
        'to_store_id',
        'status',
        'reason',
        'user_id',
    ];

    protected static function booted()
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function fromStore()
    {
        return $this->belongsTo(Store::class, 'from_store_id');
    }

    public function toStore()
    {
        return $this->belongsTo(Store::class, 'to_store_id');
    }

    public function items()
    {
        return $this->hasMany(InventoryTransferItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function histories()
    {
        return $this->hasMany(InventoryTransferHistory::class);
    }
}

