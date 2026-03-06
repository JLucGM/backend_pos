import { Head } from '@inertiajs/react';

const SeoHead = ({ 
    title, 
    description, 
    keywords, 
    ogTitle, 
    ogDescription, 
    ogImage, 
    ogUrl,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonical,
    structuredData,
    additionalMeta = []
}) => {
    return (
        <Head>
            {/* Basic Meta Tags */}
            {title && <title>{title}</title>}
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}
            
            {/* Open Graph Meta Tags */}
            {ogTitle && <meta property="og:title" content={ogTitle} />}
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:type" content="website" />
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
            {twitterDescription && <meta name="twitter:description" content={twitterDescription} />}
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}
            
            {/* Additional Meta Tags */}
            {additionalMeta.map((meta, index) => (
                <meta key={index} {...meta} />
            ))}
            
            {/* Structured Data */}
            {structuredData && Object.keys(structuredData).length > 0 && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ 
                        __html: JSON.stringify(structuredData) 
                    }}
                />
            )}
        </Head>
    );
};

export default SeoHead;