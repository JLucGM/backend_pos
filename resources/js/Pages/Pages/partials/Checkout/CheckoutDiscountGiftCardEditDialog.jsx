// components/BuilderPages/partials/Checkout/CheckoutDiscountGiftCardEditDialog.jsx
import React, { useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CheckoutDiscountGiftCardEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true,
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleStyleChange = (property, value) => {
        setEditStyles(prev => ({ ...prev, [property]: value }));
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Editar Cupones y Gift Cards</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Título del componente</Label>
                    <Input
                        id="title"
                        value={editContent?.title || ''}
                        onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                        placeholder="Ej: Cupones y Gift Cards"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Color de fondo</Label>
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={editStyles.backgroundColor || '#f8fafc'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="paddingTop">Padding Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 16}
                            onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                            placeholder="16"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paddingBottom">Padding Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 16}
                            onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                            placeholder="16"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 16}
                            onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                            placeholder="16"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paddingRight">Padding Derecho</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 16}
                            onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                            placeholder="16"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="borderRadius">Radio de borde</Label>
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || 8}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                        placeholder="8"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="titleSize">Tamaño del título</Label>
                    <div className="flex gap-2">
                        <Input
                            id="titleSize"
                            type="number"
                            value={parseInt(editStyles.titleSize) || 16}
                            onChange={(e) => handleStyleChange('titleSize', e.target.value)}
                            placeholder="16"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.titleSizeUnit || (editStyles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => handleStyleChange('titleSizeUnit', value)}
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

                <div className="space-y-2">
                    <Label htmlFor="titleColor">Color del título</Label>
                    <Input
                        id="titleColor"
                        type="color"
                        value={editStyles.titleColor || '#374151'}
                        onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                    />
                </div>
            </div>
        </DialogContent>
    );
};

export default CheckoutDiscountGiftCardEditDialog;