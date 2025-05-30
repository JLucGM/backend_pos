<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Store extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'store_name',
        'slug',
        'store_phone',
        'store_direction',
        'country_id',
        'state_id',
        'city_id',
        'company_id',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('store_name')
            ->saveSlugsTo('slug');
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'stocks', 'store_id', 'product_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_stores');
    }

    public function orders()
{
    return $this->belongsToMany(Order::class, 'store_orders');
}
    
}
