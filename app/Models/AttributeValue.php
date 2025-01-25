<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    protected $table = 'attribute_values';

    protected $fillable = [
        'attribute_value_name',
        'attribute_id',
    ];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    public function combinationAttributeValues()
    {
        return $this->hasMany(CombinationAttributeValue::class);
    }
}
