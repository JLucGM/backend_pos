import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';

const OrdersEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = false
}) => {
    const content = editContent || {};
    const styles = editStyles || {};

    const updateContent = (key, value) => {
        const newContent = { ...content, [key]: value };
        setEditContent(newContent);
    };

    const updateStyles = (key, value) => {
        const newStyles = { ...styles, [key]: value };
        setEditStyles(newStyles);
    };

    return (
        // <Dialog open={true}>
        //     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        //         <DialogHeader>
        //             <DialogTitle>Configurar Componente de Pedidos</DialogTitle>
        //         </DialogHeader>

                <div className="space-y-6">
                    {/* Configuración de Contenido */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contenido</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title">Título Principal</Label>
                                <Input
                                    id="title"
                                    value={content.title || 'Mis Pedidos'}
                                    onChange={(e) => updateContent('title', e.target.value)}
                                    placeholder="Mis Pedidos"
                                />
                            </div>

                            <div>
                                <Label htmlFor="emptyMessage">Mensaje sin pedidos</Label>
                                <Input
                                    id="emptyMessage"
                                    value={content.emptyMessage || 'No tienes pedidos aún'}
                                    onChange={(e) => updateContent('emptyMessage', e.target.value)}
                                    placeholder="No tienes pedidos aún"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="loginRequiredTitle">Título para no autenticados</Label>
                                <Input
                                    id="loginRequiredTitle"
                                    value={content.loginRequiredTitle || 'Inicia sesión para ver tus pedidos'}
                                    onChange={(e) => updateContent('loginRequiredTitle', e.target.value)}
                                    placeholder="Inicia sesión para ver tus pedidos"
                                />
                            </div>

                            <div>
                                <Label htmlFor="loginButtonText">Texto del botón de login</Label>
                                <Input
                                    id="loginButtonText"
                                    value={content.loginButtonText || 'Iniciar Sesión'}
                                    onChange={(e) => updateContent('loginButtonText', e.target.value)}
                                    placeholder="Iniciar Sesión"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="loginRequiredMessage">Mensaje para no autenticados</Label>
                            <Textarea
                                id="loginRequiredMessage"
                                value={content.loginRequiredMessage || 'Necesitas iniciar sesión para acceder a tu historial de pedidos.'}
                                onChange={(e) => updateContent('loginRequiredMessage', e.target.value)}
                                placeholder="Necesitas iniciar sesión para acceder a tu historial de pedidos."
                                rows={3}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Configuración de Visualización */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Configuración de Visualización</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="ordersPerPage">Pedidos por página</Label>
                                <Input
                                    id="ordersPerPage"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={content.ordersPerPage || 10}
                                    onChange={(e) => updateContent('ordersPerPage', parseInt(e.target.value) || 10)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="sortOrder">Orden de clasificación</Label>
                                <Select
                                    value={content.sortOrder || 'desc'}
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

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="showOrderStatus">Mostrar estado del pedido</Label>
                                <Switch
                                    id="showOrderStatus"
                                    checked={content.showOrderStatus !== false}
                                    onCheckedChange={(checked) => updateContent('showOrderStatus', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="showOrderDate">Mostrar fecha del pedido</Label>
                                <Switch
                                    id="showOrderDate"
                                    checked={content.showOrderDate !== false}
                                    onCheckedChange={(checked) => updateContent('showOrderDate', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="showOrderTotal">Mostrar total del pedido</Label>
                                <Switch
                                    id="showOrderTotal"
                                    checked={content.showOrderTotal !== false}
                                    onCheckedChange={(checked) => updateContent('showOrderTotal', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="showItemCount">Mostrar cantidad de productos</Label>
                                <Switch
                                    id="showItemCount"
                                    checked={content.showItemCount !== false}
                                    onCheckedChange={(checked) => updateContent('showItemCount', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="allowExpandDetails">Permitir expandir detalles</Label>
                                <Switch
                                    id="allowExpandDetails"
                                    checked={content.allowExpandDetails !== false}
                                    onCheckedChange={(checked) => updateContent('allowExpandDetails', checked)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Estilos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estilos</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="backgroundColor">Color de fondo</Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={styles.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="borderRadius">Radio del borde</Label>
                                <Input
                                    id="borderRadius"
                                    value={styles.borderRadius || '8px'}
                                    onChange={(e) => updateStyles('borderRadius', e.target.value)}
                                    placeholder="8px"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="paddingTop">Padding Superior</Label>
                                <Input
                                    id="paddingTop"
                                    value={styles.paddingTop || '20px'}
                                    onChange={(e) => updateStyles('paddingTop', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingRight">Padding Derecho</Label>
                                <Input
                                    id="paddingRight"
                                    value={styles.paddingRight || '20px'}
                                    onChange={(e) => updateStyles('paddingRight', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingBottom">Padding Inferior</Label>
                                <Input
                                    id="paddingBottom"
                                    value={styles.paddingBottom || '20px'}
                                    onChange={(e) => updateStyles('paddingBottom', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                                <Input
                                    id="paddingLeft"
                                    value={styles.paddingLeft || '20px'}
                                    onChange={(e) => updateStyles('paddingLeft', e.target.value)}
                                    placeholder="20px"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="titleColor">Color del título</Label>
                                <Input
                                    id="titleColor"
                                    type="color"
                                    value={styles.titleColor || '#000000'}
                                    onChange={(e) => updateStyles('titleColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="titleSize">Tamaño del título</Label>
                                <Input
                                    id="titleSize"
                                    value={styles.titleSize || '24px'}
                                    onChange={(e) => updateStyles('titleSize', e.target.value)}
                                    placeholder="24px"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="cardBackgroundColor">Color de fondo de tarjetas</Label>
                                <Input
                                    id="cardBackgroundColor"
                                    type="color"
                                    value={styles.cardBackgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyles('cardBackgroundColor', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="cardBorderColor">Color del borde de tarjetas</Label>
                                <Input
                                    id="cardBorderColor"
                                    type="color"
                                    value={styles.cardBorderColor || '#e5e7eb'}
                                    onChange={(e) => updateStyles('cardBorderColor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="gap">Espaciado entre tarjetas</Label>
                            <Input
                                id="gap"
                                value={styles.gap || '16px'}
                                onChange={(e) => updateStyles('gap', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                    </div>
                </div>
        //     </DialogContent>
        // </Dialog>
    );
};

export default OrdersEditDialog;