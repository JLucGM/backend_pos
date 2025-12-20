// components/BuilderPages/partials/ButtonEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';

const ButtonEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Extraer el texto del contenido (puede ser string u objeto)
    const getTextValue = () => {
        if (!editContent) return '';
        
        if (typeof editContent === 'string') {
            return editContent;
        }
        
        if (typeof editContent === 'object' && editContent !== null) {
            return editContent.text || editContent.title || '';
        }
        
        return String(editContent);
    };

    // Manejar cambio de texto
    const handleTextChange = (value) => {
        // Asegurarnos de que editContent siempre sea un string para botón
        setEditContent(value);
    };

    return (
        <div className="space-y-4">
            <Label htmlFor="content">Contenido</Label>
            <textarea
                id="content"
                value={getTextValue()} // Usar getTextValue en lugar de editContent directamente
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-20 p-2 border rounded"
            />

            {/* Selector de tipo de botón */}
            <Label htmlFor="buttonType">Tipo de Botón</Label>
            <Select
                value={editStyles.buttonType || 'primary'}
                onValueChange={(value) => updateStyle('buttonType', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de botón" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="primary">Primario (Usa estilos del tema)</SelectItem>
                    <SelectItem value="secondary">Secundario (Usa estilos del tema)</SelectItem>
                    <SelectItem value="custom">Personalizado (Ignora estilos del tema)</SelectItem>
                </SelectContent>
            </Select>

            {/* Solo mostrar opciones de personalización completas si el tipo es "custom" */}
            {editStyles.buttonType === 'custom' && (
                <>
                    {/* Layout */}
                    <Label htmlFor="layout">Layout</Label>
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

                    {/* Padding Individual */}
                    <Label>Padding (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop">Arriba</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editStyles.paddingTop) || 10}
                                onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editStyles.paddingRight) || 10}
                                onChange={(e) => updateStyle('paddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom">Abajo</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editStyles.paddingBottom) || 10}
                                onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editStyles.paddingLeft) || 10}
                                onChange={(e) => updateStyle('paddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    {/* Border-Radius */}
                    <Label htmlFor="borderRadius">Radio de Borde (px)</Label>
                    <Input
                        id="borderRadius"
                        type="number"
                        value={parseInt(editStyles.borderRadius) || 4}
                        onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                    />

                    {/* Tamaño de fuente */}
                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                    <Input
                        id="fontSize"
                        value={editStyles.fontSize || '16px'}
                        onChange={(e) => updateStyle('fontSize', e.target.value)}
                        placeholder="16px"
                    />

                    {/* Color de Texto */}
                    <Label htmlFor="color">Color de Texto</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            value={editStyles.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.color || '#ffffff'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Color de Fondo */}
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="backgroundColor"
                            value={editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            placeholder="#007bff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Color de Borde */}
                    <Label htmlFor="borderColor">Color de Borde</Label>
                    <div className="flex gap-2">
                        <Input
                            id="borderColor"
                            value={editStyles.borderColor || editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('borderColor', e.target.value)}
                            placeholder="#007bff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.borderColor || editStyles.backgroundColor || '#007bff'}
                            onChange={(e) => updateStyle('borderColor', e.target.value)}
                            className="w-12"
                        />
                    </div>

                    {/* Grosor del Borde */}
                    <Label htmlFor="borderWidth">Grosor del Borde (px)</Label>
                    <Input
                        id="borderWidth"
                        type="number"
                        value={parseInt(editStyles.borderWidth) || 1}
                        onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
                    />

                    {/* Text Transform */}
                    <Label htmlFor="textTransform">Transformación de Texto</Label>
                    <Select
                        value={editStyles.textTransform || 'none'}
                        onValueChange={(value) => updateStyle('textTransform', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Normal</SelectItem>
                            <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                            <SelectItem value="lowercase">minúsculas</SelectItem>
                            <SelectItem value="capitalize">Capitalizar</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Estilos de Hover (solo para custom) */}
                    <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Estilos de Hover</h4>

                        <Label htmlFor="hoverColor">Color de Texto (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverColor"
                                value={editStyles.hoverColor || ''}
                                onChange={(e) => updateStyle('hoverColor', e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverColor || '#ffffff'}
                                onChange={(e) => updateStyle('hoverColor', e.target.value)}
                                className="w-12"
                            />
                        </div>

                        <Label htmlFor="hoverBackgroundColor">Color de Fondo (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverBackgroundColor"
                                value={editStyles.hoverBackgroundColor || ''}
                                onChange={(e) => updateStyle('hoverBackgroundColor', e.target.value)}
                                placeholder="#0056b3"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverBackgroundColor || '#0056b3'}
                                onChange={(e) => updateStyle('hoverBackgroundColor', e.target.value)}
                                className="w-12"
                            />
                        </div>

                        <Label htmlFor="hoverBorderColor">Color de Borde (Hover)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="hoverBorderColor"
                                value={editStyles.hoverBorderColor || ''}
                                onChange={(e) => updateStyle('hoverBorderColor', e.target.value)}
                                placeholder="#0056b3"
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.hoverBorderColor || '#0056b3'}
                                onChange={(e) => updateStyle('hoverBorderColor', e.target.value)}
                                className="w-12"
                            />
                        </div>
                    </div>
                    <Separator className="my-4" />
                </>
            )}

            {/* Selección de fuente (para todos los tipos de botón) */}
            <div>
                <Label htmlFor="fontType">Tipo de Fuente</Label>
                <Select
                    value={editStyles.fontType || 'default'}
                    onValueChange={(value) => updateStyle('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            Por defecto (usar fuente del tema)
                        </SelectItem>
                        <SelectItem value="body_font">
                            Body Font ({themeSettings?.body_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="heading_font">
                            Heading Font ({themeSettings?.heading_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="subheading_font">
                            Subheading Font ({themeSettings?.subheading_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="accent_font">
                            Accent Font ({themeSettings?.accent_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.fontType === 'custom' && (
                <div>
                    <Label htmlFor="customFont">Fuente Personalizada</Label>
                    <Input
                        id="customFont"
                        value={editStyles.customFont || ''}
                        onChange={(e) => updateStyle('customFont', e.target.value)}
                        placeholder="'Roboto', sans-serif"
                    />
                </div>
            )}

            {/* Si es primary o secondary, mostrar solo las opciones que pueden sobrescribir */}
            {(editStyles.buttonType === 'primary' || editStyles.buttonType === 'secondary') && (
                <div className="space-y-4">
                    {/* Opciones de sobrescritura específicas */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="customBorderRadius">Radio de Borde Personalizado</Label>
                            <Input
                                id="customBorderRadius"
                                placeholder="Ej: 8px"
                                value={editStyles.customBorderRadius || ''}
                                onChange={(e) => updateStyle('customBorderRadius', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="customFontSize">Tamaño de Fuente Personalizado</Label>
                            <Input
                                id="customFontSize"
                                placeholder="Ej: 18px"
                                value={editStyles.customFontSize || ''}
                                onChange={(e) => updateStyle('customFontSize', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonEditDialog;