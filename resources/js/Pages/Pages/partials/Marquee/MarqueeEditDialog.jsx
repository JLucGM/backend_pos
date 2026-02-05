// components/Builder/dialogs/MarqueeEditDialog.jsx
import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const MarqueeEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true,
}) => {
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
            {/* Texto del Marquee */}
            <div>
                <Label htmlFor="marquee-text">Texto del Marquee</Label>
                <Input
                    id="marquee-text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Ingresa el texto para el marquee..."
                />
            </div>

            {/* Selección de fuente */}
            <div>
                <Label htmlFor="fontType">Tipo de Fuente</Label>
                <Select
                    value={editStyles.fontType || 'body_font'}
                    onValueChange={(value) => updateStyle('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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

            {/* Velocidad */}
            <div>
                <Label htmlFor="marquee-speed">Velocidad (1-10)</Label>
                <Input
                    type="range"
                    id="marquee-speed"
                    value={editStyles.speed || 2}
                    onChange={(e) => updateStyle('speed', parseFloat(e.target.value))}
                    min="1"
                    max="10"
                    step="0.5"
                    className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                    Velocidad actual: {editStyles.speed || 2}
                </div>
            </div>

            {/* Dirección */}
            <div>
                <Label htmlFor="marquee-direction">Dirección</Label>
                <Select
                    value={editStyles.direction || 'left'}
                    onValueChange={(value) => updateStyle('direction', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda →</SelectItem>
                        <SelectItem value="right">← Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Layout */}
            <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                    value={editStyles.layout || 'fill'}
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

            {/* Tamaño de texto */}
            <div>
                <Label htmlFor="marquee-fontSize">Tamaño de texto</Label>
                <div className="flex gap-2">
                    <Input
                        id="marquee-fontSize"
                        type="number"
                        value={parseInt(editStyles.fontSize) || 16}
                        onChange={(e) => updateStyle('fontSize', e.target.value)}
                        placeholder="16"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles.fontSizeUnit || (editStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => updateStyle('fontSizeUnit', value)}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="px">px</SelectItem>
                            <SelectItem value="rem">rem</SelectItem>
                            <SelectItem value="em">em</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Grosor de texto */}
            <div>
                <Label htmlFor="marquee-fontWeight">Grosor del texto</Label>
                <Select
                    value={editStyles.fontWeight || 'normal'}
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Negrita</SelectItem>
                        <SelectItem value="600">Seminegrita</SelectItem>
                        <SelectItem value="300">Ligero</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Color de texto */}
            <div>
                <Label htmlFor="marquee-color">Color del texto</Label>
                <div className="flex gap-2">
                    <Input
                        id="marquee-color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        placeholder="#000000"
                    />
                    <Input
                        type="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            {/* Color de fondo */}
            <div>
                <Label htmlFor="marquee-backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        id="marquee-backgroundColor"
                        value={editStyles.backgroundColor || 'transparent'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        placeholder="transparent"
                    />
                    <Input
                        type="color"
                        value={editStyles.backgroundColor === 'transparent' ? '#ffffff' : editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            {/* Padding individual */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="marquee-paddingTop">Padding Superior</Label>
                    <Input
                        id="marquee-paddingTop"
                        type="number"
                        value={parseInt(editStyles.paddingTop) || 0}
                        onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label htmlFor="marquee-paddingBottom">Padding Inferior</Label>
                    <Input
                        id="marquee-paddingBottom"
                        type="number"
                        value={parseInt(editStyles.paddingBottom) || 0}
                        onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label htmlFor="marquee-paddingLeft">Padding Izquierdo</Label>
                    <Input
                        id="marquee-paddingLeft"
                        type="number"
                        value={parseInt(editStyles.paddingLeft) || 0}
                        onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div>
                    <Label htmlFor="marquee-paddingRight">Padding Derecho</Label>
                    <Input
                        id="marquee-paddingRight"
                        type="number"
                        value={parseInt(editStyles.paddingRight) || 0}
                        onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Border Radius */}
            <div>
                <Label htmlFor="marquee-borderRadius">Radio de Borde</Label>
                <Input
                    id="marquee-borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 0}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                    placeholder="0"
                />
            </div>

            {/* Interactivo */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="marquee-interactive"
                    checked={editStyles.interactive !== false}
                    onChange={(e) => updateStyle('interactive', e.target.checked)}
                    className="rounded border-gray-300"
                />
                <Label htmlFor="marquee-interactive">Interactivo (pausa al pasar el mouse)</Label>
            </div>
        </div>
    );
};

export default MarqueeEditDialog;