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
                <div className="flex gap-2">
                    <Input
                        id="imageSize"
                        type="number"
                        value={parseInt(editStyles?.imageSize) || 80}
                        onChange={(e) => setEditStyles({ ...editStyles, imageSize: e.target.value })}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.imageSizeUnit || (editStyles.imageSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => setEditStyles({ ...editStyles, imageSizeUnit: value })}
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
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 20}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingTop: e.target.value })}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 20}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: e.target.value })}
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
                        onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: e.target.value })}
                        placeholder="20"
                    />
                </div>
                <div>
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 20}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingRight: e.target.value })}
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
                        onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                        placeholder="0"
                    />
                </div>

                <div>
                    <Label htmlFor="borderWidth">Grosor del borde</Label>
                    <Input
                        id="borderWidth"
                        type="number"
                        value={parseInt(editStyles.borderWidth) || 0}
                        onChange={(e) => setEditStyles({ ...editStyles, borderWidth: e.target.value })}
                        placeholder="0"
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