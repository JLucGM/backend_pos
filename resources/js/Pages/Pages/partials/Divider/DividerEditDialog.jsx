import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const DividerEditDialog = ({
    editStyles,
    setEditStyles,
    editContent,
    setEditContent,
    themeSettings,
    appliedTheme,
    isLiveEdit
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

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditStyles]);

    const lineColor = resolveValue(editStyles.lineColor) || '#000000';

    return (
        <div className="space-y-4">
            {/* Grosor de la línea */}
            <div>
                <Label htmlFor="divider-lineWidth">Grosor de la línea</Label>
                <Input
                    id="divider-lineWidth"
                    type="number"
                    value={parseInt(editStyles.lineWidth) || 1}
                    onChange={(e) => updateStyle('lineWidth', e.target.value)}
                    placeholder="1"
                />
            </div>

            {/* Largo de la línea */}
            <div>
                <Label htmlFor="divider-lineLength">Largo de la línea</Label>
                <div className="flex gap-2">
                    <Input
                        id="divider-lineLength"
                        type="number"
                        value={parseInt(editStyles.lineLength) || 100}
                        onChange={(e) => updateStyle('lineLength', e.target.value)}
                        placeholder="100"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.lineLengthUnit || (editStyles.lineLength?.toString().includes('px') ? 'px' : '%')}
                        onValueChange={(value) => updateStyle('lineLengthUnit', value)}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                            <SelectItem value="%">%</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Color de la línea */}
            <div>
                <Label htmlFor="divider-lineColor">Color de la línea</Label>
                <ColorPicker
                    value={lineColor}
                    onChange={(hex) => updateStyle('lineColor', hex)}
                    showOpacity={false}
                />
            </div>

            {/* Padding Top */}
            <div>
                <Label htmlFor="divider-paddingTop">Padding Superior</Label>
                <Input
                    id="divider-paddingTop"
                    type="number"
                    value={parseInt(editStyles.paddingTop) || 20}
                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                    placeholder="20"
                />
            </div>

            <div>
                <Label htmlFor="divider-paddingBottom">Padding Inferior</Label>
                <Input
                    id="divider-paddingBottom"
                    type="number"
                    value={parseInt(editStyles.paddingBottom) || 20}
                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                    placeholder="20"
                />
            </div>
        </div>
    );
};

export default React.memo(DividerEditDialog);