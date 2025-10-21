<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function show($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        // $page = Page::with('theme')->where('slug', $slug)->firstOrFail();

        // dd($page);
        // Retornamos la vista 'pages.show' con la página
       return Inertia::render('Frontend/Index', compact('page'));
    }
}
