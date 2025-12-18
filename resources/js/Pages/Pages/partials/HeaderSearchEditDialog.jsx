import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';

const HeaderSearchEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="content">Placeholder del buscador</Label>
                <Textarea
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Buscar..."
                    rows={2}
                />
            </div>

            <div>
                <Label htmlFor="width">Ancho del buscador (px)</Label>
                <Input
                    id="width"
                    type="number"
                    value={parseInt(editStyles.width) || 200}
                    onChange={(e) => updateStyle('width', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label htmlFor="borderRadius">Radio de borde (px)</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 20}
                    onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label htmlFor="border">Color del borde</Label>
                <div className="flex gap-2">
                    <Input
                        id="border"
                        value={editStyles.border || '1px solid #ccc'}
                        onChange={(e) => updateStyle('border', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.borderColor || '#cccccc'}
                        onChange={(e) => updateStyle('borderColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="showIcon">Mostrar icono de búsqueda</Label>
                <Switch
                    id="showIcon"
                    checked={editStyles.showIcon !== false}
                    onCheckedChange={(checked) => updateStyle('showIcon', checked)}
                />
            </div>

            <div>
                <Label htmlFor="padding">Padding interno (px)</Label>
                <Input
                    id="padding"
                    type="number"
                    value={parseInt(editStyles.padding) || 8}
                    onChange={(e) => updateStyle('padding', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        id="backgroundColor"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeaderSearchEditDialog;