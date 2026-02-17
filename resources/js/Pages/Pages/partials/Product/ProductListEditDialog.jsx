import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductListEditDialog = ({
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
            // cambios en vivo
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateConfig = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent?.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label>Columnas</Label>
                <Input
                    type="number"
                    value={parseInt(editContent?.columns) || 3}
                    onChange={(e) => updateConfig('columns', parseInt(e.target.value) || 1)}
                />
            </div>

            <div>
                <Label>Límite por página</Label>
                <Input
                    type="number"
                    value={parseInt(editContent?.limit) || 8}
                    onChange={(e) => updateConfig('limit', parseInt(e.target.value) || 1)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Gap X (ej. 10px)</Label>
                    <Input
                        value={resolveValue(editContent?.gapX) || '10px'}
                        onChange={(e) => updateConfig('gapX', e.target.value)}
                    />
                </div>
                <div>
                    <Label>Gap Y (ej. 10px)</Label>
                    <Input
                        value={resolveValue(editContent?.gapY) || '10px'}
                        onChange={(e) => updateConfig('gapY', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <Label>Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>
        </div>
    );
};

export default React.memo(ProductListEditDialog);