import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ProductDetailEditDialog = ({
    editStyles,
    setEditStyles,
    themeSettings
}) => {
    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para manejar el cambio del ancho como porcentaje
    const handleWidthChange = (value) => {
        setEditStyles(prev => ({
            ...prev,
            maxWidth: `${value}%`
        }));
    };

    // Obtener el valor numérico del ancho (sin el %)
    const getWidthValue = () => {
        const maxWidth = editStyles.maxWidth || '100%';
        if (maxWidth.includes('%')) {
            return parseInt(maxWidth) || 100;
        }
        // Si el valor está en px, convertirlo a un porcentaje aproximado
        // basado en que 1200px ≈ 100% en pantallas grandes
        if (maxWidth.includes('px')) {
            const pxValue = parseInt(maxWidth) || 1200;
            return Math.min(100, Math.floor((pxValue / 1200) * 100));
        }
        return 100;
    };

    const widthValue = getWidthValue();

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <Input 
                    id="backgroundColor"
                    type="color"
                    value={editStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="maxWidth">Ancho del contenedor ({widthValue}%)</Label>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">0%</span>
                        <input
                            id="maxWidth"
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={widthValue}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-500">100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input 
                            className="w-20"
                            type="number"
                            min="0"
                            max="100"
                            value={widthValue}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
                        />
                        <span className="text-sm text-gray-500">%</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    100% = Ancho total del navegador
                </p>
            </div>

            <div>
                <Label htmlFor="layoutType">Diseño</Label>
                <Select 
                    value={editStyles.layoutType || 'grid'} 
                    onValueChange={(value) => handleStyleChange('layoutType', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona diseño" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="grid">Grid (2 columnas)</SelectItem>
                        <SelectItem value="stack">Apilado vertical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.layoutType === 'grid' && (
                <div>
                    <Label htmlFor="gap">Espacio entre columnas (px)</Label>
                    <Input 
                        id="gap"
                        type="number"
                        value={parseInt(editStyles.gap) || 60}
                        onChange={(e) => handleStyleChange('gap', `${e.target.value}px`)}
                        placeholder="Ej: 60"
                    />
                </div>
            )}

            <div>
                <Label>Padding del contenedor (px)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 20}
                            onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 20}
                            onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 20}
                            onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 20}
                            onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailEditDialog;