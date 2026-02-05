import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Badge } from '@/Components/ui/badge';
import { Info } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductDetailImageEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings, // Recibir themeSettings
    isLiveEdit = true
}) => {
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedStyles, isLiveEdit]);

    const theme = themeSettings || {};

    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="aspectRatio">
                    Relación de aspecto
                </Label>
                <Select
                    value={editStyles.aspectRatio || 'square'}
                    onValueChange={(value) => handleStyleChange('aspectRatio', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona relación de aspecto" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="square">Cuadrado (1:1)</SelectItem>
                        <SelectItem value="landscape">Horizontal (16:9)</SelectItem>
                        <SelectItem value="portrait">Vertical (4:5)</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                        <SelectItem value="theme">Usar valor del tema</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="imageBorder">
                        Borde
                    </Label>
                    <Select
                        value={editStyles.imageBorder || 'theme'}
                        onValueChange={(value) => handleStyleChange('imageBorder', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo de borde" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="theme">Usar configuración del tema</SelectItem>
                            <SelectItem value="none">Sin borde</SelectItem>
                            <SelectItem value="solid">Sólido</SelectItem>
                            <SelectItem value="dashed">Discontinuo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.imageBorder !== 'none' && editStyles.imageBorder !== 'theme' && (
                    <>
                        <div>
                            <Label htmlFor="imageBorderThickness">
                                Grosor del borde
                            </Label>
                            <Input
                                id="imageBorderThickness"
                                type="number"
                                value={parseInt(editStyles.imageBorderThickness) || parseInt(theme.image_border_thickness) || 0}
                                onChange={(e) => handleStyleChange('imageBorderThickness', e.target.value)}
                                placeholder="1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="imageBorderColor">
                                Color del borde
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="imageBorderColor"
                                    type="color"
                                    className="w-12 p-1 h-9"
                                    value={editStyles.imageBorderColor || '#000000'}
                                    onChange={(e) => handleStyleChange('imageBorderColor', e.target.value)}
                                />
                                <Input
                                    value={editStyles.imageBorderColor || '#000000'}
                                    onChange={(e) => handleStyleChange('imageBorderColor', e.target.value)}
                                    placeholder="#000000"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div>
                <Label htmlFor="imageBorderRadius">
                    Borde redondeado
                </Label>
                <Input
                    id="imageBorderRadius"
                    type="number"
                    value={parseInt(editStyles.imageBorderRadius) || parseInt(theme.image_border_radius) || parseInt(theme.border_radius) || 0}
                    onChange={(e) => handleStyleChange('imageBorderRadius', e.target.value)}
                    placeholder="0"
                />
                <div className="flex gap-2 mt-1">
                    <button
                        type="button"
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => handleStyleChange('imageBorderRadius', theme.image_border_radius || theme.border_radius || '8px')}
                    >
                        Usar valor del tema
                    </button>
                    <button
                        type="button"
                        className="text-xs text-gray-600 hover:text-gray-800"
                        onClick={() => handleStyleChange('imageBorderRadius', '0px')}
                    >
                        Sin bordes redondeados
                    </button>
                </div>
            </div>

            <div>
                <Label htmlFor="objectFit">
                    Ajuste de imagen
                </Label>
                <Select
                    value={editStyles.objectFit || theme.image_object_fit || 'cover'}
                    onValueChange={(value) => handleStyleChange('objectFit', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Ajuste de imagen" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cover">Cubrir</SelectItem>
                        <SelectItem value="contain">Contener</SelectItem>
                        <SelectItem value="fill">Rellenar</SelectItem>
                        <SelectItem value="theme">Usar valor del tema</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ProductDetailImageEditDialog;