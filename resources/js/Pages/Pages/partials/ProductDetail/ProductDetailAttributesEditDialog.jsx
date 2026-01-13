import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw, Info } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductDetailAttributesEditDialog = ({
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

    const handleContentChange = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para mostrar valor del tema
    const renderThemeReference = (themeKey, label) => {
        const themeValue = themeSettings?.[themeKey];
        if (!themeValue) return null;

        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Info size={12} />
                <span>{label} del tema: </span>
                <Badge variant="outline" className="text-xs">
                    {themeKey === 'heading' && themeValue ? `hsl(${themeValue})` : themeValue}
                </Badge>
            </div>
        );
    };

    // Función para restablecer a valores por defecto del tema
    const resetToThemeDefaults = () => {
        const textStyle = editStyles.titleTextStyle || 'heading3';
        const theme = themeSettings || {};

        let defaultTitleStyles = {};
        let defaultLabelStyles = {};
        let defaultButtonStyles = {};

        // Estilos del título según el estilo seleccionado
        if (textStyle === 'paragraph') {
            defaultTitleStyles = {
                titleSize: theme.paragraph_fontSize || theme.paragraph_size || '16px',
                titleFontWeight: theme.paragraph_fontWeight || 'normal',
                titleColor: theme.text || '#000000',
            };
        } else if (textStyle.startsWith('heading')) {
            const level = textStyle.replace('heading', '');
            defaultTitleStyles = {
                titleSize: theme[`heading${level}_fontSize`] || theme[`heading${level}_size`] || `${3.5 - (level * 0.25)}rem`,
                titleFontWeight: theme[`heading${level}_fontWeight`] || 'bold',
                titleColor: theme.heading || '#000000',
            };
        }

        // Estilos de etiquetas
        defaultLabelStyles = {
            labelColor: theme.text || '#666666',
            labelSize: theme.paragraph_fontSize || '14px',
            labelFontWeight: theme.paragraph_fontWeight || 'normal',
        };

        // Estilos de botones
        defaultButtonStyles = {
            selectedBgColor: theme.primary_button_background ? `hsl(${theme.primary_button_background})` : '#dbeafe',
            selectedTextColor: theme.primary_button_text ? `hsl(${theme.primary_button_text})` : '#1e40af',
            buttonBorderRadius: theme.button_border_radius || theme.border_radius || '6px',
        };

        setEditStyles(prev => ({
            ...prev,
            ...defaultTitleStyles,
            ...defaultLabelStyles,
            ...defaultButtonStyles,
            titleFontType: 'default',
            titleCustomFont: '',
        }));
    };

    return (
        <div className="space-y-4">
            {/* Botón para restablecer a valores del tema */}
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

            {/* Título del selector */}
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

                {/* Estilo de Texto - Opciones predefinidas */}
                <div>
                    <Label htmlFor="titleTextStyle">Estilo de Texto del Título</Label>
                    <Select
                        value={editStyles.titleTextStyle || 'heading3'}
                        onValueChange={(value) => {
                            handleStyleChange('titleTextStyle', value);

                            // Si se selecciona un estilo predefinido, actualizar los valores automáticamente
                            if (value === 'paragraph' && themeSettings) {
                                handleStyleChange('titleSize', themeSettings.paragraph_fontSize || '16px');
                                handleStyleChange('titleFontWeight', themeSettings.paragraph_fontWeight || 'normal');
                                handleStyleChange('titleFontType', 'default');
                            } else if (value.startsWith('heading') && themeSettings) {
                                const level = value.replace('heading', '');
                                handleStyleChange('titleSize', themeSettings[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`);
                                handleStyleChange('titleFontWeight', themeSettings[`heading${level}_fontWeight`] || 'bold');
                                handleStyleChange('titleFontType', 'default');
                            }
                        }}
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

                {/* Controles de tipografía avanzada solo si es custom */}
                {editStyles.titleTextStyle === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="titleSize">Tamaño del título</Label>
                            <Input
                                id="titleSize"
                                value={editStyles.titleSize || '18px'}
                                onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                                placeholder="Ej: 18px"
                            />
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

                {/* Tipo de fuente para título */}
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
                                        {themeSettings?.heading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="body_font">
                                <span className="flex items-center gap-2">
                                    <span>Body Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeSettings?.body_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="heading_font">
                                <span className="flex items-center gap-2">
                                    <span>Heading Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeSettings?.heading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="subheading_font">
                                <span className="flex items-center gap-2">
                                    <span>Subheading Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeSettings?.subheading_font || 'Inter'}
                                    </Badge>
                                </span>
                            </SelectItem>
                            <SelectItem value="accent_font">
                                <span className="flex items-center gap-2">
                                    <span>Accent Font</span>
                                    <Badge variant="outline" className="text-xs">
                                        {themeSettings?.accent_font || 'Georgia'}
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
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="titleColor"
                                type="color"
                                value={editStyles.titleColor || (themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000')}
                                onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                                className="flex-1"
                            />
                            <div
                                className="w-10 h-10 rounded border"
                                style={{
                                    backgroundColor: editStyles.titleColor || (themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000')
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('titleColor', themeSettings?.heading ? `hsl(${themeSettings.heading})` : '#000000')}
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
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="labelColor"
                                type="color"
                                value={editStyles.labelColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666')}
                                onChange={(e) => handleStyleChange('labelColor', e.target.value)}
                                className="flex-1"
                            />
                            <div
                                className="w-10 h-10 rounded border"
                                style={{
                                    backgroundColor: editStyles.labelColor || (themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666')
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('labelColor', themeSettings?.text ? `hsl(${themeSettings.text})` : '#666666')}
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
                                value={editStyles.labelSize || '14px'}
                                onChange={(e) => handleStyleChange('labelSize', e.target.value)}
                                placeholder="Ej: 14px"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('labelSize', themeSettings?.paragraph_fontSize || '14px')}
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
                            onClick={() => handleStyleChange('labelFontWeight', themeSettings?.paragraph_fontWeight || 'normal')}
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
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="selectedBgColor"
                                type="color"
                                value={editStyles.selectedBgColor || (themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#dbeafe')}
                                onChange={(e) => handleStyleChange('selectedBgColor', e.target.value)}
                                className="flex-1"
                            />
                            <div
                                className="w-10 h-10 rounded border"
                                style={{
                                    backgroundColor: editStyles.selectedBgColor || (themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#dbeafe')
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('selectedBgColor', themeSettings?.primary_button_background ? `hsl(${themeSettings.primary_button_background})` : '#dbeafe')}
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
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="selectedTextColor"
                                type="color"
                                value={editStyles.selectedTextColor || (themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#1e40af')}
                                onChange={(e) => handleStyleChange('selectedTextColor', e.target.value)}
                                className="flex-1"
                            />
                            <div
                                className="w-10 h-10 rounded border"
                                style={{
                                    backgroundColor: editStyles.selectedTextColor || (themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#1e40af')
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('selectedTextColor', themeSettings?.primary_button_text ? `hsl(${themeSettings.primary_button_text})` : '#1e40af')}
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
                            value={editStyles.buttonBorderRadius || (themeSettings?.border_radius || '6px')}
                            onChange={(e) => handleStyleChange('buttonBorderRadius', e.target.value)}
                            placeholder="Ej: 6px"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('buttonBorderRadius', themeSettings?.border_radius || '6px')}
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
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="buttonBgColor"
                                    type="color"
                                    value={editStyles.buttonBgColor || (themeSettings?.secondary_button_background ? `hsl(${themeSettings.secondary_button_background})` : '#ffffff')}
                                    onChange={(e) => handleStyleChange('buttonBgColor', e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStyleChange('buttonBgColor', themeSettings?.secondary_button_background ? `hsl(${themeSettings.secondary_button_background})` : '#ffffff')}
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
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="buttonColor"
                                    type="color"
                                    value={editStyles.buttonColor || (themeSettings?.secondary_button_text ? `hsl(${themeSettings.secondary_button_text})` : '#374151')}
                                    onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStyleChange('buttonColor', themeSettings?.secondary_button_text ? `hsl(${themeSettings.secondary_button_text})` : '#374151')}
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
                        <div className="flex gap-2 mt-1">
                            <Input
                                id="buttonBorderColor"
                                type="color"
                                value={editStyles.buttonBorderColor || (themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#d1d5db')}
                                onChange={(e) => handleStyleChange('buttonBorderColor', e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleStyleChange('buttonBorderColor', themeSettings?.borders ? `hsl(${themeSettings.borders})` : '#d1d5db')}
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

export default ProductDetailAttributesEditDialog;