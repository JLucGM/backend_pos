import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const QuantitySelectorEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true,
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

    const resetToThemeDefaults = useCallback(() => {
        const defaultStyles = {
            labelColor: themeSettings?.quantity_labelColor || themeSettings?.text_color || '#666666',
            borderColor: themeSettings?.quantity_borderColor || themeSettings?.border_color || '#d1d5db',
            buttonColor: themeSettings?.quantity_buttonColor || themeSettings?.primary_color || '#374151',
            inputColor: themeSettings?.quantity_inputColor || themeSettings?.text_color || '#000000',
            borderRadius: themeSettings?.quantity_borderRadius || themeSettings?.border_radius || '6px',
            buttonSize: themeSettings?.quantity_buttonSize || themeSettings?.button_font_size || '16px',
            inputSize: themeSettings?.quantity_inputSize || themeSettings?.input_font_size || '16px',
        };

        setEditStyles(prev => ({
            ...prev,
            ...defaultStyles
        }));
    }, [themeSettings, setEditStyles]);

    const getThemeValue = (key) => {
        const themeMap = {
            labelColor: themeSettings?.quantity_labelColor || themeSettings?.text_color,
            borderColor: themeSettings?.quantity_borderColor || themeSettings?.border_color,
            buttonColor: themeSettings?.quantity_buttonColor || themeSettings?.primary_color,
            inputColor: themeSettings?.quantity_inputColor || themeSettings?.text_color,
            borderRadius: themeSettings?.quantity_borderRadius || themeSettings?.border_radius,
            buttonSize: themeSettings?.quantity_buttonSize || themeSettings?.button_font_size,
            inputSize: themeSettings?.quantity_inputSize || themeSettings?.input_font_size,
        };
        return themeMap[key];
    };

    const getResolvedColor = (styleKey, fallbackKey) => {
        const styleValue = editStyles[styleKey];
        if (styleValue) return resolveValue(styleValue);
        const themeRef = getThemeValue(fallbackKey);
        if (themeRef) return resolveValue(themeRef);
        const fallbackMap = {
            labelColor: '#666666',
            borderColor: '#d1d5db',
            buttonColor: '#374151',
            inputColor: '#000000',
        };
        return fallbackMap[fallbackKey] || '#000000';
    };

    // Valores resueltos para los ColorPicker
    const labelColorValue = getResolvedColor('labelColor', 'labelColor');
    const borderColorValue = getResolvedColor('borderColor', 'borderColor');
    const buttonColorValue = getResolvedColor('buttonColor', 'buttonColor');
    const inputColorValue = getResolvedColor('inputColor', 'inputColor');

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
                <Label htmlFor="label">Etiqueta del selector</Label>
                <Input
                    id="label"
                    value={editContent?.label || 'Cantidad:'}
                    onChange={(e) => handleContentChange('label', e.target.value)}
                    placeholder="Etiqueta del selector de cantidad"
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="showMax"
                    checked={editContent?.showMax || false}
                    onCheckedChange={(checked) => handleContentChange('showMax', checked)}
                />
                <Label htmlFor="showMax">Mostrar cantidad máxima disponible</Label>
            </div>

            <div>
                <Label htmlFor="gap">Espacio entre elementos (gap)</Label>
                <Input
                    id="gap"
                    type="number"
                    value={parseInt(editStyles.gap) || 0}
                    onChange={(e) => handleStyleChange('gap', e.target.value)}
                    placeholder="8"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="labelColor">Color de la etiqueta</Label>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            value={labelColorValue}
                            onChange={(hex) => handleStyleChange('labelColor', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const themeVal = getThemeValue('labelColor');
                                if (themeVal) handleStyleChange('labelColor', resolveValue(themeVal));
                            }}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="borderColor">Color del borde</Label>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            value={borderColorValue}
                            onChange={(hex) => handleStyleChange('borderColor', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const themeVal = getThemeValue('borderColor');
                                if (themeVal) handleStyleChange('borderColor', resolveValue(themeVal));
                            }}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="buttonColor">Color de botones</Label>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            value={buttonColorValue}
                            onChange={(hex) => handleStyleChange('buttonColor', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const themeVal = getThemeValue('buttonColor');
                                if (themeVal) handleStyleChange('buttonColor', resolveValue(themeVal));
                            }}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="inputColor">Color del input</Label>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            value={inputColorValue}
                            onChange={(hex) => handleStyleChange('inputColor', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const themeVal = getThemeValue('inputColor');
                                if (themeVal) handleStyleChange('inputColor', resolveValue(themeVal));
                            }}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="borderRadius">Borde redondeado</Label>
                <div className="flex gap-2">
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || ''}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                        placeholder="6"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.borderRadiusUnit || (editStyles.borderRadius?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => handleStyleChange('borderRadiusUnit', value)}
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
                            const themeVal = getThemeValue('borderRadius');
                            if (themeVal) {
                                const num = parseInt(resolveValue(themeVal)) || 6;
                                handleStyleChange('borderRadius', num.toString());
                                handleStyleChange('borderRadiusUnit', themeVal.toString().includes('rem') ? 'rem' : 'px');
                            }
                        }}
                    >
                        Tema
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="buttonSize">Tamaño botones</Label>
                    <div className="flex gap-2">
                        <Input
                            id="buttonSize"
                            type="number"
                            value={parseInt(editStyles.buttonSize) || ''}
                            onChange={(e) => handleStyleChange('buttonSize', e.target.value)}
                            placeholder="16"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.buttonSizeUnit || (editStyles.buttonSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => handleStyleChange('buttonSizeUnit', value)}
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
                    <Label htmlFor="inputSize">Tamaño input</Label>
                    <div className="flex gap-2">
                        <Input
                            id="inputSize"
                            type="number"
                            value={parseInt(editStyles.inputSize) || ''}
                            onChange={(e) => handleStyleChange('inputSize', e.target.value)}
                            placeholder="16"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.inputSizeUnit || (editStyles.inputSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => handleStyleChange('inputSizeUnit', value)}
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
            </div>
        </div>
    );
};

export default React.memo(QuantitySelectorEditDialog);