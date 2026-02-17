import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw, Info } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductDetailAttributesEditDialog = ({
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

    const handleContentChange = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const renderThemeReference = (themeKey, label) => {
        const rawThemeValue = themeWithDefaults?.[themeKey];
        if (!rawThemeValue) return null;
        const resolved = resolveValue(rawThemeValue);
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
        const textStyle = editStyles.titleTextStyle || 'heading3';

        let defaultTitleStyles = {};
        let defaultLabelStyles = {};
        let defaultButtonStyles = {};

        if (textStyle === 'paragraph') {
            defaultTitleStyles = {
                titleSize: themeWithDefaults.paragraph_fontSize || '16px',
                titleFontWeight: themeWithDefaults.paragraph_fontWeight || 'normal',
                titleColor: themeWithDefaults.text || '#000000',
            };
        } else if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            defaultTitleStyles = {
                titleSize: themeWithDefaults[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`,
                titleFontWeight: themeWithDefaults[`heading${level}_fontWeight`] || 'bold',
                titleColor: themeWithDefaults.heading || '#000000',
            };
        }

        defaultLabelStyles = {
            labelColor: themeWithDefaults.text || '#666666',
            labelSize: themeWithDefaults.paragraph_fontSize || '14px',
            labelFontWeight: themeWithDefaults.paragraph_fontWeight || 'normal',
        };

        defaultButtonStyles = {
            selectedBgColor: themeWithDefaults.primary_button_background || '#dbeafe',
            selectedTextColor: themeWithDefaults.primary_button_text || '#1e40af',
            buttonBorderRadius: themeWithDefaults.border_radius || '6px',
        };

        setEditStyles(prev => ({
            ...prev,
            ...defaultTitleStyles,
            ...defaultLabelStyles,
            ...defaultButtonStyles,
            titleFontType: 'default',
            titleCustomFont: '',
        }));
    }, [editStyles.titleTextStyle, themeWithDefaults, setEditStyles]);

    // Valores resueltos para colores
    const titleColor = resolveValue(editStyles.titleColor) || resolveValue(themeWithDefaults.heading) || '#000000';
    const labelColor = resolveValue(editStyles.labelColor) || resolveValue(themeWithDefaults.text) || '#666666';
    const selectedBgColor = resolveValue(editStyles.selectedBgColor) || resolveValue(themeWithDefaults.primary_button_background) || '#dbeafe';
    const selectedTextColor = resolveValue(editStyles.selectedTextColor) || resolveValue(themeWithDefaults.primary_button_text) || '#1e40af';
    const buttonBgColor = resolveValue(editStyles.buttonBgColor) || resolveValue(themeWithDefaults.secondary_button_background) || '#ffffff';
    const buttonColor = resolveValue(editStyles.buttonColor) || resolveValue(themeWithDefaults.secondary_button_text) || '#374151';
    const buttonBorderColor = resolveValue(editStyles.buttonBorderColor) || resolveValue(themeWithDefaults.borders) || '#d1d5db';

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
                <Label htmlFor="title">Título del selector</Label>
                <Input
                    id="title"
                    value={editContent?.title || 'Opciones del Producto'}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    placeholder="Título del selector de atributos"
                />
            </div>

            <Separator className="my-4" />

            {/* Estilo del Título */}
            <div className="space-y-4">
                <h4 className="font-medium">Estilo del Título</h4>

                <div>
                    <Label htmlFor="titleTextStyle">Estilo de Texto del Título</Label>
                    <Select
                        value={editStyles.titleTextStyle || 'heading3'}
                        onValueChange={(value) => {
                            handleStyleChange('titleTextStyle', value);

                            if (value === 'paragraph' && themeWithDefaults) {
                                handleStyleChange('titleSize', themeWithDefaults.paragraph_fontSize || '16px');
                                handleStyleChange('titleFontWeight', themeWithDefaults.paragraph_fontWeight || 'normal');
                                handleStyleChange('titleFontType', 'default');
                            } else if (value.startsWith('heading') && themeWithDefaults) {
                                const level = value.replace('heading', '');
                                handleStyleChange('titleSize', themeWithDefaults[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`);
                                handleStyleChange('titleFontWeight', themeWithDefaults[`heading${level}_fontWeight`] || 'bold');
                                handleStyleChange('titleFontType', 'default');
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="heading1">Heading 1 - {themeWithDefaults?.heading1_fontSize || '2.5rem'}</SelectItem>
                            <SelectItem value="heading2">Heading 2 - {themeWithDefaults?.heading2_fontSize || '2rem'}</SelectItem>
                            <SelectItem value="heading3">Heading 3 - {themeWithDefaults?.heading3_fontSize || '1.75rem'}</SelectItem>
                            <SelectItem value="heading4">Heading 4 - {themeWithDefaults?.heading4_fontSize || '1.5rem'}</SelectItem>
                            <SelectItem value="heading5">Heading 5 - {themeWithDefaults?.heading5_fontSize || '1.25rem'}</SelectItem>
                            <SelectItem value="heading6">Heading 6 - {themeWithDefaults?.heading6_fontSize || '1rem'}</SelectItem>
                            <SelectItem value="paragraph">Párrafo - {themeWithDefaults?.paragraph_fontSize || '16px'}</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.titleTextStyle === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="titleSize">Tamaño del título</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="titleSize"
                                    type="number"
                                    value={parseInt(editStyles.titleSize) || ''}
                                    onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                                    placeholder="18"
                                    className="flex-1"
                                />
                                <Select
                                    value={editStyles.titleSizeUnit || (editStyles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                                    onValueChange={(value) => handleStyleChange('titleSizeUnit', value)}
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
                            <Label htmlFor="titleFontWeight">Peso del título</Label>
                            <Select
                                value={editStyles.titleFontWeight || 'bold'}
                                onValueChange={(value) => handleStyleChange('titleFontWeight', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medio</SelectItem>
                                    <SelectItem value="semibold">Seminegrita</SelectItem>
                                    <SelectItem value="bold">Negrita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <div>
                    <Label htmlFor="titleFontType">Tipo de Fuente del Título</Label>
                    <Select
                        value={editStyles.titleFontType || 'default'}
                        onValueChange={(value) => handleStyleChange('titleFontType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">
                                <span className="flex items-center gap-2">
                                    <span>Por defecto</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeWithDefaults?.heading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="body_font">
                                <span className="flex items-center gap-2">
                                    <span>Body Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeWithDefaults?.body_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="heading_font">
                                <span className="flex items-center gap-2">
                                    <span>Heading Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeWithDefaults?.heading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="subheading_font">
                                <span className="flex items-center gap-2">
                                    <span>Subheading Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeWithDefaults?.subheading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="accent_font">
                                <span className="flex items-center gap-2">
                                    <span>Accent Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeWithDefaults?.accent_font || 'Georgia'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.titleFontType === 'custom' && (
                    <div>
                        <Label htmlFor="titleCustomFont">Fuente Personalizada del Título</Label>
                        <Input
                            id="titleCustomFont"
                            value={editStyles.titleCustomFont || ''}
                            onChange={(e) => handleStyleChange('titleCustomFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="titleColor">
                            Color del título
                            {renderThemeReference('heading', 'Color del tema')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={titleColor}
                                onChange={(hex) => handleStyleChange('titleColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('titleColor', themeWithDefaults.heading || '#000000')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Estilo de las Etiquetas */}
            <div className="space-y-4">
                <h4 className="font-medium">Estilo de las Etiquetas</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="labelColor">
                            Color de las etiquetas
                            {renderThemeReference('text', 'Color del tema')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={labelColor}
                                onChange={(hex) => handleStyleChange('labelColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('labelColor', themeWithDefaults.text || '#666666')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="labelSize">Tamaño de etiquetas</Label>
                        <div className="flex gap-2">
                            <Input
                                id="labelSize"
                                type="number"
                                value={parseInt(editStyles.labelSize) || ''}
                                onChange={(e) => handleStyleChange('labelSize', e.target.value)}
                                placeholder="14"
                                className="flex-1"
                            />
                            <Select
                                value={editStyles.labelSizeUnit || (editStyles.labelSize?.toString().includes('rem') ? 'rem' : 'px')}
                                onValueChange={(value) => handleStyleChange('labelSizeUnit', value)}
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
                                    const themeVal = themeWithDefaults?.paragraph_fontSize || '14px';
                                    handleStyleChange('labelSize', parseInt(themeVal) || 14);
                                    handleStyleChange('labelSizeUnit', themeVal.toString().includes('rem') ? 'rem' : 'px');
                                }}
                                className="whitespace-nowrap"
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="labelFontWeight">Peso de fuente de etiquetas</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.labelFontWeight || 'normal'}
                            onValueChange={(value) => handleStyleChange('labelFontWeight', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="medium">Medio</SelectItem>
                                <SelectItem value="semibold">Seminegrita</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('labelFontWeight', themeWithDefaults?.paragraph_fontWeight || 'normal')}
                            className="whitespace-nowrap"
                        >
                            Tema
                        </Button>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Estilo de los Botones */}
            <div className="space-y-4">
                <h4 className="font-medium">Estilo de los Botones</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="selectedBgColor">
                            Fondo seleccionado
                            {renderThemeReference('primary_button_background', 'Color del tema')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={selectedBgColor}
                                onChange={(hex) => handleStyleChange('selectedBgColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('selectedBgColor', themeWithDefaults.primary_button_background || '#dbeafe')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="selectedTextColor">
                            Texto seleccionado
                            {renderThemeReference('primary_button_text', 'Color del tema')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={selectedTextColor}
                                onChange={(hex) => handleStyleChange('selectedTextColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('selectedTextColor', themeWithDefaults.primary_button_text || '#1e40af')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="buttonBorderRadius">
                        Borde redondeado botones
                        {renderThemeReference('border_radius', 'Valor del tema')}
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="buttonBorderRadius"
                            type="number"
                            value={parseInt(editStyles.buttonBorderRadius) || 0}
                            onChange={(e) => handleStyleChange('buttonBorderRadius', e.target.value)}
                            placeholder="6"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('buttonBorderRadius', parseInt(themeWithDefaults?.border_radius) || 6)}
                            className="whitespace-nowrap"
                        >
                            Tema
                        </Button>
                    </div>
                </div>

                {/* Estilos de borde para botones no seleccionados */}
                <div className="space-y-4">
                    <h5 className="text-sm font-medium">Estilo de botones no seleccionados</h5>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="buttonBgColor">
                                Color de fondo
                                {renderThemeReference('secondary_button_background', 'Color del tema')}
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                                <ColorPicker
                                    value={buttonBgColor}
                                    onChange={(hex) => handleStyleChange('buttonBgColor', hex)}
                                    showOpacity={false}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStyleChange('buttonBgColor', themeWithDefaults.secondary_button_background || '#ffffff')}
                                >
                                    Tema
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="buttonColor">
                                Color de texto
                                {renderThemeReference('secondary_button_text', 'Color del tema')}
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                                <ColorPicker
                                    value={buttonColor}
                                    onChange={(hex) => handleStyleChange('buttonColor', hex)}
                                    showOpacity={false}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStyleChange('buttonColor', themeWithDefaults.secondary_button_text || '#374151')}
                                >
                                    Tema
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="buttonBorderColor">
                            Color del borde
                            {renderThemeReference('borders', 'Color del tema')}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <ColorPicker
                                value={buttonBorderColor}
                                onChange={(hex) => handleStyleChange('buttonBorderColor', hex)}
                                showOpacity={false}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('buttonBorderColor', themeWithDefaults.borders || '#d1d5db')}
                            >
                                Tema
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductDetailAttributesEditDialog);