<?php

namespace App\Services;

use Illuminate\Support\Str;

class SeoService
{
    /**
     * Generate SEO meta tags for a model
     */
    public static function generateMetaTags($model): array
    {
        return [
            'title' => $model->getSeoTitle(),
            'description' => $model->getSeoDescription(),
            'keywords' => implode(', ', $model->getSeoKeywords()),
            'og:title' => $model->getOgTitle(),
            'og:description' => $model->getOgDescription(),
            'og:image' => $model->getOgImage(),
            'og:url' => self::getCanonicalUrl($model),
            'twitter:card' => 'summary_large_image',
            'twitter:title' => $model->getTwitterTitle(),
            'twitter:description' => $model->getTwitterDescription(),
            'twitter:image' => $model->getTwitterImage(),
            'canonical' => self::getCanonicalUrl($model),
        ];
    }

    /**
     * Get canonical URL for a model
     */
    public static function getCanonicalUrl($model): string
    {
        $baseUrl = config('app.url');
        
        switch (class_basename($model)) {
            case 'Product':
                return "{$baseUrl}/products/{$model->slug}";
            case 'Collection':
                return "{$baseUrl}/collections/{$model->slug}";
            case 'Page':
                if ($model->is_homepage) {
                    return $baseUrl;
                }
                return "{$baseUrl}/pages/{$model->slug}";
            default:
                return $baseUrl;
        }
    }

    /**
     * Generate structured data (JSON-LD) for a model
     */
    public static function generateStructuredData($model): array
    {
        switch (class_basename($model)) {
            case 'Product':
                return self::generateProductStructuredData($model);
            case 'Collection':
                return self::generateCollectionStructuredData($model);
            case 'Page':
                return self::generatePageStructuredData($model);
            default:
                return [];
        }
    }

    /**
     * Generate product structured data
     */
    private static function generateProductStructuredData($product): array
    {
        $structuredData = [
            '@context' => 'https://schema.org/',
            '@type' => 'Product',
            'name' => $product->product_name,
            'description' => strip_tags($product->product_description ?? ''),
            'url' => self::getCanonicalUrl($product),
            'sku' => $product->id,
        ];

        // Add price information
        if ($product->product_price) {
            $structuredData['offers'] = [
                '@type' => 'Offer',
                'price' => $product->product_price_discount ?? $product->product_price,
                'priceCurrency' => 'USD', // You might want to make this dynamic
                'availability' => 'https://schema.org/InStock',
                'url' => self::getCanonicalUrl($product),
            ];
        }

        // Add image if available
        $imageUrl = $product->getOgImage();
        if ($imageUrl) {
            $structuredData['image'] = $imageUrl;
        }

        // Add brand if available (you might want to add this to your product model)
        if (isset($product->company) && $product->company) {
            $structuredData['brand'] = [
                '@type' => 'Brand',
                'name' => $product->company->name,
            ];
        }

        // Add categories
        if ($product->relationLoaded('categories') && $product->categories->count() > 0) {
            $structuredData['category'] = $product->categories->pluck('category_name')->implode(', ');
        }

        return $structuredData;
    }

    /**
     * Generate collection structured data
     */
    private static function generateCollectionStructuredData($collection): array
    {
        return [
            '@context' => 'https://schema.org/',
            '@type' => 'CollectionPage',
            'name' => $collection->title,
            'description' => strip_tags($collection->description ?? ''),
            'url' => self::getCanonicalUrl($collection),
        ];
    }

    /**
     * Generate page structured data
     */
    private static function generatePageStructuredData($page): array
    {
        $type = $page->is_homepage ? 'WebSite' : 'WebPage';
        
        return [
            '@context' => 'https://schema.org/',
            '@type' => $type,
            'name' => $page->title,
            'description' => strip_tags($page->content ?? ''),
            'url' => self::getCanonicalUrl($page),
        ];
    }

    /**
     * Generate sitemap data for SEO-enabled models
     */
    public static function generateSitemapData($models): array
    {
        $sitemapData = [];

        foreach ($models as $model) {
            $sitemapData[] = [
                'url' => self::getCanonicalUrl($model),
                'lastmod' => $model->updated_at->toISOString(),
                'changefreq' => self::getChangeFrequency($model),
                'priority' => self::getPriority($model),
            ];
        }

        return $sitemapData;
    }

    /**
     * Get change frequency for sitemap
     */
    private static function getChangeFrequency($model): string
    {
        switch (class_basename($model)) {
            case 'Product':
                return 'weekly';
            case 'Collection':
                return 'monthly';
            case 'Page':
                return $model->is_homepage ? 'daily' : 'monthly';
            default:
                return 'monthly';
        }
    }

    /**
     * Get priority for sitemap
     */
    private static function getPriority($model): string
    {
        switch (class_basename($model)) {
            case 'Product':
                return '0.8';
            case 'Collection':
                return '0.7';
            case 'Page':
                return $model->is_homepage ? '1.0' : '0.6';
            default:
                return '0.5';
        }
    }
}