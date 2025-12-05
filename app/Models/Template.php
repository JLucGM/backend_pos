<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Template extends Model
{
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'layout_structure',
        'default_blocks',
        'is_global',
        'theme_id',
        'company_id'
    ];

    protected $casts = [
        'layout_structure' => 'array',
        'default_blocks' => 'array',
        'is_global' => 'boolean'
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    // Relaciones
    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    // Scope para plantillas disponibles
    public function scopeAvailableForCompany($query, $companyId)
    {
        return $query->where(function($q) use ($companyId) {
            $q->where('is_global', true)
              ->orWhere('company_id', $companyId);
        });
    }
}