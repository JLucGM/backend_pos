// components/BuilderPages/partials/ProductPriceEditDialog.jsx
import React from 'react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';

const ProductPriceEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="priceLayout">Layout</Label>
                <Select 
                    value={editStyles.layout || 'fit'} 
                    onValueChange={(value) => updateStyle('layout', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                        <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="priceAlignment">Alineación</Label>
                <Select 
                    value={editStyles.alignment || 'left'} 
                    onValueChange={(value) => updateStyle('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="priceColor">Color del Texto</Label>
                <Input
                    id="priceColor"
                    type="color"
                    value={editStyles.color || '#666666'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="priceFontSize">Tamaño de Fuente</Label>
                <Select 
                    value={editStyles.fontSize || '14px'} 
                    onValueChange={(value) => updateStyle('fontSize', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="priceFontWeight">Grosor de Fuente</Label>
                <Select 
                    value={editStyles.fontWeight || 'normal'} 
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Negrita</SelectItem>
                        <SelectItem value="600">Seminegrita</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ProductPriceEditDialog;