<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PaymentMethod extends Model
{
    use HasFactory, HasSlug;

    protected $table = 'payments_methods';

    protected $fillable = [
        'payment_method_name',
        'slug',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('payment_method_name')
            ->saveSlugsTo('slug');
    }

    // Definir la relación con PaymentMethodDetail
    public function details()
    {
        return $this->hasMany(PaymentMethodDetail::class, 'payments_method_id');
    }
    
}
