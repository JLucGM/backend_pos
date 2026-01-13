import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CartSummaryEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
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
                    value={editContent?.title || 'Resumen del pedido'}
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


            </div>
            <Separator className="my-4" />

            <div>
                <Label htmlFor="checkoutButtonText">Texto del botón de pago</Label>
                <Input
                    type="text"
                    value={editContent?.checkoutButtonText || 'Proceder al pago'}
                    onChange={(e) => setEditContent({ ...editContent, checkoutButtonText: e.target.value })}
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

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingTop || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingTop: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingBottom || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingLeft || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingRight || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingRight: e.target.value })}
                    />
                </div>
            </div>

            <Separator className="my-4" />


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        id="borderRadius"
                        value={editStyles.borderRadius || '0px'}
                        onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                        placeholder="Ej: 8px"
                    />
                </div>

                <div>
                    <Label htmlFor="borderWidth">Grosor del borde</Label>
                    <Input
                        id="borderWidth"
                        value={editStyles.borderWidth || '0px'}
                        onChange={(e) => setEditStyles({ ...editStyles, borderWidth: e.target.value })}
                        placeholder="Ej: 1px"
                    />
                </div>
                {editStyles.borderWidth !== '0px' && (
                    <div className='col-span-full'>
                        <Label htmlFor="borderColor">Color del borde</Label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                value={editStyles?.borderColor || '#f9fafb'}
                                onChange={(e) => setEditStyles({ ...editStyles, borderColor: e.target.value })}
                            />
                            <Input
                                type="color"
                                value={editStyles?.borderColor || '#f9fafb'}
                                onChange={(e) => setEditStyles({ ...editStyles, borderColor: e.target.value })}
                                className="w-12"
                            />
                        </div>
                    </div>
                )}
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

export default CartSummaryEditDialog;