// components/BuilderPages/partials/Checkout/CheckoutDiscountGiftCardEditDialog.jsx
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const CheckoutDiscountGiftCardEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
}) => {
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

                <div className="space-y-2">
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        id="padding"
                        value={editStyles.padding || '16px'}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="Ej: 16px"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="borderRadius">Radio de borde</Label>
                    <Input
                        id="borderRadius"
                        value={editStyles.borderRadius || '8px'}
                        onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                        placeholder="Ej: 8px"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="titleSize">Tamaño del título</Label>
                    <Select
                        value={editStyles.titleSize || '16px'}
                        onValueChange={(value) => handleStyleChange('titleSize', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="14px">Pequeño (14px)</SelectItem>
                            <SelectItem value="16px">Mediano (16px)</SelectItem>
                            <SelectItem value="18px">Grande (18px)</SelectItem>
                            <SelectItem value="20px">Extra grande (20px)</SelectItem>
                        </SelectContent>
                    </Select>
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