import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const BentoTitleEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
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
            <h3 className="text-lg font-semibold">Configuración del Título</h3>
            
            {/* Contenido del título */}
            <div className="space-y-2">
                <Label htmlFor="title">Texto del título</Label>
                <Textarea
                    id="title"
                    value={editContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Ingresa el texto del título"
                    rows={3}
                />
            </div>

            {/* Color del texto */}
            <div className="space-y-2">
                <Label htmlFor="color">Color del texto</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="color"
                        type="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-12 h-10"
                    />
                    <Input
                        type="text"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        placeholder="#000000"
                    />
                </div>
            </div>

            {/* Tamaño de fuente */}
            <div className="space-y-2">
                <Label htmlFor="fontSize">Tamaño de fuente</Label>
                <Input
                    id="fontSize"
                    type="text"
                    value={editStyles.fontSize || '32px'}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="Ej: 32px"
                />
            </div>

            {/* Grosor de fuente */}
            <div className="space-y-2">
                <Label htmlFor="fontWeight">Grosor de fuente</Label>
                <Select
                    value={editStyles.fontWeight || 'bold'}
                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona grosor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semibold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="800">Extrabold</SelectItem>
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
                    value={editStyles.alignment || 'center'}
                    onValueChange={(value) => handleStyleChange('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona alineación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default BentoTitleEditDialog;