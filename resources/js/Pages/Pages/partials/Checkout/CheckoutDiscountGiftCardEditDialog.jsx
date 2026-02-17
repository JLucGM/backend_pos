// components/BuilderPages/partials/Checkout/CheckoutDiscountGiftCardEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';
import { Separator } from '@/Components/ui/separator';

const CheckoutDiscountGiftCardEditDialog = ({
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

    const handleStyleChange = useCallback((property, value) => {
        setEditStyles(prev => ({ ...prev, [property]: value }));
    }, [setEditStyles]);

    const handleContentChange = useCallback((property, value) => {
        setEditContent(prev => ({ ...prev, [property]: value }));
    }, [setEditContent]);

    const bgColor = resolveValue(editStyles.backgroundColor) || '#f8fafc';
    const borders = resolveValue(editStyles.borders) || '#f8fafc';
    const titleColor = resolveValue(editStyles.titleColor) || '#374151';

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="title">Título del componente</Label>
                <Input
                    id="title"
                    value={editContent?.title || ''}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    placeholder="Ej: Cupones y Gift Cards"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <div className="flex gap-2">
                    <Input
                        id="titleSize"
                        type="number"
                        value={parseInt(editStyles.titleSize) || 16}
                        onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                        placeholder="16"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.titleSizeUnit || (editStyles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => handleStyleChange('titleSizeUnit', value)}
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

            <div className="space-y-2">
                <Label htmlFor="titleColor">Color del título</Label>
                <ColorPicker
                    value={titleColor}
                    onChange={(hex) => handleStyleChange('titleColor', hex)}
                    showOpacity={false}
                />
            </div>

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => handleStyleChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 16}
                        onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                        placeholder="16"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 16}
                        onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                        placeholder="16"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        id="paddingLeft"
                        type="number"
                        value={parseInt(editStyles.paddingLeft) || 16}
                        onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                        placeholder="16"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 16}
                        onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                        placeholder="16"
                    />
                </div>
            </div>

            <Separator />
            <div className="space-y-2">
                <Label htmlFor="borders">Color de border</Label>
                <ColorPicker
                    value={borders}
                    onChange={(hex) => handleStyleChange('borders', hex)}
                    showOpacity={false}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="borderWidth">Ancho de borde</Label>
                <Input
                    id="borderWidth"
                    type="number"
                    value={parseInt(editStyles.borderWidth) || 1}
                    onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                    placeholder="8"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="borderRadius">Radio de borde</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 8}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    placeholder="8"
                />
            </div>




        </div>
    );
};

export default React.memo(CheckoutDiscountGiftCardEditDialog);