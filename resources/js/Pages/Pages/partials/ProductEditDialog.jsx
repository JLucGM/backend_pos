// components/Builder/dialogs/ProductEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ProductEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => (
    <div className="space-y-4">
        <p>Los productos son dinámicos y se cargan automáticamente desde la base de datos. Personaliza el título y estilos de la tarjeta.</p>

        {/* Título */}
        <Label htmlFor="title">Título</Label>
        <Input
            id="title"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Escribe el título"
        />

        {/* Color de Fondo de la Tarjeta */}
        <Label htmlFor="backgroundColor">Color de Fondo de la Tarjeta</Label>
        <Input
            id="backgroundColor"
            type="color"
            value={editStyles.backgroundColor || '#ffffff'}
            onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
        />

        {/* Estilos para el Título (usando TextComponent) */}
        <Label>Estilos del Título</Label>
        <div className="space-y-2">
            <Label htmlFor="titleColor">Color</Label>
            <Input
                id="titleColor"
                type="color"
                value={editStyles.titleStyles?.color || '#000000'}
                onChange={(e) => setEditStyles({
                    ...editStyles,
                    titleStyles: { ...editStyles.titleStyles, color: e.target.value }
                })}
            />
            <Label htmlFor="titleFontSize">Tamaño de Fuente</Label>
            <Select value={editStyles.titleStyles?.fontSize || '16px'} onValueChange={(value) => setEditStyles({
                ...editStyles,
                titleStyles: { ...editStyles.titleStyles, fontSize: value }
            })}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                    <SelectItem value="20px">20px</SelectItem>
                    <SelectItem value="24px">24px</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Estilos para Nombre del Producto */}
        <Label>Estilos del Nombre del Producto</Label>
        <div className="space-y-2">
            <Label htmlFor="nameColor">Color</Label>
            <Input
                id="nameColor"
                type="color"
                value={editStyles.nameStyles?.color || '#000000'}
                onChange={(e) => setEditStyles({
                    ...editStyles,
                    nameStyles: { ...editStyles.nameStyles, color: e.target.value }
                })}
            />
        </div>

        {/* Estilos para Precio del Producto */}
        <Label>Estilos del Precio del Producto</Label>
        <div className="space-y-2">
            <Label htmlFor="priceColor">Color</Label>
            <Input
                id="priceColor"
                type="color"
                value={editStyles.priceStyles?.color || '#000000'}
                onChange={(e) => setEditStyles({
                    ...editStyles,
                    priceStyles: { ...editStyles.priceStyles, color: e.target.value }
                })}
            />
        </div>
    </div>
);

export default ProductEditDialog;