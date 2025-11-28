// components/BuilderPages/partials/ProductEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ProductEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateProductConfig = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="columns">Columnas</Label>
                <Select
                    value={editContent.columns?.toString() || '3'}
                    onValueChange={(value) => updateProductConfig('columns', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Columna</SelectItem>
                        <SelectItem value="2">2 Columnas</SelectItem>
                        <SelectItem value="3">3 Columnas</SelectItem>
                        <SelectItem value="4">4 Columnas</SelectItem>
                        <SelectItem value="5">5 Columnas</SelectItem>
                        <SelectItem value="6">6 Columnas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="limit">Límite de Productos</Label>
                <Input
                    id="limit"
                    type="number"
                    value={editContent.limit || 8}
                    onChange={(e) => updateProductConfig('limit', parseInt(e.target.value))}
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={editContent.backgroundColor || '#ffffff'}
                    onChange={(e) => updateProductConfig('backgroundColor', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="gapX">Gap Horizontal (px)</Label>
                    <Input
                        id="gapX"
                        type="number"
                        value={parseInt(editContent.gapX) || 10}
                        onChange={(e) => updateProductConfig('gapX', `${e.target.value}px`)}
                    />
                </div>
                <div>
                    <Label htmlFor="gapY">Gap Vertical (px)</Label>
                    <Input
                        id="gapY"
                        type="number"
                        value={parseInt(editContent.gapY) || 10}
                        onChange={(e) => updateProductConfig('gapY', `${e.target.value}px`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductEditDialog;