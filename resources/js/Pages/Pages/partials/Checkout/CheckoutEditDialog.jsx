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
                    <div className="flex gap-2">
                        <Input
                            id="maxWidth"
                            type="number"
                            value={parseInt(editStyles.maxWidth) || 1200}
                            onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                            placeholder="1200"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.maxWidthUnit || (editStyles.maxWidth?.toString().includes('%') ? '%' : 'px')}
                            onValueChange={(value) => handleStyleChange('maxWidthUnit', value)}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="%">%</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="paddingTop">Padding Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 40}
                            onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                            placeholder="40"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paddingBottom">Padding Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 40}
                            onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                            placeholder="40"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 20}
                            onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                            placeholder="20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paddingRight">Padding Derecho</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 20}
                            onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                            placeholder="20"
                        />
                    </div>
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
                    <div className="flex gap-2">
                        <Input
                            id="gap"
                            type="number"
                            value={parseInt(editStyles.gap) || 40}
                            onChange={(e) => handleStyleChange('gap', e.target.value)}
                            placeholder="40"
                            className="flex-1"
                        />
                        <Select
                            value={editStyles.gapUnit || (editStyles.gap?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => handleStyleChange('gapUnit', value)}
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
        </DialogContent>
    );
};

export default CheckoutEditDialog;