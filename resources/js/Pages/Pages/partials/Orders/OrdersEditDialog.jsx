import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const OrdersEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
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
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateStyles = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="contenido" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="contenido">Contenido</TabsTrigger>
                    <TabsTrigger value="configuracion">Configuración</TabsTrigger>
                    <TabsTrigger value="estilos">Estilos</TabsTrigger>
                </TabsList>

                {/* Pestaña Contenido */}
                <TabsContent value="contenido" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="title">Título Principal</Label>
                            <Input
                                id="title"
                                value={editContent.title || 'Mis Pedidos'}
                                onChange={(e) => updateContent('title', e.target.value)}
                                placeholder="Mis Pedidos"
                            />
                        </div>

                        <div>
                            <Label htmlFor="subtitle">Subtítulo (opcional)</Label>
                            <Input
                                id="subtitle"
                                value={editContent.subtitle || ''}
                                onChange={(e) => updateContent('subtitle', e.target.value)}
                                placeholder="Historial de tus compras"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="emptyTitle">Título sin pedidos</Label>
                            <Input
                                id="emptyTitle"
                                value={editContent.emptyTitle || 'No tienes pedidos aún'}
                                onChange={(e) => updateContent('emptyTitle', e.target.value)}
                                placeholder="No tienes pedidos aún"
                            />
                        </div>

                        <div>
                            <Label htmlFor="shopButtonText">Texto del botón de tienda</Label>
                            <Input
                                id="shopButtonText"
                                value={editContent.shopButtonText || 'Ir a la tienda'}
                                onChange={(e) => updateContent('shopButtonText', e.target.value)}
                                placeholder="Ir a la tienda"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="emptyMessage">Mensaje sin pedidos</Label>
                        <Textarea
                            id="emptyMessage"
                            value={editContent.emptyMessage || 'Cuando realices tu primer pedido, aparecerá aquí.'}
                            onChange={(e) => updateContent('emptyMessage', e.target.value)}
                            placeholder="Cuando realices tu primer pedido, aparecerá aquí."
                            rows={3}
                        />
                    </div>
                </TabsContent>

                {/* Pestaña Configuración */}
                <TabsContent value="configuracion" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="ordersPerPage">Pedidos por página</Label>
                            <Input
                                id="ordersPerPage"
                                type="number"
                                min="1"
                                max="50"
                                value={editContent.ordersPerPage || 10}
                                onChange={(e) => updateContent('ordersPerPage', parseInt(e.target.value) || 10)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sortOrder">Orden de clasificación</Label>
                            <Select
                                value={editContent.sortOrder || 'desc'}
                                onValueChange={(value) => updateContent('sortOrder', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Más recientes primero</SelectItem>
                                    <SelectItem value="asc">Más antiguos primero</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                        <h4 className="font-medium">Elementos a mostrar</h4>
                        
                        <div className="flex items-center justify-between">
                            <Label htmlFor="showOrderStatus">Mostrar estado del pedido</Label>
                            <Switch
                                id="showOrderStatus"
                                checked={editContent.showOrderStatus !== false}
                                onCheckedChange={(checked) => updateContent('showOrderStatus', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="showOrderDate">Mostrar fecha del pedido</Label>
                            <Switch
                                id="showOrderDate"
                                checked={editContent.showOrderDate !== false}
                                onCheckedChange={(checked) => updateContent('showOrderDate', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="showOrderTotal">Mostrar total del pedido</Label>
                            <Switch
                                id="showOrderTotal"
                                checked={editContent.showOrderTotal !== false}
                                onCheckedChange={(checked) => updateContent('showOrderTotal', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="showItemCount">Mostrar cantidad de productos</Label>
                            <Switch
                                id="showItemCount"
                                checked={editContent.showItemCount !== false}
                                onCheckedChange={(checked) => updateContent('showItemCount', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="allowExpandDetails">Permitir expandir detalles</Label>
                            <Switch
                                id="allowExpandDetails"
                                checked={editContent.allowExpandDetails !== false}
                                onCheckedChange={(checked) => updateContent('allowExpandDetails', checked)}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Pestaña Estilos */}
                <TabsContent value="estilos" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="backgroundColor">Color de fondo</Label>
                            <Input
                                id="backgroundColor"
                                type="color"
                                value={editStyles.backgroundColor || '#ffffff'}
                                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="borderRadius">Radio del borde</Label>
                            <Input
                                id="borderRadius"
                                value={editStyles.borderRadius || '8px'}
                                onChange={(e) => updateStyles('borderRadius', e.target.value)}
                                placeholder="8px"
                            />
                        </div>
                    </div>

                    <Label>Padding (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop">Superior</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editStyles.paddingTop) || 40}
                                onChange={(e) => updateStyles('paddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editStyles.paddingRight) || 20}
                                onChange={(e) => updateStyles('paddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom">Inferior</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editStyles.paddingBottom) || 40}
                                onChange={(e) => updateStyles('paddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editStyles.paddingLeft) || 20}
                                onChange={(e) => updateStyles('paddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="maxWidth">Ancho máximo</Label>
                        <Input
                            id="maxWidth"
                            value={editStyles.maxWidth || '1000px'}
                            onChange={(e) => updateStyles('maxWidth', e.target.value)}
                            placeholder="1000px"
                        />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <h4 className="font-medium">Estilos de Tarjetas</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cardBackgroundColor">Color de fondo de tarjetas</Label>
                                <Input
                                    id="cardBackgroundColor"
                                    type="color"
                                    value={editStyles.cardBackgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyles('cardBackgroundColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="cardBorderColor">Color del borde de tarjetas</Label>
                                <Input
                                    id="cardBorderColor"
                                    type="color"
                                    value={editStyles.cardBorderColor || '#e5e7eb'}
                                    onChange={(e) => updateStyles('cardBorderColor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="gap">Espaciado entre tarjetas</Label>
                            <Input
                                id="gap"
                                value={editStyles.gap || '16px'}
                                onChange={(e) => updateStyles('gap', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <h4 className="font-medium">Tipografía</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="titleColor">Color del título</Label>
                                <Input
                                    id="titleColor"
                                    type="color"
                                    value={editStyles.titleColor || '#000000'}
                                    onChange={(e) => updateStyles('titleColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="titleSize">Tamaño del título</Label>
                                <Input
                                    id="titleSize"
                                    value={editStyles.titleSize || '24px'}
                                    onChange={(e) => updateStyles('titleSize', e.target.value)}
                                    placeholder="24px"
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrdersEditDialog;