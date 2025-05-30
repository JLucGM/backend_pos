<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use HasFactory, HasSlug;
    use InteractsWithMedia;

    protected $fillable = [
        'app_name',
        'default_currency',
        'admin_email',
        'admin_phone',
        'shipping_base_price',
        'company_id',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('app_name')
            ->saveSlugsTo('slug');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('favicon');
        $this->addMediaCollection('logo');
        $this->addMediaCollection('logofooter');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(368)
            ->height(232);

        $this->addMediaConversion('setting')
            ->width(368)
            ->height(232);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    // public function getFaviconUrlAttribute()
    // {
    //     return $this->getFirstMediaUrl('favicon');
    // }

    // public function getLogoUrlAttribute()
    // {
    //     return $this->getFirstMediaUrl('logo');
    // }

    // public function getLogoFooterUrlAttribute()
    // {
    //     return $this->getFirstMediaUrl('logofooter');
    // }
}
