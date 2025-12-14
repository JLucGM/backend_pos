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
        'layout',
        'is_default',
        'is_published',
        'is_homepage',
        'sort_order',
        'company_id',
        'template_id',
        // 'template_overrides',
        'theme_settings',
        'uses_template',
        'theme_id',
    ];

    protected $casts = [
        // 'content' => 'array', // Eliminar comentario luego
        'is_default' => 'boolean',
        'is_published' => 'boolean',
        'is_homepage' => 'boolean',
        // 'template_overrides' => 'array',
        'theme_settings' => 'array',
        'uses_template' => 'boolean',
        // 'layout' => 'array',
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
            ->extraScope(fn ($query) => $query->where('company_id', $this->company_id))
            ->allowDuplicateSlugs(); // <--- IMPORTANTE: Desactiva la verificación global

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

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Método para obtener layout combinado
    // public function getCombinedLayout()
    // {
    //     if (!$this->uses_template || !$this->template) {
    //         return $this->layout;
    //     }

    //     $templateLayout = $this->template->layout_structure ?? [];
    //     $pageLayout = $this->layout ?? [];
    //     $overrides = $this->template_overrides ?? [];

    //     // Combinar lógica (template base + personalizaciones página)
    //     return $this->mergeLayouts($templateLayout, $pageLayout, $overrides);
    // }

    // Método para aplicar tema
    // public function getAppliedTheme()
    // {
    //     // Prioridad: Tema de página → Tema de template → Tema default
    //     if ($this->theme_id) {
    //         return $this->theme;
    //     }

    //     if ($this->template && $this->template->theme_id) {
    //         return $this->template->theme;
    //     }

    //     return Theme::where('slug', 'tema-azul')->first(); // Tema por defecto
    // }

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
