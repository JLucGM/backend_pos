<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'default_currency',
        'company_id',
    ];

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
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
