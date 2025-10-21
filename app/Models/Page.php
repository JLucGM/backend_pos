<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Page extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_default',
        'is_published',
        'is_homepage',
        'sort_order',
        'company_id',
    ];

    protected $casts = [
        // 'content' => 'array', // Eliminar comentario luego
        'is_default' => 'boolean',
        'is_published' => 'boolean',
        'is_homepage' => 'boolean',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    // Scope global para filtrar por company_id
    protected static function booted()
    {
        static::addGlobalScope(new CompanyScope);
    }

    // Evitar borrar páginas por defecto
    public function delete()
    {
        if ($this->is_default) {
            throw new \Exception('No se puede eliminar una página por defecto');
        }
        return parent::delete();
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }
}
