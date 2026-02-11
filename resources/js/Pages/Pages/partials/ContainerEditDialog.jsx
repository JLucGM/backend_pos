// components/BuilderPages/partials/ContainerEditDialog.jsx

import React, { useState, useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';
import { Separator } from '@/Components/ui/separator';

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

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

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

            {/* ✅ SECCIÓN MEJORADA PARA FONDO */}
            <div className="space-y-2">
                <Label>Color de Fondo</Label>
                <Input
                    id="backgroundColor"
                    type="color"
                    value={editStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                />
            </div>

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