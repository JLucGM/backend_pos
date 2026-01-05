import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';

const CheckoutSummaryEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título del resumen</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Resumen del Pedido'}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar subtotal</Label>
                    <Switch
                        checked={editContent?.showSubtotal !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showSubtotal: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar costo de envío</Label>
                    <Switch
                        checked={editContent?.showShipping !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showShipping: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar impuestos</Label>
                    <Switch
                        checked={editContent?.showTax !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showTax: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar descuentos</Label>
                    <Switch
                        checked={editContent?.showDiscount !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showDiscount: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar total del pedido</Label>
                    <Switch
                        checked={editContent?.showOrderTotal !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showOrderTotal: checked })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="shippingText">Texto para envío</Label>
                <Input
                    type="text"
                    value={editContent?.shippingText || 'Envío'}
                    onChange={(e) => setEditContent({ ...editContent, shippingText: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="taxText">Texto para impuestos</Label>
                <Input
                    type="text"
                    value={editContent?.taxText || 'Impuestos'}
                    onChange={(e) => setEditContent({ ...editContent, taxText: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="totalText">Texto para total</Label>
                <Input
                    type="text"
                    value={editContent?.totalText || 'Total'}
                    onChange={(e) => setEditContent({ ...editContent, totalText: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.backgroundColor || '#f9fafb'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.backgroundColor || '#f9fafb'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        type="text"
                        value={editStyles?.padding || '24px'}
                        onChange={(e) => setEditStyles({ ...editStyles, padding: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        type="text"
                        value={editStyles?.borderRadius || '12px'}
                        onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <Input
                    type="text"
                    value={editStyles?.titleSize || '20px'}
                    onChange={(e) => setEditStyles({ ...editStyles, titleSize: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="totalFontSize">Tamaño de fuente total</Label>
                <Input
                    type="text"
                    value={editStyles?.totalFontSize || '24px'}
                    onChange={(e) => setEditStyles({ ...editStyles, totalFontSize: e.target.value })}
                />
            </div>
        </div>
    );
};

export default CheckoutSummaryEditDialog;