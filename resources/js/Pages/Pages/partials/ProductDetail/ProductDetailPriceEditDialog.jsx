import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Button } from '@/Components/ui/button';
import { RotateCcw, Info } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductDetailPriceEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = useCallback((value) => resolveStyleValue(value, themeWithDefaults, appliedTheme), [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleStyleChange = useCallback((key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditStyles]);

    const renderThemeReference = (themeKey, label) => {
        const rawValue = themeWithDefaults[themeKey];
        if (!rawValue) return null;
        const resolved = resolveValue(rawValue);
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Info size={12} />
                <span>{label} del tema: </span>
                <Badge variant="outline" className="text-xs">
                    {resolved}
                </Badge>
            </div>
        );
    };

    const resetToThemeDefaults = useCallback(() => {
        const textStyle = editStyles.textStyle || 'heading3';

        let defaultStyles = {};

        if (textStyle === 'paragraph') {
            defaultStyles = {
                fontSize: themeSettings?.paragraph_fontSize || '16px',
                fontWeight: themeSettings?.paragraph_fontWeight || 'normal',
                lineHeight: themeSettings?.paragraph_lineHeight || '1.6',
                textTransform: themeSettings?.paragraph_textTransform || 'none',
                color: 'theme.text',
            };
        } else if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            defaultStyles = {
                fontSize: themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`,
                fontWeight: themeSettings?.[`heading${level}_fontWeight`] || 'bold',
                lineHeight: themeSettings?.[`heading${level}_lineHeight`] || '1.2',
                textTransform: themeSettings?.[`heading${level}_textTransform`] || 'none',
                color: 'theme.text',
            };
        }

        if (Object.keys(defaultStyles).length > 0) {
            setEditStyles(prev => ({
                ...prev,
                ...defaultStyles,
                fontType: 'default',
                customFont: '',
            }));
        }
    }, [editStyles.textStyle, themeSettings, setEditStyles]);

    const currentFontType = editStyles.fontType || 'default';
    const isCustomStyle = editStyles.textStyle === 'custom';

    const colorValue = resolveValue(editStyles.color) || resolveValue(themeWithDefaults.text) || '#666666';
    const originalPriceColorValue = resolveValue(editStyles.originalPriceColor) || resolveValue(themeWithDefaults.text) || '#999999';
    const discountPriceColorValue = resolveValue(editStyles.discountPriceColor) || resolveValue(themeWithDefaults.primary) || '#dc2626';

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToThemeDefaults}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Usar valores del tema
                </Button>
            </div>

            <div>
                <Label htmlFor="textStyle">
                    Estilo de Texto
                    {renderThemeReference('body_font', 'Fuente base')}
                </Label>
                <Select
                    value={editStyles.textStyle || 'heading3'}
                    onValueChange={(value) => handleStyleChange('textStyle', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="heading1">
                            Heading 1 - {themeSettings?.heading1_fontSize || '2.5rem'}
                        </SelectItem>
                        <SelectItem value="heading2">
                            Heading 2 - {themeSettings?.heading2_fontSize || '2rem'}
                        </SelectItem>
                        <SelectItem value="heading3">
                            Heading 3 - {themeSettings?.heading3_fontSize || '1.75rem'}
                        </SelectItem>
                        <SelectItem value="heading4">
                            Heading 4 - {themeSettings?.heading4_fontSize || '1.5rem'}
                        </SelectItem>
                        <SelectItem value="heading5">
                            Heading 5 - {themeSettings?.heading5_fontSize || '1.25rem'}
                        </SelectItem>
                        <SelectItem value="heading6">
                            Heading 6 - {themeSettings?.heading6_fontSize || '1rem'}
                        </SelectItem>
                        <SelectItem value="paragraph">
                            Párrafo - {themeSettings?.paragraph_fontSize || '16px'}
                        </SelectItem>
                        <SelectItem value="custom">
                            Personalizado
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isCustomStyle && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fontSize">
                                Tamaño de fuente
                                {editStyles.textStyle?.startsWith('heading') &&
                                    renderThemeReference(`${editStyles.textStyle}_fontSize`, 'Valor del tema')}
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="fontSize"
                                    type="number"
                                    value={parseInt(editStyles.fontSize) || ''}
                                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                    placeholder="24"
                                    className="flex-1"
                                />
                                <Select
                                    value={editStyles.fontSizeUnit || (editStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')}
                                    onValueChange={(value) => handleStyleChange('fontSizeUnit', value)}
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const textStyle = editStyles.textStyle;
                                        let themeVal = '24px';
                                        if (textStyle === 'paragraph') {
                                            themeVal = themeSettings?.paragraph_fontSize || '16px';
                                        } else if (textStyle?.startsWith('heading')) {
                                            const level = textStyle.replace('heading', '');
                                            themeVal = themeSettings?.[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`;
                                        }
                                        handleStyleChange('fontSize', parseInt(themeVal) || 24);
                                        handleStyleChange('fontSizeUnit', themeVal.toString().includes('rem') ? 'rem' : 'px');
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    Tema
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="fontWeight">
                                Grosor de fuente
                                {editStyles.textStyle?.startsWith('heading') &&
                                    renderThemeReference(`${editStyles.textStyle}_fontWeight`, 'Valor del tema')}
                            </Label>
                            <div className="flex gap-2">
                                <Select
                                    value={editStyles.fontWeight || 'bold'}
                                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                                    className="flex-1"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Grosor de fuente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="300">Ligera (300)</SelectItem>
                                        <SelectItem value="400">Normal (400)</SelectItem>
                                        <SelectItem value="500">Medio (500)</SelectItem>
                                        <SelectItem value="600">Seminegrita (600)</SelectItem>
                                        <SelectItem value="700">Negrita (700)</SelectItem>
                                        <SelectItem value="800">Extra negrita (800)</SelectItem>
                                        <SelectItem value="900">Black (900)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const textStyle = editStyles.textStyle;
                                        if (textStyle === 'paragraph') {
                                            handleStyleChange('fontWeight', themeSettings?.paragraph_fontWeight || 'normal');
                                        } else if (textStyle?.startsWith('heading')) {
                                            const level = textStyle.replace('heading', '');
                                            handleStyleChange('fontWeight', themeSettings?.[`heading${level}_fontWeight`] || 'bold');
                                        } else {
                                            handleStyleChange('fontWeight', 'bold');
                                        }
                                    }}
                                    className="whitespace-nowrap"
                                >
                                    Tema
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="lineHeight">
                            Altura de línea
                            {editStyles.textStyle?.startsWith('heading') &&
                                renderThemeReference(`${editStyles.textStyle}_lineHeight`, 'Valor del tema')}
                        </Label>
                        <div className="flex gap-2">
                            <Select
                                value={editStyles.lineHeight || '1.4'}
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
                                    const textStyle = editStyles.textStyle;
                                    if (textStyle === 'paragraph') {
                                        handleStyleChange('lineHeight', themeSettings?.paragraph_lineHeight || '1.6');
                                    } else if (textStyle?.startsWith('heading')) {
                                        const level = textStyle.replace('heading', '');
                                        handleStyleChange('lineHeight', themeSettings?.[`heading${level}_lineHeight`] || '1.2');
                                    } else {
                                        handleStyleChange('lineHeight', '1.4');
                                    }
                                }}
                                className="whitespace-nowrap"
                            >
                                Tema
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

            <div>
                <Label htmlFor="fontType">
                    Tipo de Fuente
                    {renderThemeReference('body_font', 'Fuente por defecto')}
                </Label>
                <Select
                    value={currentFontType}
                    onValueChange={(value) => handleStyleChange('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            <span className="flex items-center gap-2">
                                <span>Por defecto</span>
                                <Badge variant="outline" className="text-xs">
                                    {themeWithDefaults.body_font || 'Inter'}
                                </Badge>
                            </span>
                        </SelectItem>
                        <SelectItem value="body_font">
                            <span className="flex items-center gap-2">
                                <span>Body Font</span>
                                <Badge variant="outline" className="text-xs">
                                    {themeWithDefaults.body_font || 'Inter'}
                                </Badge>
                            </span>
                        </SelectItem>
                        <SelectItem value="heading_font">
                            <span className="flex items-center gap-2">
                                <span>Heading Font</span>
                                <Badge variant="outline" className="text-xs">
                                    {themeWithDefaults.heading_font || 'Inter'}
                                </Badge>
                            </span>
                        </SelectItem>
                        <SelectItem value="subheading_font">
                            <span className="flex items-center gap-2">
                                <span>Subheading Font</span>
                                <Badge variant="outline" className="text-xs">
                                    {themeWithDefaults.subheading_font || 'Inter'}
                                </Badge>
                            </span>
                        </SelectItem>
                        <SelectItem value="accent_font">
                            <span className="flex items-center gap-2">
                                <span>Accent Font</span>
                                <Badge variant="outline" className="text-xs">
                                    {themeWithDefaults.accent_font || 'Georgia'}
                                </Badge>
                            </span>
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
                        placeholder="Ej: 'Roboto', sans-serif"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Usa el formato CSS: 'Nombre de fuente', familia
                    </p>
                </div>
            )}

            <div>
                <Label htmlFor="textTransform">
                    Transformación de texto
                    {editStyles.textStyle?.startsWith('heading') &&
                        renderThemeReference(`${editStyles.textStyle}_textTransform`, 'Valor del tema')}
                </Label>
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="color">
                        Color principal
                        {renderThemeReference('text', 'Color del tema')}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                        <ColorPicker
                            value={colorValue}
                            onChange={(hex) => handleStyleChange('color', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('color', 'theme.text')}
                        >
                            Tema
                        </Button>
                    </div>
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
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="showDiscount"
                    checked={editStyles.showDiscount !== false}
                    onCheckedChange={(checked) => handleStyleChange('showDiscount', checked)}
                />
                <Label htmlFor="showDiscount">Mostrar precio con descuento</Label>
            </div>

            {editStyles.showDiscount !== false && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="originalPriceColor">
                            Color precio original
                            {renderThemeReference('text', 'Color base')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={originalPriceColorValue}
                                onChange={(hex) => handleStyleChange('originalPriceColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('originalPriceColor', 'theme.text')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="discountPriceColor">
                            Color precio con descuento
                            {renderThemeReference('primary', 'Color primario')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={discountPriceColorValue}
                                onChange={(hex) => handleStyleChange('discountPriceColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('discountPriceColor', 'theme.primary')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-2">
                <Switch
                    id="showCurrency"
                    checked={editStyles.showCurrency !== false}
                    onCheckedChange={(checked) => handleStyleChange('showCurrency', checked)}
                />
                <Label htmlFor="showCurrency">Mostrar símbolo de moneda</Label>
            </div>

            {editStyles.showCurrency !== false && (
                <div>
                    <Label htmlFor="currencySymbol">Símbolo de moneda</Label>
                    <Input
                        id="currencySymbol"
                        value={editStyles.currencySymbol || '$'}
                        onChange={(e) => handleStyleChange('currencySymbol', e.target.value)}
                        placeholder="Ej: $, €, £"
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(ProductDetailPriceEditDialog);