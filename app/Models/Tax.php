<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Tax extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'tax_name',
        'slug',
        'tax_description',
        'tax_rate',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('tax_name')
            ->saveSlugsTo('slug');
    }
}
