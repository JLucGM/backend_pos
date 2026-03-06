import React from 'react';
import SeoHead from '@/Components/SeoHead';
import { useSeo } from '@/hooks/useSeo';

const SeoProductHead = ({ product, company }) => {
    if (!product) return null;

    const { meta, structuredData } = useSeo({
        title: product.meta_title || `${product.product_name}${company?.name ? ` - ${company.name}` : ''}`,
        description: product.meta_description || product.product_description?.replace(/<[^>]*>/g, '').substring(0, 155) || `Compra ${product.product_name}${company?.name ? ` en ${company.name}` : ''}`,
        keywords: Array.isArray(product.meta_keywords) ? product.meta_keywords.join(', ') : '',
        ogTitle: product.og_title || product.meta_title || product.product_name,
        ogDescription: product.og_description || product.meta_description || product.product_description?.replace(/<[^>]*>/g, '').substring(0, 155),
        ogImage: product.og_image || product.media?.[0]?.original_url,
        twitterTitle: product.twitter_title || product.meta_title || product.product_name,
        twitterDescription: product.twitter_description || product.meta_description || product.product_description?.replace(/<[^>]*>/g, '').substring(0, 155),
        twitterImage: product.twitter_image || product.og_image || product.media?.[0]?.original_url,
        structuredData: {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            'name': product.product_name,
            'description': product.product_description?.replace(/<[^>]*>/g, '') || '',
            'image': product.media?.[0]?.original_url,
            'sku': product.id,
            'offers': {
                '@type': 'Offer',
                'price': product.product_price_discount || product.product_price,
                'priceCurrency': 'USD',
                'availability': 'https://schema.org/InStock',
            },
            ...(company && {
                'brand': {
                    '@type': 'Brand',
                    'name': company.name,
                }
            })
        }
    });

    return (
        <SeoHead
            title={meta.title}
            description={meta.description}
            keywords={meta.keywords}
            ogTitle={meta.ogTitle}
            ogDescription={meta.ogDescription}
            ogImage={meta.ogImage}
            ogUrl={meta.ogUrl}
            twitterTitle={meta.twitterTitle}
            twitterDescription={meta.twitterDescription}
            twitterImage={meta.twitterImage}
            canonical={meta.canonical}
            structuredData={structuredData}
        />
    );
};

export default SeoProductHead;