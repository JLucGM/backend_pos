// pages/Pages/partials/Success/SuccessEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';
import { Separator } from '@/Components/ui/separator';

const SuccessEditDialog = ({
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

    // Valores resueltos para colores
    const bgColor = resolveValue(editStyles.backgroundColor) || resolveValue(themeWithDefaults.background) || '#ffffff';
    const titleColor = resolveValue(editContent.titleColor) || resolveValue(themeWithDefaults.heading) || '#000000';
    const subtitleColor = resolveValue(editContent.subtitleColor) || resolveValue(themeWithDefaults.text) || '#666666';
    const messageBgColor = resolveValue(editContent.messageBackgroundColor) || resolveValue(themeWithDefaults.background) || '#f3f4f6';
    const messageTextColor = resolveValue(editContent.messageTextColor) || resolveValue(themeWithDefaults.text) || '#374151';
    const iconColor = resolveValue(editContent.iconColor) || '#10b981';
    const continueButtonBg = resolveValue(editContent.continueButtonBg) || '#ffffff';
    const continueButtonColor = resolveValue(editContent.continueButtonColor) || '#000000';
    const continueButtonBorder = resolveValue(editContent.continueButtonBorder) || '#d1d5db';
    const ordersButtonBg = resolveValue(editContent.ordersButtonBg) || resolveValue(themeWithDefaults.primary_button_background) || '#3b82f6';
    const ordersButtonColor = resolveValue(editContent.ordersButtonColor) || resolveValue(themeWithDefaults.primary_button_text) || '#ffffff';

    return (
        <>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <ColorPicker
                        value={bgColor}
                        onChange={(hex) => updateStyle('backgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingTop">Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 40}
                        onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        placeholder="40"
                    />
                </div>

                <div>
                    <Label htmlFor="paddingRight">Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 20}
                        onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        placeholder="20"
                    />
                </div>

                <div>
                    <Label htmlFor="paddingBottom">Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 40}
                        onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        placeholder="40"
                    />
                </div>

                <div>
                    <Label htmlFor="paddingLeft">Izquierdo</Label>
                    <Input
                        id="paddingLeft"
                        type="number"
                        value={parseInt(editStyles.paddingLeft) || 20}
                        onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        placeholder="20"
                    />
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="title">Título Principal</Label>
                    <Input
                        id="title"
                        value={editContent.title || '¡Orden Exitosa!'}
                        onChange={(e) => updateContent('title', e.target.value)}
                        placeholder="¡Orden Exitosa!"
                    />
                </div>
                <div>
                    <Label htmlFor="titleSize">Tamaño del Título</Label>
                    <div className="flex gap-2">
                        <Input
                            id="titleSize"
                            type="number"
                            value={parseInt(editContent.titleSize) || 32}
                            onChange={(e) => updateContent('titleSize', e.target.value)}
                            placeholder="32"
                            className="flex-1"
                        />
                        <Select
                            value={editContent.titleSizeUnit || (editContent.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => updateContent('titleSizeUnit', value)}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="titleColor">Color del Título</Label>
                    <ColorPicker
                        value={titleColor}
                        onChange={(hex) => updateContent('titleColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <Separator />

                <div>
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input
                        id="subtitle"
                        value={editContent.subtitle || 'Tu orden ha sido procesada correctamente'}
                        onChange={(e) => updateContent('subtitle', e.target.value)}
                        placeholder="Tu orden ha sido procesada correctamente"
                    />
                </div>

                <div>
                    <Label htmlFor="subtitleSize">Tamaño del Subtítulo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="subtitleSize"
                            type="number"
                            value={parseInt(editContent.subtitleSize) || 18}
                            onChange={(e) => updateContent('subtitleSize', e.target.value)}
                            placeholder="18"
                            className="flex-1"
                        />
                        <Select
                            value={editContent.subtitleSizeUnit || (editContent.subtitleSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => updateContent('subtitleSizeUnit', value)}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="subtitleColor">Color del Subtítulo</Label>
                    <ColorPicker
                        value={subtitleColor}
                        onChange={(hex) => updateContent('subtitleColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <Separator />

                <div>
                    <Label htmlFor="additionalMessage">Mensaje Adicional (Opcional)</Label>
                    <Textarea
                        id="additionalMessage"
                        value={editContent.additionalMessage || ''}
                        onChange={(e) => updateContent('additionalMessage', e.target.value)}
                        placeholder="Mensaje adicional para mostrar al cliente..."
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="messageBackgroundColor">Color de Fondo del Mensaje</Label>
                        <ColorPicker
                            value={messageBgColor}
                            onChange={(hex) => updateContent('messageBackgroundColor', hex)}
                            showOpacity={false}
                        />
                    </div>

                    <div>
                        <Label htmlFor="messageTextColor">Color del Texto del Mensaje</Label>
                        <ColorPicker
                            value={messageTextColor}
                            onChange={(hex) => updateContent('messageTextColor', hex)}
                            showOpacity={false}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="iconColor">Color del Ícono</Label>
                    <ColorPicker
                        value={iconColor}
                        onChange={(hex) => updateContent('iconColor', hex)}
                        showOpacity={false}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Separator className="my-4" />
                <div className="flex items-center space-x-2">
                    <Label htmlFor="showContinueShoppingButton">Mostrar Botón "Continuar Comprando"</Label>
                    <Switch
                        id="showContinueShoppingButton"
                        checked={editContent.showContinueShoppingButton !== false}
                        onCheckedChange={(checked) => updateContent('showContinueShoppingButton', checked)}
                    />
                </div>

                {editContent.showContinueShoppingButton !== false && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="continueButtonText">Texto del Botón</Label>
                            <Input
                                id="continueButtonText"
                                value={editContent.continueButtonText || 'Continuar Comprando'}
                                onChange={(e) => updateContent('continueButtonText', e.target.value)}
                                placeholder="Continuar Comprando"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="continueButtonBg">Color de Fondo</Label>
                                <ColorPicker
                                    value={continueButtonBg}
                                    onChange={(hex) => updateContent('continueButtonBg', hex)}
                                    showOpacity={false}
                                />
                            </div>

                            <div>
                                <Label htmlFor="continueButtonColor">Color del Texto</Label>
                                <ColorPicker
                                    value={continueButtonColor}
                                    onChange={(hex) => updateContent('continueButtonColor', hex)}
                                    showOpacity={false}
                                />
                            </div>

                            <div>
                                <Label htmlFor="continueButtonBorder">Color del Borde</Label>
                                <ColorPicker
                                    value={continueButtonBorder}
                                    onChange={(hex) => updateContent('continueButtonBorder', hex)}
                                    showOpacity={false}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid rgrid-cols-1 gap-4">
                <Separator className="my-4" />
                <div className="flex items-center space-x-2">
                    <Label htmlFor="showOrdersButton">Mostrar Botón "Ver Mis Pedidos"</Label>
                    <Switch
                        id="showOrdersButton"
                        checked={editContent.showOrdersButton !== false}
                        onCheckedChange={(checked) => updateContent('showOrdersButton', checked)}
                    />
                </div>

                {editContent.showOrdersButton !== false && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="ordersButtonText">Texto del Botón</Label>
                            <Input
                                id="ordersButtonText"
                                value={editContent.ordersButtonText || 'Ver Mis Pedidos'}
                                onChange={(e) => updateContent('ordersButtonText', e.target.value)}
                                placeholder="Ver Mis Pedidos"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="ordersButtonBg">Color de Fondo</Label>
                                <ColorPicker
                                    value={ordersButtonBg}
                                    onChange={(hex) => updateContent('ordersButtonBg', hex)}
                                    showOpacity={false}
                                />
                            </div>

                            <div>
                                <Label htmlFor="ordersButtonColor">Color del Texto</Label>
                                <ColorPicker
                                    value={ordersButtonColor}
                                    onChange={(hex) => updateContent('ordersButtonColor', hex)}
                                    showOpacity={false}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default React.memo(SuccessEditDialog);