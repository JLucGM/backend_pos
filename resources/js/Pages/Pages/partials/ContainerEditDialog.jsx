// components/BuilderPages/partials/ContainerEditDialog.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { ImageIcon, X, Trash2, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import { Separator } from '@/Components/ui/separator';
import { ColorPicker } from '@/components/ui/color-picker';

const ContainerEditDialog = ({
    editStyles,
    setEditStyles,
    isLiveEdit = true,
    allImages = [],      // ✅ nuevas props
    page                 // ✅ nuevas props
}) => {
    const debouncedStyles = useDebounce(editStyles, 300);
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedStyles, isLiveEdit]);

    // ✅ Estados para gradiente - con valores por defecto
    const [gradientColors, setGradientColors] = useState(['#667eea', '#764ba2']);
    const [gradientAngle, setGradientAngle] = useState(45);

    const angleOptions = [
        { value: 0, label: '0° (derecha)' },
        { value: 45, label: '45°' },
        { value: 90, label: '90° (abajo)' },
        { value: 135, label: '135°' },
        { value: 180, label: '180° (izquierda)' },
        { value: 225, label: '225°' },
        { value: 270, label: '270° (arriba)' },
        { value: 315, label: '315°' }
    ];

    // Sincronizar gradiente desde editStyles
    useEffect(() => {
        if (editStyles.backgroundType === 'gradient' && editStyles.gradientColors) {
            try {
                const match = editStyles.gradientColors.match(/#[0-9a-fA-F]{6}/g);
                if (match && match.length >= 2) {
                    setGradientColors(match);
                }
                const angleMatch = editStyles.gradientColors.match(/(\d+)deg/);
                if (angleMatch && angleMatch[1]) {
                    setGradientAngle(parseInt(angleMatch[1]));
                }
            } catch (error) {
                console.error('Error parsing gradient:', error);
            }
        }
    }, [editStyles.backgroundType]);

    // Actualizar editStyles cuando cambian colores o ángulo
    useEffect(() => {
        if (editStyles.backgroundType === 'gradient') {
            const validColors = gradientColors.filter(color =>
                color && /^#[0-9a-fA-F]{6}$/.test(color)
            );

            if (validColors.length >= 2) {
                const colorsString = validColors.join(', ');
                const gradientString = `linear-gradient(${gradientAngle}deg, ${colorsString})`;

                if (editStyles.gradientColors !== gradientString) {
                    updateStyle('gradientColors', gradientString);
                }
            }
        }
    }, [gradientColors, gradientAngle]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Funciones para manejar gradientes
    const addColor = useCallback(() => {
        if (gradientColors.length < 5) {
            setGradientColors([...gradientColors, '#ffffff']);
        }
    }, [gradientColors]);

    const removeColor = useCallback((index) => {
        if (gradientColors.length > 2) {
            const newColors = [...gradientColors];
            newColors.splice(index, 1);
            setGradientColors(newColors);
        }
    }, [gradientColors]);

    const updateColor = useCallback((index, value) => {
        const newColors = [...gradientColors];
        newColors[index] = value;
        setGradientColors(newColors);
    }, [gradientColors]);

    // ✅ Manejar selección de imagen de fondo
    const handleBackgroundImageSelect = (imageData) => {
        updateStyle('backgroundImage', imageData.src);
        setIsImageSelectorOpen(false);
    };

    // ✅ Limpiar imagen de fondo
    const handleClearBackgroundImage = () => {
        updateStyle('backgroundImage', '');
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="backgroundType">Tipo de Fondo</Label>
                <Select
                    value={editStyles.backgroundType || 'color'}
                    onValueChange={(value) => updateStyle('backgroundType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="color">Color Sólido</SelectItem>
                        <SelectItem value="image">Imagen</SelectItem>
                        <SelectItem value="gradient">Gradiente</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.backgroundType === 'image' && (
                <div className="space-y-2">
                    <Label>Imagen de Fondo</Label>

                    {editStyles.backgroundImage ? (
                        <div className="relative border rounded-md overflow-hidden">
                            <img
                                src={editStyles.backgroundImage}
                                alt="Fondo del contenedor"
                                className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="w-8 h-8 bg-white/90 hover:bg-white"
                                        onClick={() => setIsImageSelectorOpen(true)}
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="w-8 h-8"
                                        onClick={handleClearBackgroundImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsImageSelectorOpen(true)}
                            >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Seleccionar imagen de fondo
                            </Button>
                        </div>
                    )}

                    {/* Input de respaldo para URL manual */}
                    <div className="mt-2">
                        <Label htmlFor="backgroundImageUrl" className="text-xs text-gray-500">
                            O ingresa una URL manualmente
                        </Label>
                        <Input
                            id="backgroundImageUrl"
                            value={editStyles.backgroundImage || ''}
                            onChange={(e) => updateStyle('backgroundImage', e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="mt-1"
                        />
                    </div>
                </div>
            )}

            {editStyles.backgroundType === 'color' && (
                <div className="space-y-2">
                    <Label>Color de Fondo</Label>
                    <ColorPicker
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(hex) => updateStyle('backgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>
            )}

            {editStyles.backgroundType === 'gradient' && (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="gradientAngle">Dirección del Gradiente</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {angleOptions.map((angle) => (
                                <Button
                                    key={angle.value}
                                    type="button"
                                    variant={gradientAngle === angle.value ? "default" : "outline"}
                                    className="text-xs h-8 px-1"
                                    onClick={() => setGradientAngle(angle.value)}
                                >
                                    {angle.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label>Colores del Gradiente</Label>
                            <span className="text-xs text-gray-500">
                                {gradientColors.length}/5 colores
                            </span>
                        </div>

                        {gradientColors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <div className="flex-1">
                                    <ColorPicker
                                        value={color}
                                        onChange={(hex) => updateColor(index, hex)}
                                        showOpacity={false}
                                    />
                                </div>

                                {gradientColors.length > 2 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeColor(index)}
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {gradientColors.length < 5 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addColor}
                                className="w-full mt-2"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Color
                            </Button>
                        )}
                    </div>

                    <div className="mt-4">
                        <Label>Vista Previa</Label>
                        <div
                            className="h-20 w-full rounded-md border border-gray-300 mt-2"
                            style={{
                                background: gradientColors.length >= 2
                                    ? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`
                                    : 'linear-gradient(45deg, #667eea, #764ba2)'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Border-Radius */}
            <div className="">
                <Label htmlFor="borderRadius">Radio de Borde</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 0}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                />
            </div>

            <Separator />

            <div className="">

                {/* Alignment */}
                <Label htmlFor="alignment">Alineación</Label>
                <Select
                    value={editStyles.alignment || 'left'}
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

            <div className="">

                {/* Dirección (Flex Direction) */}
                <Label htmlFor="direction">Dirección</Label>
                <Select
                    value={editStyles.direction || 'row'}
                    onValueChange={(value) => updateStyle('direction', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="row">Horizontal</SelectItem>
                        <SelectItem value="column">Vertical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="">
                {/* Gap entre elementos hijos */}
                <Label htmlFor="gap">Gap entre elementos</Label>
                <Input
                    id="gap"
                    type="number"
                    value={parseInt(editStyles.gap) || 0}
                    onChange={(e) => updateStyle('gap', e.target.value)}
                />
            </div>

            <div className="">
                {/* Padding Individual */}
                <Label>Padding</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 0}
                            onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 0}
                            onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 0}
                            onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 0}
                            onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        />
                    </div>
                </div>

                <div className="">
                    <Label>Margen</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="marginTop">Arriba</Label>
                            <Input
                                id="marginTop"
                                type="number"
                                value={parseInt(editStyles.marginTop) || 0}
                                onChange={(e) => updateStyle('marginTop', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginRight">Derecha</Label>
                            <Input
                                id="marginRight"
                                type="number"
                                value={parseInt(editStyles.marginRight) || 0}
                                onChange={(e) => updateStyle('marginRight', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginBottom">Abajo</Label>
                            <Input
                                id="marginBottom"
                                type="number"
                                value={parseInt(editStyles.marginBottom) || 0}
                                onChange={(e) => updateStyle('marginBottom', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginLeft">Izquierda</Label>
                            <Input
                                id="marginLeft"
                                type="number"
                                value={parseInt(editStyles.marginLeft) || 0}
                                onChange={(e) => updateStyle('marginLeft', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* ✅ Selector de imágenes unificado */}
            <ImageSelector
                open={isImageSelectorOpen}
                onOpenChange={setIsImageSelectorOpen}
                onSelectImage={handleBackgroundImageSelect}
                allImages={allImages}
                page={page}
            />
        </div>
    );
};

export default ContainerEditDialog;