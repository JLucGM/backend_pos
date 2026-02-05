import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CheckoutSummaryEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

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
                <div className="space-y-2">
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 24}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingTop: e.target.value })}
                        placeholder="24"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 24}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: e.target.value })}
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
                        onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: e.target.value })}
                        placeholder="24"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 24}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingRight: e.target.value })}
                        placeholder="24"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="borderRadius">Borde redondeado</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 12}
                    onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                    placeholder="12"
                />
            </div>

            <div>
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <div className="flex gap-2">
                    <Input
                        id="titleSize"
                        type="number"
                        value={parseInt(editStyles.titleSize) || 20}
                        onChange={(e) => setEditStyles({ ...editStyles, titleSize: e.target.value })}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.titleSizeUnit || (editStyles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => setEditStyles({ ...editStyles, titleSizeUnit: value })}
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
                        onChange={(e) => setEditStyles({ ...editStyles, totalFontSize: e.target.value })}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.totalFontSizeUnit || (editStyles.totalFontSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => setEditStyles({ ...editStyles, totalFontSizeUnit: value })}
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
        </div>
    );
};

export default CheckoutSummaryEditDialog;