import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Slider } from '@/Components/ui/slider';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const BentoFeatureEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    isLiveEdit = true,
    themeSettings,
    appliedTheme
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    }, [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleContentChange = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    // Valores resueltos para colores
    const bgColor = resolveValue(editContent.backgroundColor) || resolveValue(themeWithDefaults.background) || '#f8fafc';
    const borderColor = resolveValue(editContent.borderColor) || resolveValue(themeWithDefaults.borders) || '#e5e7eb';

    return (
        <div className="space-y-4">

            {/* Color de fondo */}
            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => handleContentChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            {/* Imagen de fondo */}
            <div className="space-y-2">
                <Label htmlFor="backgroundImage">Imagen de fondo (URL)</Label>
                <Input
                    id="backgroundImage"
                    type="text"
                    value={editContent.backgroundImage || ''}
                    onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            {/* Configuración del border */}
            <div className="space-y-2">
                <Label>Border</Label>
                <Select
                    value={editContent.border || 'none'}
                    onValueChange={(value) => handleContentChange('border', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de border" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin border</SelectItem>
                        <SelectItem value="solid">Border sólido</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editContent.border === 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="borderThickness">Grosor del border</Label>
                        <Input
                            id="borderThickness"
                            type="number"
                            value={parseInt(editContent.borderThickness) || 1}
                            onChange={(e) => handleContentChange('borderThickness', e.target.value)}
                            placeholder="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="borderColor">Color del border</Label>
                        <ColorPicker
                            value={borderColor}
                            onChange={(hex) => handleContentChange('borderColor', hex)}
                            showOpacity={false}
                        />
                    </div>
                </>
            )}

            {/* Border radius */}
            <div className="space-y-2">
                <Label htmlFor="borderRadius">Border radius</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editContent.borderRadius) || 12}
                    onChange={(e) => handleContentChange('borderRadius', e.target.value)}
                    placeholder="12"
                />
            </div>

            {/* Padding */}
            <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                    id="padding"
                    type="number"
                    value={parseInt(editContent.padding) || 24}
                    onChange={(e) => handleContentChange('padding', e.target.value)}
                    placeholder="24"
                />
            </div>

        </div>
    );
};

export default React.memo(BentoFeatureEditDialog);