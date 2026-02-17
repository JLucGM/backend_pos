// components/BuilderPages/partials/CarouselEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CarouselEditDialog = ({
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
    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    }, [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateCarouselConfig = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div className="">
                <Label htmlFor="limit">Conteo de Productos</Label>
                <Input
                    id="limit"
                    type="number"
                    value={editContent.limit || 5}
                    onChange={(e) => updateCarouselConfig('limit', parseInt(e.target.value))}
                />
            </div>

            <div className="">
                <Label htmlFor="slidesToShow">Columnas</Label>
                <Select
                    value={editContent.slidesToShow?.toString() || '3'}
                    onValueChange={(value) => updateCarouselConfig('slidesToShow', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Producto</SelectItem>
                        <SelectItem value="2">2 Productos</SelectItem>
                        <SelectItem value="3">3 Productos</SelectItem>
                        <SelectItem value="4">4 Productos</SelectItem>
                        <SelectItem value="5">5 Productos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div className="">
                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateCarouselConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="gapX">Gap Horizontal (px)</Label>
                    <Input
                        id="gapX"
                        type="number"
                        value={parseInt(editContent.gapX) || 10}
                        onChange={(e) => updateCarouselConfig('gapX', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="gapY">Gap Vertical (px)</Label>
                    <Input
                        id="gapY"
                        type="number"
                        value={parseInt(editContent.gapY) || 10}
                        onChange={(e) => updateCarouselConfig('gapY', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(CarouselEditDialog);