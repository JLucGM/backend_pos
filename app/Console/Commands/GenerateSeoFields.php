<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\Page;
use App\Models\Collection;
use Illuminate\Console\Command;

class GenerateSeoFields extends Command
{
    protected $signature = 'seo:generate {--model=all : Specify model (product, page, collection, or all)}';
    protected $description = 'Generate SEO fields for existing records';

    public function handle()
    {
        $model = $this->option('model');

        $this->info('Generating SEO fields...');

        switch ($model) {
            case 'product':
                $this->generateForProducts();
                break;
            case 'page':
                $this->generateForPages();
                break;
            case 'collection':
                $this->generateForCollections();
                break;
            case 'all':
            default:
                $this->generateForProducts();
                $this->generateForPages();
                $this->generateForCollections();
                break;
        }

        $this->info('SEO fields generated successfully!');
    }

    private function generateForProducts()
    {
        $this->info('Generating SEO for products...');
        
        Product::whereNull('meta_title')
            ->orWhere('meta_title', '')
            ->chunk(100, function ($products) {
                foreach ($products as $product) {
                    $product->save(); // This will trigger the HasSeo trait
                }
            });

        $count = Product::whereNotNull('meta_title')->count();
        $this->info("Generated SEO for {$count} products");
    }

    private function generateForPages()
    {
        $this->info('Generating SEO for pages...');
        
        Page::whereNull('meta_title')
            ->orWhere('meta_title', '')
            ->chunk(100, function ($pages) {
                foreach ($pages as $page) {
                    $page->save(); // This will trigger the HasSeo trait
                }
            });

        $count = Page::whereNotNull('meta_title')->count();
        $this->info("Generated SEO for {$count} pages");
    }

    private function generateForCollections()
    {
        $this->info('Generating SEO for collections...');
        
        Collection::whereNull('meta_title')
            ->orWhere('meta_title', '')
            ->chunk(100, function ($collections) {
                foreach ($collections as $collection) {
                    $collection->save(); // This will trigger the HasSeo trait
                }
            });

        $count = Collection::whereNotNull('meta_title')->count();
        $this->info("Generated SEO for {$count} collections");
    }
}