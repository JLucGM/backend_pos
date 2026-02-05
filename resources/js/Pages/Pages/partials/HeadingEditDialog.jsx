// components/BuilderPages/partials/HeadingEditDialog.jsx
import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const HeadingEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Extraer el texto del contenido (puede ser string u objeto)
    const getTextValue = () => {
        if (!editContent) return '';

        if (typeof editContent === 'string') {
            return editContent;
        }

        if (typeof editContent === 'object' && editContent !== null) {
            return editContent.text || editContent.title || '';
        }

        return String(editContent);
    };

    // Manejar cambio de texto
    const handleTextChange = (value) => {
        // Asegurarnos de que editContent siempre sea un string para heading
        setEditContent(value);
    };

    // Función para restablecer a valores por defecto según el heading
    const resetToDefaults = () => {
        const textStyle = editStyles.textStyle || 'heading2';

        if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            const defaultStyles = {
                fontSize: themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`,
                fontWeight: themeSettings?.[`heading${level}_fontWeight`] || 'bold',
                lineHeight: themeSettings?.[`heading${level}_lineHeight`] || 'tight',
                textTransform: themeSettings?.[`heading${level}_textTransform`] || 'none',
                fontType: 'default',
                customFont: '',
            };

            setEditStyles(prev => ({
                ...prev,
                ...defaultStyles,
            }));
        }
    };

    // Determinar qué controles mostrar
    const isCustomStyle = editStyles.textStyle === 'custom';
    const isHeadingStyle = editStyles.textStyle?.startsWith('heading');

    // Obtener la fuente predeterminada según el estilo
    const getDefaultFontType = () => {
        if (editStyles.textStyle?.startsWith('heading')) {
            return 'heading_font';
        }
        return 'body_font';
    };

    // Obtener el valor actual de fontType o usar el predeterminado
    const currentFontType = editStyles.fontType || 'default';

    return (
        <div className="space-y-4">
            {/* Botón para restablecer a valores por defecto */}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToDefaults}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restablecer tipografía
                </Button>
            </div>

            <Label htmlFor="content">Contenido</Label>
            <textarea
                id="content"
                value={getTextValue()}  // Usar getTextValue() en lugar de editContent directamente
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-20 p-2 border rounded"
            />

            {/* Transformación de texto */}
            <div>
                <Label htmlFor="textTransform">Transformación de texto</Label>
                <div className="flex gap-2">
                    <Select
                        value={editStyles.textTransform || 'none'}
                        onValueChange={(value) => updateStyle('textTransform', value)}
                        className="flex-1"
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
            </div>
            <Separator className="my-4" />

            {/* Nivel del Heading */}
            <div>
                <Label htmlFor="textStyle">Nivel del Encabezado</Label>
                <Select
                    value={editStyles.textStyle || 'heading2'}
                    onValueChange={(value) => {
                        updateStyle('textStyle', value);

                        // Actualizar automáticamente los valores del tema
                        if (value.startsWith('heading') && themeSettings) {
                            const level = value.replace('heading', '');
                            updateStyle('fontSize', themeSettings[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`);
                            updateStyle('fontWeight', themeSettings[`heading${level}_fontWeight`] || 'bold');
                            updateStyle('lineHeight', themeSettings[`heading${level}_lineHeight`] || 'tight');
                            updateStyle('textTransform', themeSettings[`heading${level}_textTransform`] || 'none');
                            updateStyle('fontType', 'default');
                            updateStyle('customFont', '');
                        } else if (value === 'custom') {
                            // Resetear a valores personalizados
                            updateStyle('fontSize', '32px');
                            updateStyle('fontWeight', 'bold');
                            updateStyle('lineHeight', 'tight');
                            updateStyle('textTransform', 'none');
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="heading1">
                            Heading 1 - {themeSettings?.heading1_fontSize || '3rem'}
                        </SelectItem>
                        <SelectItem value="heading2">
                            Heading 2 - {themeSettings?.heading2_fontSize || '2.5rem'}
                        </SelectItem>
                        <SelectItem value="heading3">
                            Heading 3 - {themeSettings?.heading3_fontSize || '2rem'}
                        </SelectItem>
                        <SelectItem value="heading4">
                            Heading 4 - {themeSettings?.heading4_fontSize || '1.75rem'}
                        </SelectItem>
                        <SelectItem value="heading5">
                            Heading 5 - {themeSettings?.heading5_fontSize || '1.5rem'}
                        </SelectItem>
                        <SelectItem value="heading6">
                            Heading 6 - {themeSettings?.heading6_fontSize || '1.25rem'}
                        </SelectItem>
                        <SelectItem value="custom">
                            Personalizado
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Solo mostrar opciones de tipografía avanzada si es personalizado */}
            {isCustomStyle && (
                <>
                    <p>Estilo del encabezado personalizado</p>

                    {/* Tamaño de fuente personalizado */}
                    <div>
                        <Label htmlFor="fontSize">Tamaño de fuente</Label>
                        <div className="flex gap-2">
                            <Input
                                id="fontSize"
                                type="number"
                                value={parseInt(editStyles.fontSize) || 32}
                                onChange={(e) => updateStyle('fontSize', e.target.value)}
                                placeholder="32"
                                className="flex-1"
                            />
                            <Select
                                value={editStyles.fontSizeUnit || (editStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')}
                                onValueChange={(value) => updateStyle('fontSizeUnit', value)}
                            >
                                <SelectTrigger className="w-24">
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

                    {/* Peso de fuente personalizado */}
                    <div>
                        <Label htmlFor="fontWeight">Peso de fuente</Label>
                        <div className="flex gap-2">
                            <Select
                                value={editStyles.fontWeight || 'bold'}
                                onValueChange={(value) => updateStyle('fontWeight', value)}
                                className="flex-1"
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
                    </div>

                    {/* Altura de línea personalizada */}
                    <div>
                        <Label htmlFor="lineHeight">Altura de línea</Label>
                        <div className="flex gap-2">
                            <Select
                                value={editStyles.lineHeight || 'tight'}
                                onValueChange={(value) => updateStyle('lineHeight', value)}
                                className="flex-1"
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tight">Tight (1.2)</SelectItem>
                                    <SelectItem value="normal">Normal (1.4)</SelectItem>
                                    <SelectItem value="loose">Loose (1.6)</SelectItem>
                                    <SelectItem value="custom">Personalizada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {editStyles.lineHeight === 'custom' && (
                        <div>
                            <Label htmlFor="customLineHeight">Altura personalizada</Label>
                            <Input
                                id="customLineHeight"
                                value={editStyles.customLineHeight || ''}
                                onChange={(e) => updateStyle('customLineHeight', e.target.value)}
                                placeholder="1.5"
                            />
                        </div>
                    )}
                    <Separator className="my-4" />
                </>
            )}

            {/* Selección de fuente */}
            <div>
                <Label htmlFor="fontType">Tipo de Fuente</Label>
                <Select
                    value={currentFontType}
                    onValueChange={(value) => updateStyle('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            Por defecto (usar fuente del tema)
                        </SelectItem>
                        <SelectItem value="heading_font">
                            Heading Font ({themeSettings?.heading_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="body_font">
                            Body Font ({themeSettings?.body_font || 'Inter'})
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

            {currentFontType === 'custom' && (
                <>
                    <div>
                        <Label htmlFor="customFont">Fuente Personalizada</Label>
                        <Input
                            id="customFont"
                            value={editStyles.customFont || ''}
                            onChange={(e) => updateStyle('customFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                        />
                    </div>
                    <Separator className="my-4" />
                </>
            )}

            {/* Resto de opciones de estilo */}
            <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Estilo de contenedor</h4>

                {/* Layout */}
                <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select
                        value={editStyles.layout || 'fit'}
                        onValueChange={(value) => updateStyle('layout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                            <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Alignment */}
                {editStyles.layout === 'fill' && (
                    <div>
                        <Label htmlFor="alignment">Alineación</Label>
                        <Select
                            value={editStyles.alignment || 'left'}
                            onValueChange={(value) => updateStyle('alignment', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="left">Izquierda</SelectItem>
                                <SelectItem value="center">Centro</SelectItem>
                                <SelectItem value="right">Derecha</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Color */}
                <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            value={editStyles.color || '#000000'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.color || '#000000'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                {/* Padding */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 0}
                            onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 0}
                            onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 0}
                            onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 0}
                            onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        />
                    </div>
                </div>

                {/* Background */}
                {/* <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="backgroundColor"
                            value={editStyles.backgroundColor || 'transparent'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            placeholder="transparent"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.backgroundColor === 'transparent' ? '#ffffff' : editStyles.backgroundColor || '#ffffff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div> */}

                {/* Border-Radius */}
                <div>
                    <Label htmlFor="borderRadius">Radio de Borde</Label>
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || 0}
                        onChange={(e) => updateStyle('borderRadius', e.target.value)}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeadingEditDialog;