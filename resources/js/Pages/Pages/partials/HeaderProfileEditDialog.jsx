import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const HeaderProfileEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="content">Texto o icono</Label>
                <Input
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="👤, 👨‍💼, 👩‍💼"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Puedes usar emojis o texto (ej: MI)
                </p>
            </div>

            <div>
                <Label htmlFor="iconType">Tipo de icono</Label>
                <Select
                    value={editStyles.iconType || 'user'}
                    onValueChange={(value) => updateStyle('iconType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">👤 Usuario</SelectItem>
                        <SelectItem value="admin">👨‍💼 Admin</SelectItem>
                        <SelectItem value="female">👩 Usuaria</SelectItem>
                        <SelectItem value="avatar">🧑 Avatar</SelectItem>
                        <SelectItem value="person">🧍 Persona</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        id="backgroundColor"
                        value={editStyles.backgroundColor || '#f0f0f0'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.backgroundColor || '#f0f0f0'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="color">Color del icono/texto</Label>
                <div className="flex gap-2">
                    <Input
                        id="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="size">Tamaño (px)</Label>
                <Input
                    id="size"
                    type="number"
                    value={parseInt(editStyles.fontSize) || 16}
                    onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label htmlFor="showDropdown">Mostrar menú desplegable</Label>
                <Select
                    value={editStyles.showDropdown || 'none'}
                    onValueChange={(value) => updateStyle('showDropdown', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin menú</SelectItem>
                        <SelectItem value="hover">Al pasar el mouse</SelectItem>
                        <SelectItem value="click">Al hacer clic</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="borderRadius">Radio de borde (px)</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 50}
                    onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                />
            </div>
        </div>
    );
};

export default HeaderProfileEditDialog;