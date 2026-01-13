import React, { useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CheckoutEditDialog = ({
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
                <DialogTitle>Configurar Checkout</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="layoutType">Tipo de Layout</Label>
                    <Select
                        value={editStyles.layoutType || 'compact'}
                        onValueChange={(value) => handleStyleChange('layoutType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="compact">Compacto (Recomendado)</SelectItem>
                            <SelectItem value="two-column">Dos Columnas</SelectItem>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="vertical">Una Columna</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        • Compacto: Columna ancha para información del cliente, sidebar para descuentos y resumen<br />
                        • Dos Columnas: Columnas iguales sin espacios<br />
                        • Grid: 2x2 grid ordenado<br />
                        • Vertical: Todo en una columna
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="maxWidth">Ancho máximo</Label>
                    <Input
                        id="maxWidth"
                        value={editStyles.maxWidth || '1200px'}
                        onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                        placeholder="Ej: 1200px"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        id="padding"
                        value={editStyles.padding || '40px 20px'}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="Ej: 40px 20px"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Color de fondo</Label>
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gap">Espacio entre componentes</Label>
                    <Input
                        id="gap"
                        value={editStyles.gap || '40px'}
                        onChange={(e) => handleStyleChange('gap', e.target.value)}
                        placeholder="Ej: 40px"
                    />
                </div>
            </div>
        </DialogContent>
    );
};

export default CheckoutEditDialog;