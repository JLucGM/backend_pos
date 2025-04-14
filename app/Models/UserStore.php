<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserStore extends Model
{
    use HasFactory;

    protected $table = 'user_stores';

    public $timestamps = false; // Si no tienes timestamps en esta tabla
}
