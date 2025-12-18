import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const HeaderCartEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="content">Contador del carrito</Label>
                <Input
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Ej: 0, 3, 5+"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Deja vacío para no mostrar contador
                </p>
            </div>

            <div>
                <Label htmlFor="icon">Icono</Label>
                <Select
                    value={editStyles.icon || 'cart'}
                    onValueChange={(value) => updateStyle('icon', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cart">🛒 Carrito</SelectItem>
                        <SelectItem value="bag">🛍️ Bolsa</SelectItem>
                        <SelectItem value="basket">🧺 Canasta</SelectItem>
                        <SelectItem value="cart2">🛒 Carrito 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        id="backgroundColor"
                        value={editStyles.backgroundColor || '#000000'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.backgroundColor || '#000000'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="color">Color del icono</Label>
                <div className="flex gap-2">
                    <Input
                        id="color"
                        value={editStyles.color || '#ffffff'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.color || '#ffffff'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="size">Tamaño del icono (px)</Label>
                <Input
                    id="size"
                    type="number"
                    value={parseInt(editStyles.fontSize) || 16}
                    onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label htmlFor="badgeColor">Color del badge</Label>
                <div className="flex gap-2">
                    <Input
                        id="badgeColor"
                        value={editStyles.badgeColor || 'red'}
                        onChange={(e) => updateStyle('badgeColor', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.badgeColor || '#ff0000'}
                        onChange={(e) => updateStyle('badgeColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeaderCartEditDialog;