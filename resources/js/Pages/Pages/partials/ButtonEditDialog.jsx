import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ButtonEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings, isLiveEdit = true, dynamicPages = [], products = [] }) => {
    const [linkType, setLinkType] = useState('none');
    const [selectedPage, setSelectedPage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Debounce for live updates
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const prevEditStylesRef = useRef(editStyles);
    const prevEditContentRef = useRef(editContent);

    // 1. INICIALIZACIÓN UNA VEZ - sin reaccionar a cambios posteriores
    useEffect(() => {
        // Solo inicializar una vez
        if (isInitialized) return;

        // Asegurarse de que currentUrl sea una cadena
        const currentUrl = editStyles?.buttonUrl || editContent || '';
        const currentUrlString = String(currentUrl); // Convertir a string seguro

        // Inicializar el tipo de enlace
        if (currentUrlString && currentUrlString.trim() !== '') {
            if (typeof currentUrlString === 'string' && currentUrlString.startsWith('/')) {
                // Verificar si es una página dinámica
                const pageSlug = currentUrlString.replace('/', '');
                const page = dynamicPages.find(p => p.slug === pageSlug);
                if (page) {
                    setLinkType('page');
                    setSelectedPage(page.slug);
                } else {
                    // Verificar si es un producto
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

        // Guardar valores iniciales
        prevEditStylesRef.current = editStyles;
        prevEditContentRef.current = editContent;
    }, [editStyles, editContent, dynamicPages, products, isInitialized]);

    // 2. SINCRONIZACIÓN MANUAL cuando cambia la URL desde fuera
    useEffect(() => {
        // Solo actualizar si realmente cambió la URL
        const currentUrl = editStyles?.buttonUrl || editContent || '';
        const prevUrl = prevEditStylesRef.current?.buttonUrl || prevEditContentRef.current || '';

        // Convertir ambos a strings para comparación
        const currentUrlString = String(currentUrl);
        const prevUrlString = String(prevUrl);

        if (currentUrlString !== prevUrlString && currentUrlString.trim() !== '') {
            // Reinicializar con la nueva URL
            setIsInitialized(false);
            setLinkType('none');
            setSelectedPage('');
            setSelectedProduct('');
            setCustomUrl('');
        }

        // Actualizar referencias
        prevEditStylesRef.current = editStyles;
        prevEditContentRef.current = editContent;
    }, [editStyles?.buttonUrl, editContent]);

    // 3. ACTUALIZAR LA URL cuando cambian los controles
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
                    newUrl = `/detalles-del-producto?product=${selectedProduct}`;
                }
                break;
            case 'custom':
                newUrl = customUrl || '';
                break;
            case 'none':
                newUrl = '';
                break;
        }

        // Solo actualizar si realmente cambió
        const currentUrl = editStyles?.buttonUrl || editContent || '';
        const currentUrlString = String(currentUrl);

        if (newUrl !== currentUrlString) {
            // Guardar la URL en buttonUrl de los estilos
            setEditStyles(prev => ({ ...prev, buttonUrl: newUrl }));

            // Si el contenido actual era la misma URL, limpiarlo para mantener solo el texto
            if (editContent === currentUrl) {
                setEditContent(editStyles?.buttonText || '');
            }
        }
    }, [linkType, selectedPage, selectedProduct, customUrl, isInitialized]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Manejar cambio de texto del botón
    const handleTextChange = (value) => {
        // Guardar en buttonText de los estilos
        updateStyle('buttonText', value);

        // También actualizar el contenido principal si no es una URL
        const currentUrl = editStyles?.buttonUrl || editContent || '';
        if (editContent && !currentUrl.startsWith('/') && !currentUrl.startsWith('http')) {
            setEditContent(value);
        }
    };

    // Manejar cambio de URL personalizada
    const handleCustomUrlChange = (value) => {
        setCustomUrl(value);
        if (linkType === 'custom') {
            // Actualizar inmediatamente
            setEditStyles(prev => ({ ...prev, buttonUrl: value }));
        }
    };

    // Obtener el texto actual del botón
    const getCurrentText = () => {
        return editStyles?.buttonText || editContent || '';
    };

    return (
        <div className="space-y-4">
            {/* Texto del botón */}
            <div>
                <Label htmlFor="buttonText">Texto del Botón</Label>
                <Input
                    id="buttonText"
                    value={getCurrentText()}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Texto que se mostrará"
                    className="mt-1"
                />
            </div>

            <Separator className="my-4" />

            {/* Configuración de enlace */}
            <div className="space-y-4">
                <h3 className="font-medium">Enlace del Botón</h3>

                <div>
                    <Label htmlFor="linkType">Tipo de Enlace</Label>
                    <Select
                        value={linkType}
                        onValueChange={(value) => {
                            setLinkType(value);
                            if (value === 'custom') {
                                // Inicializar customUrl si está vacío
                                const currentUrl = editStyles?.buttonUrl || editContent || '';
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
                            <SelectItem value="none">Sin enlace (acción)</SelectItem>
                            <SelectItem value="page">Página Dinámica</SelectItem>
                            <SelectItem value="product">Página de Producto</SelectItem>
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
                                            {product.product_name}
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

                {/* {linkType === 'none' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            El botón no tendrá enlace. Se usará para acciones como "Agregar al carrito".
                        </p>
                    </div>
                )} */}
            </div>

            <Separator className="my-4" />

            {/* Configuración de ancho */}
            <div className="space-y-4">
                <h3 className="font-medium">Ancho del Botón</h3>

                <div>
                    <Label htmlFor="layout">Tipo de Ancho</Label>
                    <Select
                        value={editStyles.layout || 'fit'}
                        onValueChange={(value) => updateStyle('layout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fit">Ancho Natural</SelectItem>
                            <SelectItem value="fill">Ancho Completo (100%)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        {editStyles.layout === 'fill'
                            ? 'El botón ocupará todo el ancho disponible'
                            : 'El botón tendrá el ancho según su contenido'}
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Configuración de posición */}
            <div className="space-y-4">
                <h3 className="font-medium">Posición del Botón</h3>

                <div>
                    <Label htmlFor="align">Alineación</Label>
                    <Select
                        value={editStyles.align || 'start'}
                        onValueChange={(value) => updateStyle('align', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="start">Start (Izquierda)</SelectItem>
                            <SelectItem value="center">Center (Centro)</SelectItem>
                            <SelectItem value="end">End (Derecha)</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        {editStyles.layout === 'fill'
                            ? 'La posición afecta la alineación del texto dentro del botón'
                            : 'La posición afecta la alineación del botón dentro de su contenedor'}
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Estilos del botón */}
            <div>
                <Label htmlFor="buttonType">Tipo de Botón</Label>
                <Select
                    value={editStyles.buttonType || 'primary'}
                    onValueChange={(value) => updateStyle('buttonType', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de botón" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="primary">Primario (Usa estilos del tema)</SelectItem>
                        <SelectItem value="secondary">Secundario (Usa estilos del tema)</SelectItem>
                        <SelectItem value="custom">Personalizado (Ignora estilos del tema)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Solo mostrar opciones de personalización completas si el tipo es "custom" */}
            {editStyles.buttonType === 'custom' && (
                <>
                    {/* Padding Individual */}
                    <Label>Padding (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop">Arriba</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editStyles.paddingTop) || 10}
                                onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editStyles.paddingRight) || 10}
                                onChange={(e) => updateStyle('paddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom">Abajo</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editStyles.paddingBottom) || 10}
                                onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editStyles.paddingLeft) || 10}
                                onChange={(e) => updateStyle('paddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    {/* Border-Radius */}
                    <Label htmlFor="borderRadius">Radio de Borde (px)</Label>
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || 4}
                        onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                    />

                    {/* Tamaño de fuente */}
                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                    <Input
                        id="fontSize"
                        value={editStyles.fontSize || '16px'}
                        onChange={(e) => updateStyle('fontSize', e.target.value)}
                        placeholder="16px"
                    />

                    {/* Color de Texto */}
                    <Label htmlFor="color">Color de Texto</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            value={editStyles.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Color de Fondo */}
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="backgroundColor"
                            value={editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            placeholder="#007bff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Color de Borde */}
                    <Label htmlFor="borderColor">Color de Borde</Label>
                    <div className="flex gap-2">
                        <Input
                            id="borderColor"
                            value={editStyles.borderColor || editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('borderColor', e.target.value)}
                            placeholder="#007bff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.borderColor || editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('borderColor', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Grosor del Borde */}
                    <Label htmlFor="borderWidth">Grosor del Borde (px)</Label>
                    <Input
                        id="borderWidth"
                        type="number"
                        value={parseInt(editStyles.borderWidth) || 1}
                        onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
                    />

                    {/* Text Transform */}
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

                    {/* Estilos de Hover (solo para custom) */}
                    <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Estilos de Hover</h4>

                        <Label htmlFor="hoverColor">Color de Texto (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverColor"
                                value={editStyles.hoverColor || ''}
                                onChange={(e) => updateStyle('hoverColor', e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverColor || '#ffffff'}
                                onChange={(e) => updateStyle('hoverColor', e.target.value)}
                                className="w-12"
                            />
                        </div>

                        <Label htmlFor="hoverBackgroundColor">Color de Fondo (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverBackgroundColor"
                                value={editStyles.hoverBackgroundColor || ''}
                                onChange={(e) => updateStyle('hoverBackgroundColor', e.target.value)}
                                placeholder="#0056b3"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverBackgroundColor || '#0056b3'}
                                onChange={(e) => updateStyle('hoverBackgroundColor', e.target.value)}
                                className="w-12"
                            />
                        </div>

                        <Label htmlFor="hoverBorderColor">Color de Borde (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverBorderColor"
                                value={editStyles.hoverBorderColor || ''}
                                onChange={(e) => updateStyle('hoverBorderColor', e.target.value)}
                                placeholder="#0056b3"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverBorderColor || '#0056b3'}
                                onChange={(e) => updateStyle('hoverBorderColor', e.target.value)}
                                className="w-12"
                            />
                        </div>
                    </div>
                    <Separator className="my-4" />
                </>
            )}

            {/* Selección de fuente (para todos los tipos de botón) */}
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
                        <SelectItem value="default">
                            Por defecto (usar fuente del tema)
                        </SelectItem>
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
                    />
                </div>
            )}

            {/* Si es primary o secondary, mostrar solo las opciones que pueden sobrescribir */}
            {(editStyles.buttonType === 'primary' || editStyles.buttonType === 'secondary') && (
                <div className="space-y-4">
                    {/* Opciones de sobrescritura específicas */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="borderRadius">Radio de Borde Personalizado</Label>
                            <Input
                                id="borderRadius"
                                placeholder="Ej: 8px"
                                value={editStyles.borderRadius || ''}
                                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="fontSize">Tamaño de Fuente Personalizado</Label>
                            <Input
                                id="fontSize"
                                placeholder="Ej: 18px"
                                value={editStyles.fontSize || ''}
                                onChange={(e) => updateStyle('fontSize', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonEditDialog;