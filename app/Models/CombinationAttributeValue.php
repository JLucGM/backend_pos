<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CombinationAttributeValue extends Model
{
    protected $table = 'combination_attribute_value';

    protected $fillable = [
        'combination_id',
        'attribute_value_id',
    ];

    public function combination()
    {
        return $this->belongsTo(Combination::class);
    }

    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class);
    }
}
