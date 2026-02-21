import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker'; // Ajusta la ruta

const AnnouncementEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true,
    dynamicPages = [],
    products = [],
    collections = []
}) => {
    const [linkType, setLinkType] = useState('none');
    const [selectedPage, setSelectedPage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCollection, setSelectedCollection] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Memoizar resolveValue
    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    // Debounce for live updates
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const prevEditContentRef = useRef(editContent);

    // Asegurar que editContent sea un objeto
    const content = typeof editContent === 'object' ? editContent : { text: editContent || '' };

    // 1. INICIALIZACIÓN UNA VEZ
    useEffect(() => {
        if (isInitialized) return;

        const currentUrl = content.navigationUrl || '';
        const currentUrlString = String(currentUrl);

        if (currentUrlString && currentUrlString.trim() !== '') {
            if (typeof currentUrlString === 'string' && currentUrlString.startsWith('/')) {
                const pageSlug = currentUrlString.replace('/', '');
                const page = dynamicPages.find(p => p.slug === pageSlug);
                if (page) {
                    setLinkType('page');
                    setSelectedPage(page.slug);
                } else if (currentUrlString.startsWith('/tienda/producto/')) { // Check for product URL logic
                    const productSlug = currentUrlString.split('/').pop();
                    const product = products.find(p => p.slug === productSlug);
                    if (product) {
                        setLinkType('product');
                        setSelectedProduct(product.slug);
                    } else {
                        setLinkType('custom');
                        setCustomUrl(currentUrlString);
                    }
                } else if (currentUrlString.startsWith('/tienda/')) { // Check for collection URL logic
                    const collectionSlug = currentUrlString.split('/').pop();
                    const collection = collections.find(c => c.slug === collectionSlug);
                    if (collection) {
                        setLinkType('collection');
                        setSelectedCollection(collection.slug);
                    } else {
                        // Fallback check for product query param style if still used
                        const productMatch = currentUrlString.match(/\/detalles-del-producto\?product=(.+)/);
                        if (productMatch) {
                            const productSlug = productMatch[1];
                            const product = products.find(p => p.slug === productSlug);
                            if (product) {
                                setLinkType('product');
                                setSelectedProduct(product.slug);
                            } else {
                                setLinkType('custom');
                                setCustomUrl(currentUrlString);
                            }
                        } else {
                            setLinkType('custom');
                            setCustomUrl(currentUrlString);
                        }
                    }
                } else {
                    const productMatch = currentUrlString.match(/\/detalles-del-producto\?product=(.+)/);
                    if (productMatch) {
                        const productSlug = productMatch[1];
                        const product = products.find(p => p.slug === productSlug);
                        if (product) {
                            setLinkType('product');
                            setSelectedProduct(product.slug);
                        } else {
                            setLinkType('custom');
                            setCustomUrl(currentUrlString);
                        }
                    } else {
                        setLinkType('custom');
                        setCustomUrl(currentUrlString);
                    }
                }
            } else if (typeof currentUrlString === 'string' && currentUrlString.startsWith('http')) {
                setLinkType('custom');
                setCustomUrl(currentUrlString);
            } else {
                setLinkType('none');
            }
        } else {
            setLinkType('none');
        }

        setIsInitialized(true);
        prevEditContentRef.current = editContent;
    }, [content.navigationUrl, dynamicPages, products, isInitialized]); // Dependencias estables

    // 2. ACTUALIZAR LA URL cuando cambian los controles
    useEffect(() => {
        if (!isInitialized) return;

        let newUrl = '';

        switch (linkType) {
            case 'page':
                if (selectedPage) {
                    newUrl = `/${selectedPage}`;
                }
                break;
            case 'product':
                if (selectedProduct) {
                    // newUrl = `/detalles-del-producto?product=${selectedProduct}`;
                    newUrl = `/tienda/producto/${selectedProduct}`; // Updated to cleaner URL structure if applicable, or keep query param
                    // Checking existing logic, it seems we might want to stick to what works or standardise.
                    // The previous read showed /detalles-del-producto?product=... but my plan mentioned /tienda/producto/...
                    // I will support both reading, but writing? Let's stick to what the system seems to use.
                    // Actually checking the read file, it parses `?product=`.
                    // But `Builder.jsx` passed `products` with `slug`.
                    // Let's use the cleaner URL if that's the new standard, or stick to the old one.
                    // The user's routes file showed `/{page_path}/{collection_slug}`.
                    // Product routes are usually handled differently.
                    // Let's assume `/detalles-del-producto?product=` is legacy and `/tienda/producto/` might be better, 
                    // BUT for safety I will stick to the one I saw in the file: `/detalles-del-producto?product=${selectedProduct}` 
                    // UNLESS I see a route for it.
                    // Wait, I saw `routes/web.php` earlier.
                    // There is `Route::get('/tienda/producto/{slug}', ...)`? I didn't see it explicitly.
                    // actually let's stick to the existing format found in the file `currentUrlString.match(/\/detalles-del-producto\?product=(.+)/)`
                    newUrl = `/detalles-del-producto?product=${selectedProduct}`;
                }
                break;
            case 'collection':
                if (selectedCollection) {
                    newUrl = `/tienda/${selectedCollection}`;
                }
                break;
            case 'custom':
                newUrl = customUrl || '';
                break;
            case 'none':
                newUrl = '';
                break;
        }

        const currentUrl = content.navigationUrl || '';
        const currentUrlString = String(currentUrl);

        if (newUrl !== currentUrlString) {
            updateContent('navigationUrl', newUrl);
        }
    }, [linkType, selectedPage, selectedProduct, selectedCollection, customUrl, isInitialized, content.navigationUrl]); // content.navigationUrl puede causar ciclo, pero está bien porque comparamos antes de actualizar

    // Memoizar funciones de actualización
    const updateContent = useCallback((key, value) => {
        setEditContent(prev => {
            const currentContent = typeof prev === 'object' ? prev : { text: prev || '' };
            return {
                ...currentContent,
                [key]: value
            };
        });
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const handleTextChange = useCallback((value) => {
        updateContent('text', value);
    }, [updateContent]);

    const handleCustomUrlChange = useCallback((value) => {
        setCustomUrl(value);
        if (linkType === 'custom') {
            updateContent('navigationUrl', value);
        }
    }, [linkType, updateContent]);

    const getCurrentText = useCallback(() => {
        return content.text || '';
    }, [content.text]);

    // Valores resueltos para ColorPicker
    const colorValue = resolveValue(editStyles.color) || '#ffffff';

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuración del Anuncio</h3>

            {/* Texto del anuncio */}
            <div>
                <Label htmlFor="announcementText">Texto del Anuncio</Label>
                <Input
                    id="announcementText"
                    value={getCurrentText()}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Texto que se mostrará en el anuncio"
                    className="mt-1"
                />
            </div>

            <Separator className="my-4" />

            {/* Configuración de navegación */}
            <div className="space-y-4">
                <h4 className="font-medium">Navegación del Anuncio</h4>

                <div>
                    <Label htmlFor="linkType">Tipo de Enlace</Label>
                    <Select
                        value={linkType}
                        onValueChange={(value) => {
                            setLinkType(value);
                            if (value === 'custom') {
                                const currentUrl = content.navigationUrl || '';
                                if (currentUrl && !customUrl) {
                                    setCustomUrl(currentUrl);
                                }
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de enlace" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin enlace</SelectItem>
                            <SelectItem value="page">Página Dinámica</SelectItem>
                            <SelectItem value="product">Página de Producto</SelectItem>
                            <SelectItem value="collection">Colección</SelectItem>
                            <SelectItem value="custom">URL Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Selector de Página Dinámica */}
                {linkType === 'page' && (
                    <div>
                        <Label htmlFor="dynamicPage">Seleccionar Página</Label>
                        <Select
                            value={selectedPage}
                            onValueChange={setSelectedPage}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una página" />
                            </SelectTrigger>
                            <SelectContent>
                                {dynamicPages.length > 0 ? (
                                    dynamicPages.map((page) => (
                                        <SelectItem key={page.slug} value={page.slug}>
                                            {page.title} (/{page.slug})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500">
                                        No hay páginas dinámicas disponibles
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                            URL: /{selectedPage || '[selecciona una página]'}
                        </p>
                    </div>
                )}

                {/* Selector de Producto */}
                {linkType === 'product' && (
                    <div>
                        <Label htmlFor="product">Seleccionar Producto</Label>
                        <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <SelectItem key={product.slug} value={product.slug}>
                                            {product.product_name || product.name || product.slug}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500">
                                        No hay productos disponibles
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                            URL: /detalles-del-producto?product={selectedProduct || '[selecciona un producto]'}
                        </p>
                    </div>
                )}

                {/* Selector de Colección */}
                {linkType === 'collection' && (
                    <div>
                        <Label htmlFor="collection">Seleccionar Colección</Label>
                        <Select
                            value={selectedCollection}
                            onValueChange={setSelectedCollection}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una colección" />
                            </SelectTrigger>
                            <SelectContent>
                                {collections.length > 0 ? (
                                    collections.map((collection) => (
                                        <SelectItem key={collection.slug} value={collection.slug}>
                                            {collection.title}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500">
                                        No hay colecciones disponibles
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                            URL: /tienda/{selectedCollection || '[selecciona una colección]'}
                        </p>
                    </div>
                )}

                {/* URL Personalizada */}
                {linkType === 'custom' && (
                    <div>
                        <Label htmlFor="customUrl">URL Personalizada</Label>
                        <Input
                            id="customUrl"
                            value={customUrl}
                            onChange={(e) => handleCustomUrlChange(e.target.value)}
                            placeholder="https://ejemplo.com o /ruta-interna"
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplos:<br />
                            • Enlace interno: /contacto<br />
                            • Enlace externo: https://google.com<br />
                            • Página estática: /inicio
                        </p>
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* Configuración de tipografía */}
            <div className="space-y-4">
                <h4 className="font-medium">Tipografía</h4>

                <div>
                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                    <div className="flex gap-2">
                        <Input
                            id="fontSize"
                            type="number"
                            value={parseInt(editStyles.fontSize) || 14}
                            onChange={(e) => updateStyle('fontSize', e.target.value)}
                            placeholder="14"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.fontSizeUnit || (editStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => updateStyle('fontSizeUnit', value)}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                                <SelectItem value="em">em</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="fontWeight">Peso de Fuente</Label>
                    <Select
                        value={editStyles.fontWeight || 'normal'}
                        onValueChange={(value) => updateStyle('fontWeight', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Negrita</SelectItem>
                            <SelectItem value="300">Ligero</SelectItem>
                            <SelectItem value="500">Medio</SelectItem>
                            <SelectItem value="600">Seminegrita</SelectItem>
                            <SelectItem value="700">Negrita</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="color">Color del Texto</Label>
                    <ColorPicker
                        value={colorValue}                     // ← controlado
                        onChange={(hex) => updateStyle('color', hex)}
                        showOpacity={false}
                    />
                </div>

                <div>
                    <Label htmlFor="textTransform">Transformación de Texto</Label>
                    <Select
                        value={editStyles.textTransform || 'none'}
                        onValueChange={(value) => updateStyle('textTransform', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Normal</SelectItem>
                            <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                            <SelectItem value="lowercase">minúsculas</SelectItem>
                            <SelectItem value="capitalize">Capitalizar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="fontType">Tipo de Fuente</Label>
                    <Select
                        value={editStyles.fontType || 'default'}
                        onValueChange={(value) => updateStyle('fontType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Por defecto</SelectItem>
                            <SelectItem value="body_font">
                                Body Font ({themeSettings?.body_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="heading_font">
                                Heading Font ({themeSettings?.heading_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="subheading_font">
                                Subheading Font ({themeSettings?.subheading_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="accent_font">
                                Accent Font ({themeSettings?.accent_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.fontType === 'custom' && (
                    <div>
                        <Label htmlFor="customFont">Fuente Personalizada</Label>
                        <Input
                            id="customFont"
                            value={editStyles.customFont || ''}
                            onChange={(e) => updateStyle('customFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                            className="mt-1"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(AnnouncementEditDialog);