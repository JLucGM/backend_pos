<?php

namespace App\Http\Middleware;

use App\Services\SeoService;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InjectSeoMetaTags
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only process Inertia responses
        if (!$request->header('X-Inertia')) {
            return $response;
        }

        // Get the current page props
        $page = $response->getData()['page'] ?? [];
        $props = $page['props'] ?? [];

        // Check if we have a model with SEO data
        $seoModel = null;
        
        // Look for common model names in props
        $modelKeys = ['product', 'collection', 'page', 'model'];
        foreach ($modelKeys as $key) {
            if (isset($props[$key]) && is_object($props[$key]) && method_exists($props[$key], 'getSeoTitle')) {
                $seoModel = $props[$key];
                break;
            }
        }

        if ($seoModel) {
            // Generate meta tags
            $metaTags = SeoService::generateMetaTags($seoModel);
            
            // Generate structured data
            $structuredData = SeoService::generateStructuredData($seoModel);

            // Add to Inertia shared data
            Inertia::share([
                'seo' => [
                    'meta' => $metaTags,
                    'structuredData' => $structuredData,
                ]
            ]);
        }

        return $response;
    }
}