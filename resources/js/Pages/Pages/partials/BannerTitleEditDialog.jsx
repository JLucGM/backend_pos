import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const BannerTitleEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
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
                <Label htmlFor="titleContent">Título</Label>
                <Input
                    id="titleContent"
                    value={editContent}
                    onChange={(e) => updateContent(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="titleLayout">Layout</Label>
                <Select 
                    value={editStyles.layout || 'fit'} 
                    onValueChange={(value) => updateStyle('layout', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                        <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="titleAlignment">Alineación</Label>
                <Select 
                    value={editStyles.alignment || 'center'} 
                    onValueChange={(value) => updateStyle('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="titleColor">Color del Texto</Label>
                <Input
                    id="titleColor"
                    type="color"
                    value={editStyles.color || '#000000'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="titleFontSize">Tamaño de Fuente</Label>
                <Select 
                    value={editStyles.fontSize || '32px'} 
                    onValueChange={(value) => updateStyle('fontSize', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24px">24px</SelectItem>
                        <SelectItem value="32px">32px</SelectItem>
                        <SelectItem value="40px">40px</SelectItem>
                        <SelectItem value="48px">48px</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="titleFontWeight">Grosor de Fuente</Label>
                <Select 
                    value={editStyles.fontWeight || 'bold'} 
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Negrita</SelectItem>
                        <SelectItem value="600">Seminegrita</SelectItem>
                        <SelectItem value="800">Extranegrita</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default BannerTitleEditDialog;