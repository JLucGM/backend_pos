<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Theme extends Model
{
    use HasFactory, HasSlug;

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'name',
        'slug',
        'description',
        'settings',
    ];

    // Indicar que 'settings' es un campo JSON y debe ser casteado a array automáticamente
    protected $casts = [
        'settings' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('code')
            ->saveSlugsTo('slug');
    }

    /**
     * Relación: Un tema puede tener muchas páginas
     */
    public function pages()
    {
        return $this->hasMany(Page::class);
    }
}
