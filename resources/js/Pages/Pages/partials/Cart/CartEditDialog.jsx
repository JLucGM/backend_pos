import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CartEditDialog = ({
    editContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true
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

    const handleStyleChange = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const bgColor = resolveValue(editStyles.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="layoutType">Tipo de Layout</Label>
                <Select
                    value={editStyles.layoutType || 'grid'}
                    onValueChange={(value) => handleStyleChange('layoutType', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="grid">Grid (2 columnas)</SelectItem>
                        <SelectItem value="stack">Stack (1 columna)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 20}
                        onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 20}
                        onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                        placeholder="20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingLeft) || 20}
                        onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 20}
                        onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                        placeholder="20"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="gap">Espacio entre elementos</Label>
                <Input
                    type="number"
                    value={parseInt(editStyles.gap) || 40}
                    onChange={(e) => handleStyleChange('gap', e.target.value)}
                    placeholder="40"
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => handleStyleChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>
        </div>
    );
};

export default React.memo(CartEditDialog);