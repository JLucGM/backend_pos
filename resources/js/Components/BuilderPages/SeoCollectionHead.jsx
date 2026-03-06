import React from 'react';
import SeoHead from '@/Components/SeoHead';
import { useSeo } from '@/hooks/useSeo';

const SeoCollectionHead = ({ collection, company }) => {
    if (!collection) return null;

    const { meta, structuredData } = useSeo({
        title: collection.meta_title || `${collection.title}${company?.name ? ` - ${company.name}` : ''}`,
        description: collection.meta_description || collection.description?.replace(/<[^>]*>/g, '').substring(0, 155) || `Explora la colección ${collection.title}${company?.name ? ` en ${company.name}` : ''}`,
        keywords: Array.isArray(collection.meta_keywords) ? collection.meta_keywords.join(', ') : '',
        ogTitle: collection.og_title || collection.meta_title || collection.title,
        ogDescription: collection.og_description || collection.meta_description || collection.description?.replace(/<[^>]*>/g, '').substring(0, 155),
        ogImage: collection.og_image || collection.media?.[0]?.original_url,
        twitterTitle: collection.twitter_title || collection.meta_title || collection.title,
        twitterDescription: collection.twitter_description || collection.meta_description || collection.description?.replace(/<[^>]*>/g, '').substring(0, 155),
        twitterImage: collection.twitter_image || collection.og_image || collection.media?.[0]?.original_url,
        structuredData: {
            '@context': 'https://schema.org/',
            '@type': 'CollectionPage',
            'name': collection.title,
            'description': collection.description?.replace(/<[^>]*>/g, '') || '',
            'url': window.location.href,
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

export default SeoCollectionHead;