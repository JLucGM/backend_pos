import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const BentoEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const handleContentChange = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración del Bento</h3>
            
            {/* Configuración del grid */}
            <div className="space-y-2">
                <Label htmlFor="gridColumns">Columnas del grid</Label>
                <Select
                    value={editContent.gridColumns?.toString() || '2'}
                    onValueChange={(value) => handleContentChange('gridColumns', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona columnas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 columna</SelectItem>
                        <SelectItem value="2">2 columnas</SelectItem>
                        <SelectItem value="3">3 columnas</SelectItem>
                        <SelectItem value="4">4 columnas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Espaciado entre características */}
            <div className="space-y-2">
                <Label htmlFor="gridGap">Espaciado entre características</Label>
                <Input
                    id="gridGap"
                    type="text"
                    value={editContent.gridGap || '20px'}
                    onChange={(e) => handleContentChange('gridGap', e.target.value)}
                    placeholder="Ej: 20px"
                />
            </div>

            {/* Color de fondo del contenedor */}
            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo del contenedor</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={editContent.backgroundColor || '#ffffff'}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        className="w-12 h-10"
                    />
                    <Input
                        type="text"
                        value={editContent.backgroundColor || '#ffffff'}
                        onChange={(e) => handleContentChange('backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                    />
                </div>
            </div>

            {/* Border radius del contenedor */}
            <div className="space-y-2">
                <Label htmlFor="containerBorderRadius">Border radius del contenedor</Label>
                <Input
                    id="containerBorderRadius"
                    type="text"
                    value={editContent.containerBorderRadius || '0px'}
                    onChange={(e) => handleContentChange('containerBorderRadius', e.target.value)}
                    placeholder="Ej: 8px"
                />
            </div>

            {/* Configuración del border del contenedor */}
            <div className="space-y-2">
                <Label>Border del contenedor</Label>
                <Select
                    value={editContent.containerBorder || 'none'}
                    onValueChange={(value) => handleContentChange('containerBorder', value)}
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

            {editContent.containerBorder === 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="containerBorderThickness">Grosor del border</Label>
                        <Input
                            id="containerBorderThickness"
                            type="text"
                            value={editContent.containerBorderThickness || '1px'}
                            onChange={(e) => handleContentChange('containerBorderThickness', e.target.value)}
                            placeholder="Ej: 1px"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="containerBorderColor">Color del border</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="containerBorderColor"
                                type="color"
                                value={editContent.containerBorderColor || '#e5e7eb'}
                                onChange={(e) => handleContentChange('containerBorderColor', e.target.value)}
                                className="w-12 h-10"
                            />
                            <Input
                                type="text"
                                value={editContent.containerBorderColor || '#e5e7eb'}
                                onChange={(e) => handleContentChange('containerBorderColor', e.target.value)}
                                placeholder="#e5e7eb"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BentoEditDialog;