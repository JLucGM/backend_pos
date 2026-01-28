// pages/Pages/partials/Success/SuccessEditDialog.jsx
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const SuccessEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);
    const updateContent = (key, value) => {
        const newContent = { ...editContent, [key]: value };
        setEditContent(newContent);
    };

    const updateStyle = (key, value) => {
        const newStyles = { ...editStyles, [key]: value };
        setEditStyles(newStyles);
    };

    return (


        <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                <TabsTrigger value="buttons">Botones</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Textos Principales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                            <Label htmlFor="subtitle">Subtítulo</Label>
                            <Input
                                id="subtitle"
                                value={editContent.subtitle || 'Tu orden ha sido procesada correctamente'}
                                onChange={(e) => updateContent('subtitle', e.target.value)}
                                placeholder="Tu orden ha sido procesada correctamente"
                            />
                        </div>

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
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Colores del Texto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="titleColor">Color del Título</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="titleColor"
                                        type="color"
                                        value={editContent.titleColor || '#000000'}
                                        onChange={(e) => updateContent('titleColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editContent.titleColor || '#000000'}
                                        onChange={(e) => updateContent('titleColor', e.target.value)}
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="subtitleColor">Color del Subtítulo</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="subtitleColor"
                                        type="color"
                                        value={editContent.subtitleColor || '#666666'}
                                        onChange={(e) => updateContent('subtitleColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editContent.subtitleColor || '#666666'}
                                        onChange={(e) => updateContent('subtitleColor', e.target.value)}
                                        placeholder="#666666"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="iconColor">Color del Ícono</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="iconColor"
                                        type="color"
                                        value={editContent.iconColor || '#10b981'}
                                        onChange={(e) => updateContent('iconColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editContent.iconColor || '#10b981'}
                                        onChange={(e) => updateContent('iconColor', e.target.value)}
                                        placeholder="#10b981"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tamaños de Texto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="titleSize">Tamaño del Título</Label>
                                <Input
                                    id="titleSize"
                                    value={editContent.titleSize || '32px'}
                                    onChange={(e) => updateContent('titleSize', e.target.value)}
                                    placeholder="32px"
                                />
                            </div>

                            <div>
                                <Label htmlFor="subtitleSize">Tamaño del Subtítulo</Label>
                                <Input
                                    id="subtitleSize"
                                    value={editContent.subtitleSize || '18px'}
                                    onChange={(e) => updateContent('subtitleSize', e.target.value)}
                                    placeholder="18px"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Mensaje Adicional</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="messageBackgroundColor">Color de Fondo del Mensaje</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="messageBackgroundColor"
                                        type="color"
                                        value={editContent.messageBackgroundColor || '#f3f4f6'}
                                        onChange={(e) => updateContent('messageBackgroundColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editContent.messageBackgroundColor || '#f3f4f6'}
                                        onChange={(e) => updateContent('messageBackgroundColor', e.target.value)}
                                        placeholder="#f3f4f6"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="messageTextColor">Color del Texto del Mensaje</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="messageTextColor"
                                        type="color"
                                        value={editContent.messageTextColor || '#374151'}
                                        onChange={(e) => updateContent('messageTextColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editContent.messageTextColor || '#374151'}
                                        onChange={(e) => updateContent('messageTextColor', e.target.value)}
                                        placeholder="#374151"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Espaciado y Diseño</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="backgroundColor"
                                        type="color"
                                        value={editStyles.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                        className="w-12 h-10"
                                    />
                                    <Input
                                        value={editStyles.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="maxWidth">Ancho Máximo</Label>
                                <Input
                                    id="maxWidth"
                                    value={editStyles.maxWidth || '1200px'}
                                    onChange={(e) => updateStyle('maxWidth', e.target.value)}
                                    placeholder="1200px"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="paddingTop">Padding Superior</Label>
                                <Input
                                    id="paddingTop"
                                    value={editStyles.paddingTop || '40px'}
                                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                                    placeholder="40px"
                                />
                            </div>

                            <div>
                                <Label htmlFor="paddingRight">Padding Derecho</Label>
                                <Input
                                    id="paddingRight"
                                    value={editStyles.paddingRight || '20px'}
                                    onChange={(e) => updateStyle('paddingRight', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>

                            <div>
                                <Label htmlFor="paddingBottom">Padding Inferior</Label>
                                <Input
                                    id="paddingBottom"
                                    value={editStyles.paddingBottom || '40px'}
                                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                                    placeholder="40px"
                                />
                            </div>

                            <div>
                                <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                                <Input
                                    id="paddingLeft"
                                    value={editStyles.paddingLeft || '20px'}
                                    onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="buttons" className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de Botones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="showContinueShoppingButton"
                                    checked={editContent.showContinueShoppingButton !== false}
                                    onCheckedChange={(checked) => updateContent('showContinueShoppingButton', checked)}
                                />
                                <Label htmlFor="showContinueShoppingButton">Mostrar Botón "Continuar Comprando"</Label>
                            </div>

                            {editContent.showContinueShoppingButton !== false && (
                                <div className="ml-6 space-y-4">
                                    <div>
                                        <Label htmlFor="continueButtonText">Texto del Botón</Label>
                                        <Input
                                            id="continueButtonText"
                                            value={editContent.continueButtonText || 'Continuar Comprando'}
                                            onChange={(e) => updateContent('continueButtonText', e.target.value)}
                                            placeholder="Continuar Comprando"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="continueButtonBg">Color de Fondo</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="continueButtonBg"
                                                    type="color"
                                                    value={editContent.continueButtonBg || '#ffffff'}
                                                    onChange={(e) => updateContent('continueButtonBg', e.target.value)}
                                                    className="w-12 h-10"
                                                />
                                                <Input
                                                    value={editContent.continueButtonBg || '#ffffff'}
                                                    onChange={(e) => updateContent('continueButtonBg', e.target.value)}
                                                    placeholder="#ffffff"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="continueButtonColor">Color del Texto</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="continueButtonColor"
                                                    type="color"
                                                    value={editContent.continueButtonColor || '#000000'}
                                                    onChange={(e) => updateContent('continueButtonColor', e.target.value)}
                                                    className="w-12 h-10"
                                                />
                                                <Input
                                                    value={editContent.continueButtonColor || '#000000'}
                                                    onChange={(e) => updateContent('continueButtonColor', e.target.value)}
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="continueButtonBorder">Color del Borde</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="continueButtonBorder"
                                                    type="color"
                                                    value={editContent.continueButtonBorder || '#d1d5db'}
                                                    onChange={(e) => updateContent('continueButtonBorder', e.target.value)}
                                                    className="w-12 h-10"
                                                />
                                                <Input
                                                    value={editContent.continueButtonBorder || '#d1d5db'}
                                                    onChange={(e) => updateContent('continueButtonBorder', e.target.value)}
                                                    placeholder="#d1d5db"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="showOrdersButton"
                                    checked={editContent.showOrdersButton !== false}
                                    onCheckedChange={(checked) => updateContent('showOrdersButton', checked)}
                                />
                                <Label htmlFor="showOrdersButton">Mostrar Botón "Ver Mis Pedidos"</Label>
                            </div>

                            {editContent.showOrdersButton !== false && (
                                <div className="ml-6 space-y-4">
                                    <div>
                                        <Label htmlFor="ordersButtonText">Texto del Botón</Label>
                                        <Input
                                            id="ordersButtonText"
                                            value={editContent.ordersButtonText || 'Ver Mis Pedidos'}
                                            onChange={(e) => updateContent('ordersButtonText', e.target.value)}
                                            placeholder="Ver Mis Pedidos"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="ordersButtonBg">Color de Fondo</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="ordersButtonBg"
                                                    type="color"
                                                    value={editContent.ordersButtonBg || '#3b82f6'}
                                                    onChange={(e) => updateContent('ordersButtonBg', e.target.value)}
                                                    className="w-12 h-10"
                                                />
                                                <Input
                                                    value={editContent.ordersButtonBg || '#3b82f6'}
                                                    onChange={(e) => updateContent('ordersButtonBg', e.target.value)}
                                                    placeholder="#3b82f6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="ordersButtonColor">Color del Texto</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="ordersButtonColor"
                                                    type="color"
                                                    value={editContent.ordersButtonColor || '#ffffff'}
                                                    onChange={(e) => updateContent('ordersButtonColor', e.target.value)}
                                                    className="w-12 h-10"
                                                />
                                                <Input
                                                    value={editContent.ordersButtonColor || '#ffffff'}
                                                    onChange={(e) => updateContent('ordersButtonColor', e.target.value)}
                                                    placeholder="#ffffff"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default SuccessEditDialog;