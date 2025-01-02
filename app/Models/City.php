<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class City extends Model
{

    use HasFactory, HasSlug;

    protected $fillable = [
        'city_name',
        'slug',
        'state_id',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('city_name')
            ->saveSlugsTo('slug');
    }

    public function state()
    {
        return $this->belongsTo(State::class);
    }

}
