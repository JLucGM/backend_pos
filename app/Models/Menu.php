<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = ['company_id', 'name'];

    // Relación: Un Menú tiene muchos Items (Enlaces)
    public function items()
    {
        // Cargamos solo los items de nivel superior (parent_id es null)
        // y los ordenamos por el campo 'order'.
        return $this->hasMany(MenuItem::class)->whereNull('parent_id')->orderBy('order');
    }
    
    // Si usas multi-tenant
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}