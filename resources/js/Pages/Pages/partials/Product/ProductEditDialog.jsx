// components/BuilderPages/partials/ProductEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductEditDialog = ({
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

    const updateProductConfig = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="columns">Columnas</Label>
                <Select
                    value={editContent.columns?.toString() || '3'}
                    onValueChange={(value) => updateProductConfig('columns', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Columna</SelectItem>
                        <SelectItem value="2">2 Columnas</SelectItem>
                        <SelectItem value="3">3 Columnas</SelectItem>
                        <SelectItem value="4">4 Columnas</SelectItem>
                        <SelectItem value="5">5 Columnas</SelectItem>
                        <SelectItem value="6">6 Columnas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="limit">Límite de Productos</Label>
                <Input
                    id="limit"
                    type="number"
                    value={editContent.limit || 8}
                    onChange={(e) => updateProductConfig('limit', parseInt(e.target.value))}
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateProductConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="gapX">Gap Horizontal (px)</Label>
                    <Input
                        id="gapX"
                        type="number"
                        value={parseInt(editContent.carousel_gapX) || 10}
                        onChange={(e) => updateProductConfig('gapX', `${e.target.value}px`)}
                    />
                </div>
                <div>
                    <Label htmlFor="gapY">Gap Vertical (px)</Label>
                    <Input
                        id="gapY"
                        type="number"
                        value={parseInt(editContent.gapY) || 10}
                        onChange={(e) => updateProductConfig('gapY', `${e.target.value}px`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductEditDialog);