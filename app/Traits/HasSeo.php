<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSeo
{
    /**
     * Boot the trait
     */
    protected static function bootHasSeo()
    {
        static::saving(function ($model) {
            // Always try to generate SEO fields if they're empty
            $model->generateSeoFields();
        });
    }

    /**
     * Generate SEO fields automatically
     */
    public function generateSeoFields()
    {
        // Generate meta title
        if (empty($this->meta_title)) {
            $this->meta_title = $this->generateMetaTitle();
        }

        // Generate meta description
        if (empty($this->meta_description)) {
            $this->meta_description = $this->generateMetaDescription();
        }

        // Generate meta keywords
        if (empty($this->meta_keywords)) {
            $this->meta_keywords = $this->generateMetaKeywords();
        }

        // Generate Open Graph fields
        if (empty($this->og_title)) {
            $this->og_title = $this->meta_title;
        }

        if (empty($this->og_description)) {
            $this->og_description = $this->meta_description;
        }

        // Generate Twitter fields
        if (empty($this->twitter_title)) {
            $this->twitter_title = $this->meta_title;
        }

        if (empty($this->twitter_description)) {
            $this->twitter_description = $this->meta_description;
        }
    }

    /**
     * Generate meta title based on model type
     */
    protected function generateMetaTitle(): string
    {
        switch (class_basename($this)) {
            case 'Product':
                return Str::limit($this->product_name, 55);
            case 'Page':
                return Str::limit($this->title, 55);
            case 'Collection':
                return Str::limit($this->title, 55);
            default:
                return Str::limit($this->title ?? $this->name ?? 'Página', 55);
        }
    }

    /**
     * Generate meta description based on model type
     */
    protected function generateMetaDescription(): string
    {
        switch (class_basename($this)) {
            case 'Product':
                $description = $this->product_description ?? $this->product_name;
                return Str::limit(strip_tags($description), 155);
            case 'Page':
                $description = $this->content ?? $this->title;
                return Str::limit(strip_tags($description), 155);
            case 'Collection':
                $description = $this->description ?? $this->title;
                return Str::limit(strip_tags($description), 155);
            default:
                $description = $this->description ?? $this->content ?? $this->title ?? $this->name ?? '';
                return Str::limit(strip_tags($description), 155);
        }
    }

    /**
     * Generate meta keywords based on model type
     */
    protected function generateMetaKeywords(): array
    {
        $keywords = [];

        switch (class_basename($this)) {
            case 'Product':
                // Add product name words
                $keywords = array_merge($keywords, $this->extractKeywords($this->product_name));
                
                // Add category names if available
                if ($this->relationLoaded('categories')) {
                    foreach ($this->categories as $category) {
                        $keywords = array_merge($keywords, $this->extractKeywords($category->category_name));
                    }
                }
                break;

            case 'Page':
                $keywords = array_merge($keywords, $this->extractKeywords($this->title));
                if ($this->content) {
                    $keywords = array_merge($keywords, $this->extractKeywords($this->content, 10));
                }
                break;

            case 'Collection':
                $keywords = array_merge($keywords, $this->extractKeywords($this->title));
                if ($this->description) {
                    $keywords = array_merge($keywords, $this->extractKeywords($this->description, 10));
                }
                break;
        }

        // Remove duplicates and limit to 10 keywords
        return array_values(array_unique(array_slice($keywords, 0, 10)));
    }

    /**
     * Extract keywords from text
     */
    protected function extractKeywords(string $text, int $limit = 5): array
    {
        // Remove HTML tags and normalize text
        $text = strip_tags($text);
        $text = strtolower($text);
        
        // Remove common stop words in Spanish and English
        $stopWords = [
            'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las',
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did'
        ];

        // Extract words (minimum 3 characters)
        preg_match_all('/\b\w{3,}\b/', $text, $matches);
        $words = $matches[0];

        // Filter out stop words
        $keywords = array_filter($words, function($word) use ($stopWords) {
            return !in_array($word, $stopWords);
        });

        // Get most frequent words
        $wordCounts = array_count_values($keywords);
        arsort($wordCounts);

        return array_keys(array_slice($wordCounts, 0, $limit, true));
    }

    /**
     * Get the SEO meta title
     */
    public function getSeoTitle(): string
    {
        return $this->meta_title ?: $this->generateMetaTitle();
    }

    /**
     * Get the SEO meta description
     */
    public function getSeoDescription(): string
    {
        return $this->meta_description ?: $this->generateMetaDescription();
    }

    /**
     * Get the SEO meta keywords
     */
    public function getSeoKeywords(): array
    {
        return $this->meta_keywords ?: $this->generateMetaKeywords();
    }

    /**
     * Get Open Graph title
     */
    public function getOgTitle(): string
    {
        return $this->og_title ?: $this->getSeoTitle();
    }

    /**
     * Get Open Graph description
     */
    public function getOgDescription(): string
    {
        return $this->og_description ?: $this->getSeoDescription();
    }

    /**
     * Get Open Graph image
     */
    public function getOgImage(): ?string
    {
        if ($this->og_image) {
            return $this->og_image;
        }

        // Try to get image from media library
        if (method_exists($this, 'getFirstMediaUrl')) {
            $collections = ['products', 'page_images', 'collections'];
            foreach ($collections as $collection) {
                $imageUrl = $this->getFirstMediaUrl($collection);
                if ($imageUrl) {
                    return $imageUrl;
                }
            }
        }

        return null;
    }

    /**
     * Get Twitter title
     */
    public function getTwitterTitle(): string
    {
        return $this->twitter_title ?: $this->getSeoTitle();
    }

    /**
     * Get Twitter description
     */
    public function getTwitterDescription(): string
    {
        return $this->twitter_description ?: $this->getSeoDescription();
    }

    /**
     * Get Twitter image
     */
    public function getTwitterImage(): ?string
    {
        return $this->twitter_image ?: $this->getOgImage();
    }
}