<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class GiftCard extends Model
{

    use HasFactory, HasSlug;

    protected $fillable = [
        'code',
        'slug',
        'description',
        'initial_balance',
        'current_balance',
        'expiration_date',
        'is_active',
        'company_id',
        'user_id',
    ];

    protected $casts = [
        'code' => 'string',
        'slug' => 'string',
        'description' => 'string',
        'initial_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'expiration_date' => 'date',
        'is_active' => 'boolean',
        'company_id' => 'integer',
        'user_id' => 'integer',
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

    protected static function booted()
    {
        // Registra tu ámbito global aquí
        static::addGlobalScope(new CompanyScope);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
