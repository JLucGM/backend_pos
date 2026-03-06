<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use App\Traits\HasSeo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Collection extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasSeo, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'description',
        'type',
        'conditions',
        'conditions_match',
        'is_active',
        'starts_at',
        'ends_at',
        'company_id',
    ];


    protected $casts = [
        'conditions' => 'array',
        'is_active'  => 'boolean',
        'starts_at'  => 'date',
        'ends_at'    => 'date',
        'meta_keywords' => 'array',
    ];
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    // ─── Media Collections ─────────────────────────────────────────────────

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('collections')
            ->useDisk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    }

    public function registerMediaConversions($media = null): void
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

    // ─── Relaciones ────────────────────────────────────────────────────────

    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_products')
            ->withPivot('sort_order')
            ->orderBy('collection_products.sort_order')
            ->withTimestamps();
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // ─── Helper para colecciones inteligentes ──────────────────────────────

    /**
     * Devuelve los productos que coinciden con las condiciones smart de la colección.
     */
    public function getMatchingProducts()
    {
        return self::buildSmartQuery($this->conditions ?? [], $this->conditions_match)->get();
    }

    /**
     * Construye la query de productos para condiciones smart.
     *
     * @param  array  $conditions
     * @param  string $match  'all' | 'any'
     */
    public static function buildSmartQuery(array $conditions, string $match = 'all')
    {
        $query = Product::with([
            'categories',
            'stocks',
            'combinations.stocks',
            'combinations.combinationAttributeValue.attributeValue.attribute',
            'media',
        ]);

        $method = $match === 'any' ? 'orWhere' : 'where';

        $query->where(function ($q) use ($conditions, $method) {
            foreach ($conditions as $condition) {
                $field    = $condition['field']    ?? null;
                $operator = $condition['operator'] ?? null;
                $value    = $condition['value']    ?? null;

                if (!$field || !$operator) {
                    continue;
                }

                switch ($field) {
                    case 'category':
                        if ($operator === 'is') {
                            $q->{$method . 'Has'}('categories', function ($sq) use ($value) {
                                $sq->whereIn('categories.id', (array) $value);
                            });
                        } elseif ($operator === 'is_not') {
                            $q->{$method . 'DoesntHave'}('categories', function ($sq) use ($value) {
                                $sq->whereIn('categories.id', (array) $value);
                            });
                        }
                        break;

                    case 'price':
                        // Para productos simples: compara product_price
                        // Para productos con variantes: incluye si al menos una
                        // combination_price cumple la condición.
                        if ($operator === 'greater_than') {
                            $q->{$method}(function ($sq) use ($value) {
                                $sq->where('product_price', '>', $value)
                                   ->orWhereHas('combinations', fn ($cq) => $cq->where('combination_price', '>', $value));
                            });
                        } elseif ($operator === 'less_than') {
                            $q->{$method}(function ($sq) use ($value) {
                                $sq->where('product_price', '<', $value)
                                   ->orWhereHas('combinations', fn ($cq) => $cq->where('combination_price', '<', $value));
                            });
                        } elseif ($operator === 'equals') {
                            $q->{$method}(function ($sq) use ($value) {
                                $sq->where('product_price', '=', $value)
                                   ->orWhereHas('combinations', fn ($cq) => $cq->where('combination_price', '=', $value));
                            });
                        }
                        break;

                    case 'stock':
                        if ($operator === 'greater_than') {
                            $q->{$method . 'Has'}('stocks', function ($sq) use ($value) {
                                $sq->where('quantity', '>', $value);
                            });
                        } elseif ($operator === 'less_than') {
                            $q->{$method . 'Has'}('stocks', function ($sq) use ($value) {
                                $sq->where('quantity', '<', $value);
                            });
                        }
                        break;

                    case 'is_active':
                        $q->{$method}('is_active', filter_var($value, FILTER_VALIDATE_BOOLEAN));
                        break;
                }
            }
        });

        return $query;
    }
}
