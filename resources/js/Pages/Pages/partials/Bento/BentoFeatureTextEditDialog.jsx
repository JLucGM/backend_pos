import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const BentoFeatureTextEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const handleContentChange = (value) => {
        setEditContent(value);
    };

    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuración del Texto de Característica</h3>
            
            {/* Contenido del texto */}
            <div className="space-y-2">
                <Label htmlFor="featureText">Texto descriptivo</Label>
                <Textarea
                    id="featureText"
                    value={editContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Ingresa el texto descriptivo de la característica"
                    rows={4}
                />
            </div>

            {/* Color del texto */}
            <div className="space-y-2">
                <Label htmlFor="color">Color del texto</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="color"
                        type="color"
                        value={editStyles.color || '#6b7280'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-12 h-10"
                    />
                    <Input
                        type="text"
                        value={editStyles.color || '#6b7280'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        placeholder="#6b7280"
                    />
                </div>
            </div>

            {/* Tamaño de fuente */}
            <div className="space-y-2">
                <Label htmlFor="fontSize">Tamaño de fuente</Label>
                <Input
                    id="fontSize"
                    type="text"
                    value={editStyles.fontSize || '16px'}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="Ej: 16px"
                />
            </div>

            {/* Grosor de fuente */}
            <div className="space-y-2">
                <Label htmlFor="fontWeight">Grosor de fuente</Label>
                <Select
                    value={editStyles.fontWeight || 'normal'}
                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona grosor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Layout */}
            <div className="space-y-2">
                <Label htmlFor="layout">Layout</Label>
                <Select
                    value={editStyles.layout || 'fit'}
                    onValueChange={(value) => handleStyleChange('layout', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fit">Ajustar (fit)</SelectItem>
                        <SelectItem value="fill">Llenar (fill)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Alineación */}
            <div className="space-y-2">
                <Label htmlFor="alignment">Alineación del texto</Label>
                <Select
                    value={editStyles.alignment || 'left'}
                    onValueChange={(value) => handleStyleChange('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona alineación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                        <SelectItem value="justify">Justificado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default BentoFeatureTextEditDialog;