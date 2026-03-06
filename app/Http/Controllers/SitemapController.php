<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Page;
use App\Models\Collection;
use App\Services\SeoService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemapData = [];

        // Add pages
        $pages = Page::where('is_published', true)->get();
        $sitemapData = array_merge($sitemapData, SeoService::generateSitemapData($pages));

        // Add products
        $products = Product::where('is_active', true)->get();
        $sitemapData = array_merge($sitemapData, SeoService::generateSitemapData($products));

        // Add collections
        $collections = Collection::where('is_active', true)->get();
        $sitemapData = array_merge($sitemapData, SeoService::generateSitemapData($collections));

        $xml = $this->generateSitemapXml($sitemapData);

        return response($xml, 200, [
            'Content-Type' => 'application/xml'
        ]);
    }

    private function generateSitemapXml(array $sitemapData): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($sitemapData as $item) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . htmlspecialchars($item['url']) . '</loc>' . "\n";
            $xml .= '    <lastmod>' . $item['lastmod'] . '</lastmod>' . "\n";
            $xml .= '    <changefreq>' . $item['changefreq'] . '</changefreq>' . "\n";
            $xml .= '    <priority>' . $item['priority'] . '</priority>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}