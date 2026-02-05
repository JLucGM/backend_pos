import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Slider } from '@/Components/ui/slider';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const BentoFeatureEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleContentChange = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración de la Característica</h3>

            {/* Color de fondo */}
            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={editContent.backgroundColor || '#f8fafc'}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        className="w-12 h-10"
                    />
                    <Input
                        type="text"
                        value={editContent.backgroundColor || '#f8fafc'}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        placeholder="#f8fafc"
                    />
                </div>
            </div>

            {/* Imagen de fondo */}
            <div className="space-y-2">
                <Label htmlFor="backgroundImage">Imagen de fondo (URL)</Label>
                <Input
                    id="backgroundImage"
                    type="text"
                    value={editContent.backgroundImage || ''}
                    onChange={(e) => handleContentChange('backgroundImage', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            {/* Configuración del border */}
            <div className="space-y-2">
                <Label>Border</Label>
                <Select
                    value={editContent.border || 'none'}
                    onValueChange={(value) => handleContentChange('border', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de border" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin border</SelectItem>
                        <SelectItem value="solid">Border sólido</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editContent.border === 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="borderThickness">Grosor del border</Label>
                        <Input
                            id="borderThickness"
                            type="number"
                            value={parseInt(editContent.borderThickness) || 1}
                            onChange={(e) => handleContentChange('borderThickness', e.target.value)}
                            placeholder="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="borderColor">Color del border</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="borderColor"
                                type="color"
                                value={editContent.borderColor || '#e5e7eb'}
                                onChange={(e) => handleContentChange('borderColor', e.target.value)}
                                className="w-12 h-10"
                            />
                            <Input
                                type="text"
                                value={editContent.borderColor || '#e5e7eb'}
                                onChange={(e) => handleContentChange('borderColor', e.target.value)}
                                placeholder="#e5e7eb"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Border radius */}
            <div className="space-y-2">
                <Label htmlFor="borderRadius">Border radius</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editContent.borderRadius) || 12}
                    onChange={(e) => handleContentChange('borderRadius', e.target.value)}
                    placeholder="12"
                />
            </div>

            {/* Padding */}
            <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                    id="padding"
                    type="number"
                    value={parseInt(editContent.padding) || 24}
                    onChange={(e) => handleContentChange('padding', e.target.value)}
                    placeholder="24"
                />
            </div>

            {/* Opacidad */}
            <div className="space-y-2">
                <Label htmlFor="opacity">Opacidad</Label>
                <div className="space-y-2">
                    <Slider
                        value={[editContent.opacity !== undefined ? editContent.opacity * 100 : 100]}
                        onValueChange={(value) => handleContentChange('opacity', value[0] / 100)}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>0%</span>
                        <span>{editContent.opacity !== undefined ? Math.round(editContent.opacity * 100) : 100}%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoFeatureEditDialog;