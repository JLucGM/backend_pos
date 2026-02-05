import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const QuantitySelectorEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings, // Añadir themeSettings como prop

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

    // Función para restablecer a valores del tema
    const resetToThemeDefaults = () => {
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
    };

    // Función para obtener valor del tema para mostrar en tooltips
    const getThemeValue = (key) => {
        const themeMap = {
            'labelColor': themeSettings?.quantity_labelColor || themeSettings?.text_color,
            'borderColor': themeSettings?.quantity_borderColor || themeSettings?.border_color,
            'buttonColor': themeSettings?.quantity_buttonColor || themeSettings?.primary_color,
            'inputColor': themeSettings?.quantity_inputColor || themeSettings?.text_color,
            'borderRadius': themeSettings?.quantity_borderRadius || themeSettings?.border_radius,
            'buttonSize': themeSettings?.quantity_buttonSize || themeSettings?.button_font_size,
            'inputSize': themeSettings?.quantity_inputSize || themeSettings?.input_font_size,
        };

        return themeMap[key];
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
                        <Input
                            id="labelColor"
                            type="color"
                            value={editStyles.labelColor || getThemeValue('labelColor') || '#666666'}
                            onChange={(e) => handleStyleChange('labelColor', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('labelColor', getThemeValue('labelColor') || '#666666')}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="borderColor">Color del borde</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="borderColor"
                            type="color"
                            value={editStyles.borderColor || getThemeValue('borderColor') || '#d1d5db'}
                            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('borderColor', getThemeValue('borderColor') || '#d1d5db')}
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
                        <Input
                            id="buttonColor"
                            type="color"
                            value={editStyles.buttonColor || getThemeValue('buttonColor') || '#374151'}
                            onChange={(e) => handleStyleChange('buttonColor', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('buttonColor', getThemeValue('buttonColor') || '#374151')}
                        >
                            Tema
                        </Button>
                    </div>
                </div>
                <div>
                    <Label htmlFor="inputColor">Color del input</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="inputColor"
                            type="color"
                            value={editStyles.inputColor || getThemeValue('inputColor') || '#000000'}
                            onChange={(e) => handleStyleChange('inputColor', e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleStyleChange('inputColor', getThemeValue('inputColor') || '#000000')}
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
                            handleStyleChange('borderRadius', parseInt(getThemeValue('borderRadius')) || 6);
                            handleStyleChange('borderRadiusUnit', getThemeValue('borderRadius')?.toString().includes('rem') ? 'rem' : 'px');
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

export default QuantitySelectorEditDialog;