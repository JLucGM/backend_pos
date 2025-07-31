<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
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
        'company_id',
        'slug',
        'description',
        'is_active',
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

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    // Definir la relación con PaymentMethodDetail
    // public function details()
    // {
    //     return $this->hasMany(PaymentMethodDetail::class, 'payments_method_id');
    // }
    
}
