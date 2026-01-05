<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DebugRouteSelection
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('post') && $request->path() === 'login') {
            \Log::info('=== POST /login detected ===');
            \Log::info('Host: ' . $request->getHost());
            \Log::info('Full URL: ' . $request->fullUrl());
            \Log::info('Route being matched: ' . ($request->route() ? $request->route()->getName() : 'none'));
        }
        
        return $next($request);
    }
}