import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CheckoutPaymentEditDialog = ({
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

    const handleAddPaymentMethod = useCallback(() => {
        const newMethod = {
            id: `method_${Date.now()}`,
            name: 'Nuevo método'
        };
        setEditContent(prev => ({
            ...prev,
            paymentMethods: [...(prev?.paymentMethods || []), newMethod]
        }));
    }, [setEditContent]);

    const handleRemovePaymentMethod = useCallback((index) => {
        setEditContent(prev => {
            const updatedMethods = [...(prev?.paymentMethods || [])];
            updatedMethods.splice(index, 1);
            return { ...prev, paymentMethods: updatedMethods };
        });
    }, [setEditContent]);

    const handleMethodChange = useCallback((index, field, value) => {
        setEditContent(prev => {
            const updatedMethods = [...(prev?.paymentMethods || [])];
            updatedMethods[index] = { ...updatedMethods[index], [field]: value };
            return { ...prev, paymentMethods: updatedMethods };
        });
    }, [setEditContent]);

    const bgColor = resolveValue(editStyles?.backgroundColor) || '#ffffff';
    const buttonBgColor = resolveValue(editStyles?.buttonBackgroundColor) || '#3b82f6';
    const buttonColor = resolveValue(editStyles?.buttonColor) || '#ffffff';
    const borders = resolveValue(editStyles?.borders) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título de métodos de pago</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Método de Pago'}
                    onChange={(e) => updateContent('title', e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <div className="flex gap-2">
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

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar términos y condiciones</Label>
                    <Switch
                        checked={editContent?.showTerms !== false}
                        onCheckedChange={(checked) => updateContent('showTerms', checked)}
                    />
                </div>

                {editContent?.showTerms && (
                    <div>
                        <Label htmlFor="termsText">Texto de términos</Label>
                        <Input
                            type="text"
                            value={editContent?.termsText || 'Acepto los términos y condiciones'}
                            onChange={(e) => updateContent('termsText', e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                    type="text"
                    value={editContent?.buttonText || 'Realizar Pedido'}
                    onChange={(e) => updateContent('buttonText', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="buttonBackgroundColor">Color de fondo del botón</Label>
                <ColorPicker
                    value={buttonBgColor}
                    onChange={(hex) => updateStyle('buttonBackgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div>
                <Label htmlFor="buttonColor">Color del texto del botón</Label>
                <ColorPicker
                    value={buttonColor}
                    onChange={(hex) => updateStyle('buttonColor', hex)}
                    showOpacity={false}
                />
            </div>

            <Separator />

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
            <div className="space-y-2">
                <Label htmlFor="borderRadius">Borde redondeado</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 12}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                    placeholder="12"
                />
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






        </div>
    );
};

export default React.memo(CheckoutPaymentEditDialog);