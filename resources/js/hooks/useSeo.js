import { usePage } from '@inertiajs/react';

export const useSeo = (fallbackData = {}) => {
    const { props } = usePage();
    const seoData = props.seo || {};
    
    // Merge with fallback data
    const meta = {
        title: fallbackData.title || 'Mi Tienda',
        description: fallbackData.description || 'Descripción por defecto',
        keywords: fallbackData.keywords || '',
        ogTitle: fallbackData.ogTitle || fallbackData.title || 'Mi Tienda',
        ogDescription: fallbackData.ogDescription || fallbackData.description || 'Descripción por defecto',
        ogImage: fallbackData.ogImage || null,
        ogUrl: fallbackData.ogUrl || window.location.href,
        twitterTitle: fallbackData.twitterTitle || fallbackData.title || 'Mi Tienda',
        twitterDescription: fallbackData.twitterDescription || fallbackData.description || 'Descripción por defecto',
        twitterImage: fallbackData.twitterImage || fallbackData.ogImage || null,
        canonical: fallbackData.canonical || window.location.href,
        ...seoData.meta
    };

    const structuredData = seoData.structuredData || fallbackData.structuredData || {};

    return {
        meta,
        structuredData,
        hasSeoData: Object.keys(seoData).length > 0
    };
};