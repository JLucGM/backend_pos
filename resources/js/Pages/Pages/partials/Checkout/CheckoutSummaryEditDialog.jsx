import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CheckoutSummaryEditDialog = ({
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

    const updateContent = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const bgColor = resolveValue(editStyles?.backgroundColor) || '#f9fafb';
    const borders = resolveValue(editStyles?.borders) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título del resumen</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Resumen del Pedido'}
                    onChange={(e) => updateContent('title', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar subtotal</Label>
                    <Switch
                        checked={editContent?.showSubtotal !== false}
                        onCheckedChange={(checked) => updateContent('showSubtotal', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar costo de envío</Label>
                    <Switch
                        checked={editContent?.showShipping !== false}
                        onCheckedChange={(checked) => updateContent('showShipping', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar impuestos</Label>
                    <Switch
                        checked={editContent?.showTax !== false}
                        onCheckedChange={(checked) => updateContent('showTax', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar descuentos</Label>
                    <Switch
                        checked={editContent?.showDiscount !== false}
                        onCheckedChange={(checked) => updateContent('showDiscount', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar total del pedido</Label>
                    <Switch
                        checked={editContent?.showOrderTotal !== false}
                        onCheckedChange={(checked) => updateContent('showOrderTotal', checked)}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="shippingText">Texto para envío</Label>
                <Input
                    type="text"
                    value={editContent?.shippingText || 'Envío'}
                    onChange={(e) => updateContent('shippingText', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="taxText">Texto para impuestos</Label>
                <Input
                    type="text"
                    value={editContent?.taxText || 'Impuestos'}
                    onChange={(e) => updateContent('taxText', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="totalText">Texto para total</Label>
                <Input
                    type="text"
                    value={editContent?.totalText || 'Total'}
                    onChange={(e) => updateContent('totalText', e.target.value)}
                />
            </div>

            <div>
                <div className="flex gap-2">
                <Label htmlFor="titleSize">Tamaño del título</Label>
                    <Input
                        id="titleSize"
                        type="number"
                        value={parseInt(editStyles.titleSize) || 20}
                        onChange={(e) => updateStyle('titleSize', e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.titleSizeUnit || (editStyles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => updateStyle('titleSizeUnit', value)}
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
                <Label htmlFor="totalFontSize">Tamaño de fuente total</Label>
                <div className="flex gap-2">
                    <Input
                        id="totalFontSize"
                        type="number"
                        value={parseInt(editStyles.totalFontSize) || 24}
                        onChange={(e) => updateStyle('totalFontSize', e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.totalFontSizeUnit || (editStyles.totalFontSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => updateStyle('totalFontSizeUnit', value)}
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

            <Separator className="my-4" />

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateStyle('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 24}
                        onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        placeholder="24"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 24}
                        onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        placeholder="24"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        id="paddingLeft"
                        type="number"
                        value={parseInt(editStyles.paddingLeft) || 24}
                        onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        placeholder="24"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 24}
                        onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        placeholder="24"
                    />
                </div>
            </div>

<div>
                <Label htmlFor="borders">Color del border</Label>
                <ColorPicker
                    value={borders}
                    onChange={(hex) => updateStyle('borders', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="borderWidth">Ancho de borde</Label>
                <Input
                    id="borderWidth"
                    type="number"
                    value={parseInt(editStyles.borderWidth) || 1}
                    onChange={(e) => updateStyle('borderWidth', e.target.value)}
                    placeholder="8"
                />
            </div>

            <div>
                <Label htmlFor="borderRadius">Borde redondeado</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 12}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                    placeholder="12"
                />
            </div>

            
        </div>
    );
};

export default React.memo(CheckoutSummaryEditDialog);