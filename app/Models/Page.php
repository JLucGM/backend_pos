<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Page extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'layout',
        'is_deletable',
        'is_editable',
        'page_type',
        'is_published',
        'is_homepage',
        'sort_order',
        'company_id',
        'template_id',
        'theme_settings',
        'uses_template',
        'theme_id',
    ];

    protected $casts = [
        // 'content' => 'array', // Eliminar comentario luego
        'is_deletable' => 'boolean',
        'is_editable' => 'boolean',
        'page_type' => 'string',
        'is_published' => 'boolean',
        'is_homepage' => 'boolean',
        // 'template_overrides' => 'array',
        'theme_settings' => 'array',
        'uses_template' => 'boolean',
        // 'layout' => 'array',
        // 'page_type' => 'enum:essential,policy,custom,link_bio',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            // LA CLAVE: Spatie solo verifica duplicidad en las páginas 
            // que pertenecen a la misma compañía.
            ->extraScope(fn($query) => $query->where('company_id', $this->company_id))
            ->allowDuplicateSlugs(); // <--- IMPORTANTE: Desactiva la verificación global

    }

    // Scope global para filtrar por company_id
    protected static function booted()
    {
        static::addGlobalScope(new CompanyScope);
    }

    // Registrar colecciones de medios
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('page_images')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
            // ->singleFile(); // O multiple según necesites
    }

    // Conversiones de medios
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(150)
            ->height(150)
            ->sharpen(10);

        $this->addMediaConversion('medium')
            ->width(400)
            ->height(400);

        $this->addMediaConversion('large')
            ->width(800)
            ->height(800);
    }

    // Método para copiar imagen desde otro modelo
    public function copyImageFromProduct(Product $product, $mediaId = null)
    {
        // Si se especifica un ID de medio específico
        if ($mediaId) {
            $media = $product->media()->find($mediaId);
            if ($media) {
                return $this->copyMedia($media->getPath())->toMediaCollection('page_images');
            }
        }

        // O copiar la primera imagen del producto
        $firstMedia = $product->getFirstMedia('products');
        if ($firstMedia) {
            return $this->copyMedia($firstMedia->getPath())->toMediaCollection('page_images');
        }

        return null;
    }

    // Obtener URL de imagen de página
    public function getImageUrl($conversion = '')
    {
        $media = $this->getFirstMedia('page_images');
        if ($media) {
            return $media->getUrl($conversion);
        }
        return null;
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $field = $field ?: $this->getRouteKeyName();

        // Si hay usuario autenticado, filtrar por su company_id
        if (Auth::check()) {
            return $this->where($field, $value)
                ->where('company_id', Auth::user()->company_id)
                ->firstOrFail();
        }

        // Fallback al comportamiento original
        return parent::resolveRouteBinding($value, $field);
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

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Método para detectar si tiene tema personalizado
    public function hasCustomTheme()
    {
        if (!$this->uses_template) {
            return (bool) $this->theme_id;
        }

        // Tema personalizado si es diferente al de la plantilla
        if ($this->theme_id && $this->template && $this->template->theme_id) {
            return $this->theme_id !== $this->template->theme_id;
        }

        return (bool) $this->theme_id;
    }

    // Método para obtener configuraciones del tema
    public function getThemeSettingsAttribute($value)
    {
        $themeSettings = $value ? json_decode($value, true) : null;

        // Si no hay configuraciones personalizadas, usar el tema original
        if (!$themeSettings && $this->theme) {
            return $this->theme->settings ?? [];
        }

        return $themeSettings ?? [];
    }

    // Método para copiar configuración del tema
    public function copyThemeSettings()
    {
        if ($this->theme) {
            $this->theme_settings = $this->theme->settings;
            $this->save();
        }
    }
}
