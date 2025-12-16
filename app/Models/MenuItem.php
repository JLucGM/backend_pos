<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = ['menu_id', 'parent_id', 'title', 'url', 'order'];

    // Relación: Un Item pertenece a un Menú
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    // Relación recursiva: Este ítem tiene sub-ítems
    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    // Relación recursiva: Este ítem tiene un padre (si es un submenú)
    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }
}