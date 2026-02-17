import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CartItemsEditDialog = ({
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

    const updateContent = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const bgColor = resolveValue(editStyles?.backgroundColor) || '#ffffff';
    const rowBackground = resolveValue(editStyles?.background) ;
    const borderColor = resolveValue(editStyles?.borderColor) || '#e5e7eb';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título de la sección</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Tu carrito'}
                    onChange={(e) => updateContent('title', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="emptyMessage">Mensaje cuando está vacío</Label>
                <Input
                    type="text"
                    value={editContent?.emptyMessage || 'Tu carrito está vacío'}
                    onChange={(e) => updateContent('emptyMessage', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar imagen del producto</Label>
                    <Switch
                        checked={editContent?.showImage !== false}
                        onCheckedChange={(checked) => updateContent('showImage', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar combinación seleccionada</Label>
                    <Switch
                        checked={editContent?.showCombination !== false}
                        onCheckedChange={(checked) => updateContent('showCombination', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar stock disponible</Label>
                    <Switch
                        checked={editContent?.showStock === true}
                        onCheckedChange={(checked) => updateContent('showStock', checked)}
                    />
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
            <div>
                <Label htmlFor="rowBackground">Color de fondo</Label>
                <ColorPicker
                    value={rowBackground}
                    onChange={(hex) => updateStyle('rowBackground', hex)}
                    showOpacity={false}
                />
            </div>
            
            <div>
                <Label htmlFor="imageSize">Tamaño de imagen</Label>
                <div className="flex gap-2">
                    <Input
                        id="imageSize"
                        type="number"
                        value={parseInt(editStyles?.imageSize) || 80}
                        onChange={(e) => updateStyle('imageSize', e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.imageSizeUnit || (editStyles.imageSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => updateStyle('imageSizeUnit', value)}
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 20}
                        onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 20}
                        onChange={(e) => updateStyle('paddingBottom', e.target.value)}
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
                        onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 20}
                        onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        placeholder="20"
                    />
                </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || 0}
                        onChange={(e) => updateStyle('borderRadius', e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div>
                    <Label htmlFor="borderWidth">Grosor del borde</Label>
                    <Input
                        id="borderWidth"
                        type="number"
                        value={parseInt(editStyles.borderWidth) || 0}
                        onChange={(e) => updateStyle('borderWidth', e.target.value)}
                        placeholder="0"
                    />
                </div>
                {parseInt(editStyles.borderWidth) > 0 && (
                    <div className="col-span-2">
                        <Label htmlFor="borderColor">Color del borde</Label>
                        <ColorPicker
                            value={borderColor}
                            onChange={(hex) => updateStyle('borderColor', hex)}
                            showOpacity={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(CartItemsEditDialog);