// components/BuilderPages/partials/ProductImageEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ProductImageEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateContent = (value) => {
        setEditContent(value);
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="imageUrl">URL de la Imagen</Label>
                <Input
                    id="imageUrl"
                    value={editContent}
                    onChange={(e) => updateContent(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            <div>
                <Label htmlFor="imageBorder">Borde de la Imagen</Label>
                <Select
                    value={editStyles.imageBorder || 'none'}
                    onValueChange={(value) => updateStyle('imageBorder', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin borde</SelectItem>
                        <SelectItem value="solid">Con borde</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.imageBorder === 'solid' && (
                <>
                    <div>
                        <Label htmlFor="imageBorderThickness">Espesor del Borde (px)</Label>
                        <Input
                            id="imageBorderThickness"
                            type="number"
                            value={parseInt(editStyles.imageBorderThickness) || 1}
                            onChange={(e) => updateStyle('imageBorderThickness', `${e.target.value}px`)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="imageBorderOpacity">Opacidad del Borde (0-1)</Label>
                        <Input
                            id="imageBorderOpacity"
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={editStyles.imageBorderOpacity || 1}
                            onChange={(e) => updateStyle('imageBorderOpacity', e.target.value)}
                        />
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="imageBorderRadius">Border Radius (px)</Label>
                <Input
                    id="imageBorderRadius"
                    type="number"
                    value={parseInt(editStyles.imageBorderRadius) || 0}
                    onChange={(e) => updateStyle('imageBorderRadius', `${e.target.value}px`)}
                />
            </div>
        </div>
    );
};

export default ProductImageEditDialog;