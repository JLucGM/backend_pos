// components/BuilderPages/LinkBio/LinkBioEditDialog.jsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';
import { ImageIcon, Plus, Trash2, X } from 'lucide-react';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';

const LinkBioEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true,
    allImages = [],
    page
}) => {
    const [localContent, setLocalContent] = useState(editContent || {});
    const [localStyles, setLocalStyles] = useState(editStyles || {});
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

    // Estados para gradiente - con valores por defecto
    const [gradientColors, setGradientColors] = useState(['#667eea', '#764ba2']);
    const [gradientAngle, setGradientAngle] = useState(45);

    // Ángulos predefinidos
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

    // Inicializar solo una vez cuando cambia el contenido del gradiente
    useEffect(() => {
        if (localContent.backgroundType === 'gradient' && localContent.gradientColors) {
            try {
                // Extraer colores del gradiente existente
                const match = localContent.gradientColors.match(/#[0-9a-fA-F]{6}/g);
                if (match && match.length >= 2) {
                    setGradientColors(match);
                }

                // Extraer ángulo del gradiente existente
                const angleMatch = localContent.gradientColors.match(/(\d+)deg/);
                if (angleMatch && angleMatch[1]) {
                    setGradientAngle(parseInt(angleMatch[1]));
                }
            } catch (error) {
                console.error('Error parsing gradient:', error);
            }
        }
    }, [localContent.backgroundType]); // Solo cuando cambia el tipo de fondo

    // Efecto para actualizar el contenido cuando cambian los colores o el ángulo
    useEffect(() => {
        if (localContent.backgroundType === 'gradient') {
            const validColors = gradientColors.filter(color =>
                color && /^#[0-9a-fA-F]{6}$/.test(color)
            );

            if (validColors.length >= 2) {
                const colorsString = validColors.join(', ');
                const gradientString = `linear-gradient(${gradientAngle}deg, ${colorsString})`;

                // Solo actualizar si realmente cambió
                if (localContent.gradientColors !== gradientString) {
                    updateContent('gradientColors', gradientString);
                }
            }
        }
    }, [gradientColors, gradientAngle]); // Solo cuando cambian colores o ángulo

    // Sincronizar cambios del padre
    useEffect(() => {
        if (editContent) {
            setLocalContent(editContent);
        }
    }, [editContent]);

    useEffect(() => {
        if (editStyles) {
            setLocalStyles(editStyles);
        }
    }, [editStyles]);

    // Sincronizar cambios locales con el padre
    useEffect(() => {
        if (isLiveEdit) {
            setEditContent(localContent);
            setEditStyles(localStyles);
        }
    }, [localContent, localStyles, isLiveEdit, setEditContent, setEditStyles]);

    const updateContent = (key, value) => {
        setLocalContent(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key, value) => {
        setLocalStyles(prev => ({ ...prev, [key]: value }));
    };

    // Funciones para manejar gradientes
    const addColor = () => {
        if (gradientColors.length < 5) {
            setGradientColors([...gradientColors, '#ffffff']);
        }
    };

    const removeColor = (index) => {
        if (gradientColors.length > 2) {
            const newColors = [...gradientColors];
            newColors.splice(index, 1);
            setGradientColors(newColors);
        }
    };

    const updateColor = (index, value) => {
        const newColors = [...gradientColors];
        newColors[index] = value;
        setGradientColors(newColors);
    };

    // Funciones para manejar selección de imagen
    const handleBackgroundImageSelect = (imageData) => {
        updateContent('backgroundImage', imageData.src);
        // Opcional: también podríamos guardar metadata como product_id, media_id, etc.
        setIsImageSelectorOpen(false);
    };

    const handleClearBackgroundImage = () => {
        updateContent('backgroundImage', '');
    };

    return (
        <div className="space-y-4">

            <div>
                <Label htmlFor="maxWidth">Ancho Máximo del Contenido (px)</Label>
                <Input
                    id="maxWidth"
                    type="number"
                    value={parseInt(localContent.maxWidth) || 400}
                    onChange={(e) => updateContent('maxWidth', e.target.value)}
                    min="200"
                    max="800"
                />
                <p className="text-xs text-gray-500 mt-1">Entre 200px y 800px</p>
            </div>

            <div>
                <Label htmlFor="buttonsGap">Espaciado entre Elementos (px)</Label>
                <Input
                    id="buttonsGap"
                    type="number"
                    value={parseInt(localContent.buttonsGap) || 16}
                    onChange={(e) => updateContent('buttonsGap', e.target.value)}
                    min="0"
                    max="50"
                />
            </div>

            <Separator />

            <div>
                <Label htmlFor="backgroundType">Tipo de Fondo</Label>
                <Select
                    value={localContent.backgroundType || 'color'}
                    onValueChange={(value) => updateContent('backgroundType', value)}
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

            {localContent.backgroundType === 'color' && (
                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="backgroundColor"
                            value={localContent.backgroundColor || '#ffffff'}
                            onChange={(e) => updateContent('backgroundColor', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={localContent.backgroundColor || '#ffffff'}
                            onChange={(e) => updateContent('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>
            )}

            {localContent.backgroundType === 'image' && (
                <>
                    <div className="space-y-2">
                        <Label>Imagen de Fondo</Label>

                        {localContent.backgroundImage ? (
                            <div className="relative border rounded-md overflow-hidden">
                                <img
                                    src={localContent.backgroundImage}
                                    alt="Fondo del link bio"
                                    className="w-full h-32 object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
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
                                value={localContent.backgroundImage || ''}
                                onChange={(e) => updateContent('backgroundImage', e.target.value)}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="backgroundImage">URL de la Imagen</Label>
                        <Input
                            id="backgroundImage"
                            value={localContent.backgroundImage || ''}
                            onChange={(e) => updateContent('backgroundImage', e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            También puedes usar imágenes de <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer" className="text-blue-500">Lorem Picsum</a> como: https://picsum.photos/1200/800
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="imageFilter">Filtro de Imagen</Label>
                        <Select
                            value={localContent.imageFilter || 'none'}
                            onValueChange={(value) => updateContent('imageFilter', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                <SelectItem value="darken">Oscurecer (70%)</SelectItem>
                                <SelectItem value="lighten">Aclarar (130%)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="imageOverlay">Overlay</Label>
                        <Select
                            value={localContent.imageOverlay || 'none'}
                            onValueChange={(value) => updateContent('imageOverlay', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Ninguno</SelectItem>
                                <SelectItem value="darken">Overlay Oscuro (50%)</SelectItem>
                                <SelectItem value="lighten">Overlay Claro (50%)</SelectItem>
                                <SelectItem value="gradient-dark">Gradiente Oscuro</SelectItem>
                                <SelectItem value="gradient-light">Gradiente Claro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="backgroundSize">Tamaño de Imagen</Label>
                        <Select
                            value={localContent.backgroundSize || 'cover'}
                            onValueChange={(value) => updateContent('backgroundSize', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cover">Cubrir (Cover)</SelectItem>
                                <SelectItem value="contain">Contener (Contain)</SelectItem>
                                <SelectItem value="auto">Automático</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {localContent.backgroundType === 'gradient' && (
                <div className="space-y-4">
                    {/* Ángulo del gradiente */}
                    <div>
                        <Label htmlFor="gradientAngle">Dirección del Gradiente</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {angleOptions.map((angle) => (
                                <Button
                                    key={angle.value}
                                    type="button"
                                    variant={gradientAngle === angle.value ? "default" : "outline"}
                                    className="text-xs h-8"
                                    onClick={() => setGradientAngle(angle.value)}
                                >
                                    {angle.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Colores del gradiente */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label>Colores del Gradiente</Label>
                            <span className="text-xs text-gray-500">
                                {gradientColors.length}/5 colores
                            </span>
                        </div>

                        {gradientColors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        type="color"
                                        value={color}
                                        onChange={(e) => updateColor(index, e.target.value)}
                                        className="w-12 h-10 p-1"
                                    />
                                    <Input
                                        value={color}
                                        onChange={(e) => updateColor(index, e.target.value)}
                                        placeholder="#000000"
                                        className="flex-1"
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

                    {/* Vista previa del gradiente */}
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
                        <p className="text-xs text-gray-500 mt-1">
                            {gradientColors.length >= 2
                                ? `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`
                                : 'Se necesitan al menos 2 colores'}
                        </p>
                    </div>

                    {/* Gradientes predefinidos */}
                    <div className="mt-4">
                        <Label>Gradientes Predefinidos</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="text-xs h-10"
                                onClick={() => {
                                    setGradientColors(['#667eea', '#764ba2']);
                                    setGradientAngle(45);
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] mr-2" />
                                Púrpura
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="text-xs h-10"
                                onClick={() => {
                                    setGradientColors(['#f093fb', '#f5576c']);
                                    setGradientAngle(45);
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#f093fb] to-[#f5576c] mr-2" />
                                Rosa
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="text-xs h-10"
                                onClick={() => {
                                    setGradientColors(['#4facfe', '#00f2fe']);
                                    setGradientAngle(45);
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#4facfe] to-[#00f2fe] mr-2" />
                                Azul
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="text-xs h-10"
                                onClick={() => {
                                    setGradientColors(['#43e97b', '#38f9d7']);
                                    setGradientAngle(45);
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#43e97b] to-[#38f9d7] mr-2" />
                                Verde
                            </Button>
                        </div>
                    </div>
                </div>
            )}
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

export default LinkBioEditDialog;