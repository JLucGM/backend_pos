import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Slider } from '@/Components/ui/slider';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductDetailDescriptionEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para restablecer a valores por defecto del tema
    const resetToDefaults = () => {
        const textStyle = editStyles.textStyle || 'paragraph';

        let defaultStyles = {};

        if (textStyle === 'paragraph' && themeSettings) {
            defaultStyles = {
                fontSize: themeSettings.paragraph_fontSize || '16px',
                fontWeight: themeSettings.paragraph_fontWeight || 'normal',
                lineHeight: themeSettings.paragraph_lineHeight || '1.6',
                textTransform: themeSettings.paragraph_textTransform || 'none',
                fontType: 'default',
                customFont: '',
            };
        } else if (textStyle.startsWith('heading') && themeSettings) {
            const level = textStyle.replace('heading', '');
            defaultStyles = {
                fontSize: themeSettings[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`,
                fontWeight: themeSettings[`heading${level}_fontWeight`] || 'bold',
                lineHeight: themeSettings[`heading${level}_lineHeight`] || '1.2',
                textTransform: themeSettings[`heading${level}_textTransform`] || 'none',
                fontType: 'default',
                customFont: '',
            };
        }

        setEditStyles(prev => ({
            ...prev,
            ...defaultStyles
        }));
    };

    // Obtener valor actual de fontType
    const currentFontType = editStyles.fontType || 'default';
    const isCustomStyle = editStyles.textStyle === 'custom';

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

            {/* Estilo de Texto - Opciones predefinidas */}
            <div>
                <Label htmlFor="textStyle">Estilo de Texto</Label>
                <Select
                    value={editStyles.textStyle || 'paragraph'}
                    onValueChange={(value) => {
                        handleStyleChange('textStyle', value);

                        // Si se selecciona un estilo predefinido, actualizar los valores automáticamente
                        if (value === 'paragraph' && themeSettings) {
                            handleStyleChange('fontSize', themeSettings.paragraph_fontSize || '16px');
                            handleStyleChange('fontWeight', themeSettings.paragraph_fontWeight || 'normal');
                            handleStyleChange('lineHeight', themeSettings.paragraph_lineHeight || '1.6');
                            handleStyleChange('textTransform', themeSettings.paragraph_textTransform || 'none');
                            handleStyleChange('fontType', 'default');
                            handleStyleChange('customFont', '');
                        } else if (value.startsWith('heading') && themeSettings) {
                            const level = value.replace('heading', '');
                            handleStyleChange('fontSize', themeSettings[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`);
                            handleStyleChange('fontWeight', themeSettings[`heading${level}_fontWeight`] || 'bold');
                            handleStyleChange('lineHeight', themeSettings[`heading${level}_lineHeight`] || '1.2');
                            handleStyleChange('textTransform', themeSettings[`heading${level}_textTransform`] || 'none');
                            handleStyleChange('fontType', 'default');
                            handleStyleChange('customFont', '');
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paragraph">
                            Párrafo - {themeSettings?.paragraph_fontSize || '16px'}
                        </SelectItem>
                        <SelectItem value="heading1">
                            Heading 1 - {themeSettings?.heading1_fontSize || '56px'}
                        </SelectItem>
                        <SelectItem value="heading2">
                            Heading 2 - {themeSettings?.heading2_fontSize || '48px'}
                        </SelectItem>
                        <SelectItem value="heading3">
                            Heading 3 - {themeSettings?.heading3_fontSize || '40px'}
                        </SelectItem>
                        <SelectItem value="heading4">
                            Heading 4 - {themeSettings?.heading4_fontSize || '32px'}
                        </SelectItem>
                        <SelectItem value="heading5">
                            Heading 5 - {themeSettings?.heading5_fontSize || '24px'}
                        </SelectItem>
                        <SelectItem value="heading6">
                            Heading 6 - {themeSettings?.heading6_fontSize || '20px'}
                        </SelectItem>
                        <SelectItem value="custom">
                            Personalizado
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator className="my-4" />

            {/* Controles de tipografía avanzada solo si es custom */}
            {isCustomStyle && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fontSize">Tamaño de fuente</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="fontSize"
                                    value={editStyles.fontSize || '16px'}
                                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                    placeholder="Ej: 16px"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (editStyles.textStyle === 'paragraph') {
                                            handleStyleChange('fontSize', themeSettings?.paragraph_fontSize || '16px');
                                        } else if (editStyles.textStyle?.startsWith('heading')) {
                                            const level = editStyles.textStyle.replace('heading', '');
                                            handleStyleChange('fontSize', themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`);
                                        }
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    Por defecto
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="fontWeight">Grosor de fuente</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={editStyles.fontWeight || 'normal'}
                                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                                    className="flex-1"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Grosor de fuente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Ligera (300)</SelectItem>
                                        <SelectItem value="normal">Normal (400)</SelectItem>
                                        <SelectItem value="medium">Medio (500)</SelectItem>
                                        <SelectItem value="semibold">Seminegrita (600)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (editStyles.textStyle === 'paragraph') {
                                            handleStyleChange('fontWeight', themeSettings?.paragraph_fontWeight || 'normal');
                                        } else if (editStyles.textStyle?.startsWith('heading')) {
                                            const level = editStyles.textStyle.replace('heading', '');
                                            handleStyleChange('fontWeight', themeSettings?.[`heading${level}_fontWeight`] || 'bold');
                                        }
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    Por defecto
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="lineHeight">Altura de línea</Label>
                        <div className="flex gap-2">
                            <Select
                                value={editStyles.lineHeight || '1.6'}
                                onValueChange={(value) => handleStyleChange('lineHeight', value)}
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
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (editStyles.textStyle === 'paragraph') {
                                        handleStyleChange('lineHeight', themeSettings?.paragraph_lineHeight || '1.6');
                                    } else if (editStyles.textStyle?.startsWith('heading')) {
                                        const level = editStyles.textStyle.replace('heading', '');
                                        handleStyleChange('lineHeight', themeSettings?.[`heading${level}_lineHeight`] || '1.2');
                                    }
                                }}
                                className="whitespace-nowrap"
                            >
                                Por defecto
                            </Button>
                        </div>
                    </div>

                    {editStyles.lineHeight === 'custom' && (
                        <div>
                            <Label htmlFor="customLineHeight">Altura personalizada</Label>
                            <Input
                                id="customLineHeight"
                                value={editStyles.customLineHeight || ''}
                                onChange={(e) => handleStyleChange('customLineHeight', e.target.value)}
                                placeholder="1.5"
                            />
                        </div>
                    )}
                    <Separator className="my-4" />
                </>
            )}

            {/* Selección de fuente - DISPONIBLE PARA TODOS LOS ESTILOS */}
            <div>
                <Label htmlFor="fontType">Tipo de Fuente</Label>
                <Select
                    value={currentFontType}
                    onValueChange={(value) => handleStyleChange('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            Por defecto (usar fuente del tema para este estilo)
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

            {currentFontType === 'custom' && (
                <div>
                    <Label htmlFor="customFont">Fuente Personalizada</Label>
                    <Input
                        id="customFont"
                        value={editStyles.customFont || ''}
                        onChange={(e) => handleStyleChange('customFont', e.target.value)}
                        placeholder="'Roboto', sans-serif"
                    />
                </div>
            )}

            {/* Transformación de texto */}
            <div>
                <Label htmlFor="textTransform">Transformación de texto</Label>
                <Select
                    value={editStyles.textTransform || 'none'}
                    onValueChange={(value) => handleStyleChange('textTransform', value)}
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

            <Separator className="my-4" />

            {/* Controles de estilo adicionales */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                        id="color"
                        type="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="alignment">Alineación</Label>
                    <Select
                        value={editStyles.alignment || 'left'}
                        onValueChange={(value) => handleStyleChange('alignment', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Alineación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Izquierda</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="right">Derecha</SelectItem>
                            <SelectItem value="justify">Justificado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="lineHeight">Altura de línea</Label>
                <div className="space-y-2">
                    <Slider
                        id="lineHeight"
                        min={1}
                        max={2.5}
                        step={0.1}
                        value={[parseFloat(editStyles.lineHeight) || 1.6]}
                        onValueChange={([value]) => handleStyleChange('lineHeight', value.toString())}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Apretado</span>
                        <span>Normal ({editStyles.lineHeight || '1.6'})</span>
                        <span>Amplio</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="padding">Padding interno</Label>
                    <Input
                        id="padding"
                        value={editStyles.padding || '0'}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="Ej: 10px"
                    />
                </div>

                <div>
                    <Label htmlFor="margin">Margen</Label>
                    <Input
                        id="margin"
                        value={editStyles.margin || '0 0 20px 0'}
                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                        placeholder="Ej: 0 0 20px 0"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={editStyles.backgroundColor || 'transparent'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        id="borderRadius"
                        value={editStyles.borderRadius || '0px'}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                        placeholder="Ej: 8px"
                    />
                </div>

                <div>
                    <Label htmlFor="borderWidth">Grosor del borde</Label>
                    <Input
                        id="borderWidth"
                        value={editStyles.borderWidth || '0px'}
                        onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                        placeholder="Ej: 1px"
                    />
                </div>
            </div>

            {editStyles.borderWidth !== '0px' && (
                <div>
                    <Label htmlFor="borderColor">Color del borde</Label>
                    <Input
                        id="borderColor"
                        type="color"
                        value={editStyles.borderColor || '#e5e7eb'}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    />
                </div>
            )}

        </div>
    );
};

export default ProductDetailDescriptionEditDialog;