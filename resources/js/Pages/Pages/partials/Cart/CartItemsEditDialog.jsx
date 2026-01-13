import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CartItemsEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings, isLiveEdit = true }) => {
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
                <Label htmlFor="title">Título de la sección</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Tu carrito'}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="emptyMessage">Mensaje cuando está vacío</Label>
                <Input
                    type="text"
                    value={editContent?.emptyMessage || 'Tu carrito está vacío'}
                    onChange={(e) => setEditContent({ ...editContent, emptyMessage: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar imagen del producto</Label>
                    <Switch
                        checked={editContent?.showImage !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showImage: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar combinación seleccionada</Label>
                    <Switch
                        checked={editContent?.showCombination !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showCombination: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar stock disponible</Label>
                    <Switch
                        checked={editContent?.showStock === true}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showStock: checked })}
                    />
                </div>
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="imageSize">Tamaño de imagen</Label>
                <Select
                    value={editStyles?.imageSize || '80px'}
                    onValueChange={(value) => setEditStyles({ ...editStyles, imageSize: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="60px">Pequeño (60px)</SelectItem>
                        <SelectItem value="80px">Mediano (80px)</SelectItem>
                        <SelectItem value="100px">Grande (100px)</SelectItem>
                        <SelectItem value="120px">Extra grande (120px)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.backgroundColor || '#ffffff'}
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
                    <div>
                        <Label htmlFor="borderColor">Color del borde</Label>
                        <Input
                            id="borderColor"
                            type="color"
                            value={editStyles.borderColor || '#e5e7eb'}
                            onChange={(e) => setEditStyles({ ...editStyles, borderColor: e.target.value })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItemsEditDialog;