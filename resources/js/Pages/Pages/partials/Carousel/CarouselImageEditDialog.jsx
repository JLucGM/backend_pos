import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CarouselImageEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    La imagen del producto se obtiene automáticamente de la base de datos.
                </p>
            </div>

            <div>
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select
                    value={editStyles.aspectRatio || 'square'}
                    onValueChange={(value) => updateStyle('aspectRatio', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                        <SelectItem value="square">Square (1:1)</SelectItem>
                        <SelectItem value="portrait">Portrait (4:5)</SelectItem>
                    </SelectContent>
                </Select>
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
                            onChange={(e) => updateStyle('imageBorderThickness', e.target.value)}
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
                    onChange={(e) => updateStyle('imageBorderRadius', e.target.value)}
                />
            </div>
        </div>
    );
};

export default CarouselImageEditDialog;