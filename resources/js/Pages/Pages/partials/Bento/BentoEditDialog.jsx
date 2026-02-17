import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const BentoEditDialog = ({
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

    const bgColor = resolveValue(editContent.backgroundColor) || resolveValue(themeWithDefaults.background) || '#ffffff';
    const borderColor = resolveValue(editContent.containerBorderColor) || resolveValue(themeWithDefaults.borders) || '#e5e7eb';

    return (
        <div className="space-y-4">

            <div className="space-y-2">
                <Label htmlFor="gridColumns">Columnas del grid</Label>
                <Select
                    value={editContent.gridColumns?.toString() || '2'}
                    onValueChange={(value) => handleContentChange('gridColumns', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona columnas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 columna</SelectItem>
                        <SelectItem value="2">2 columnas</SelectItem>
                        <SelectItem value="3">3 columnas</SelectItem>
                        <SelectItem value="4">4 columnas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="gridGap">Espaciado entre características</Label>
                <Input
                    id="gridGap"
                    type="number"
                    value={parseInt(editContent.gridGap) || 20}
                    onChange={(e) => handleContentChange('gridGap', e.target.value)}
                    placeholder="20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo del contenedor</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => handleContentChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="containerBorderRadius">Border radius del contenedor</Label>
                <Input
                    id="containerBorderRadius"
                    type="number"
                    value={parseInt(editContent.containerBorderRadius) || 0}
                    onChange={(e) => handleContentChange('containerBorderRadius', e.target.value)}
                    placeholder="0"
                />
            </div>

            <div className="space-y-2">
                <Label>Border del contenedor</Label>
                <Select
                    value={editContent.containerBorder || 'none'}
                    onValueChange={(value) => handleContentChange('containerBorder', value)}
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

            {editContent.containerBorder === 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="containerBorderThickness">Grosor del border</Label>
                        <Input
                            id="containerBorderThickness"
                            type="number"
                            value={parseInt(editContent.containerBorderThickness) || 1}
                            onChange={(e) => handleContentChange('containerBorderThickness', e.target.value)}
                            placeholder="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="containerBorderColor">Color del border</Label>
                        <ColorPicker
                            value={borderColor}
                            onChange={(hex) => handleContentChange('containerBorderColor', hex)}
                            showOpacity={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(BentoEditDialog);