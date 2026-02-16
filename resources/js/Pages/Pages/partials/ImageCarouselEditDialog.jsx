import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { Switch } from '@/Components/ui/switch';
import { Plus, X, ImageIcon, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';

const ImageCarouselEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    allImages,
    page,
}) => {
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const images = editContent.images || [];

    const updateCarouselConfig = (key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Agregar nueva imagen
    const handleAddImage = () => {
        if (images.length >= 9) {
            alert('Máximo 9 imágenes permitidas');
            return;
        }
        setSelectedImageIndex(null);
        setIsImageSelectorOpen(true);
    };

    // Editar imagen existente (cambiar src)
    const handleEditImage = (index) => {
        setSelectedImageIndex(index);
        setIsImageSelectorOpen(true);
    };

    // Seleccionar imagen desde el selector
    const handleImageSelect = (imageData) => {
        const imageSrc = imageData.url || imageData.src;
        if (selectedImageIndex === null) {
            const newImages = [...images, {
                src: imageSrc,
                title: '',
                text: '',
            }];
            setEditContent(prev => ({ ...prev, images: newImages }));
        } else {
            const newImages = [...images];
            newImages[selectedImageIndex] = {
                ...newImages[selectedImageIndex],
                src: imageSrc,
            };
            setEditContent(prev => ({ ...prev, images: newImages }));
        }
        setIsImageSelectorOpen(false);
    };

    // Eliminar imagen
    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setEditContent(prev => ({ ...prev, images: newImages }));
    };

    // Actualizar título o texto de una imagen
    const handleImageFieldChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;
        setEditContent(prev => ({ ...prev, images: newImages }));
    };

    // Reordenar imágenes
    const moveImage = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newImages = [...images];
            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
            setEditContent(prev => ({ ...prev, images: newImages }));
        } else if (direction === 'down' && index < images.length - 1) {
            const newImages = [...images];
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
            setEditContent(prev => ({ ...prev, images: newImages }));
        }
    };

    // Renderizar controles de tipografía para título
    const renderTitleTypography = () => {
        const textStyle = editContent.titleTextStyle || 'heading3';
        const fontSize = editContent.titleFontSize || (textStyle === 'custom' ? '20' : themeSettings?.[`${textStyle}_fontSize`]?.replace('px', '') || '20');
        const fontSizeUnit = editContent.titleFontSizeUnit || (editContent.titleFontSize?.toString().includes('rem') ? 'rem' : 'px');
        const fontWeight = editContent.titleFontWeight || 'bold';
        const lineHeight = editContent.titleLineHeight || '1.2';
        const textTransform = editContent.titleTextTransform || 'none';
        const fontType = editContent.titleFontType || 'default';
        const customFont = editContent.titleCustomFont || '';
        const color = editContent.titleColor || '#000000';
        const customLineHeight = editContent.titleCustomLineHeight || '';

        return (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const defaults = {
                                titleTextStyle: 'heading3',
                                titleFontSize: themeSettings?.heading3_fontSize?.replace('px', '') || '20',
                                titleFontSizeUnit: 'px',
                                titleFontWeight: 'bold',
                                titleLineHeight: '1.2',
                                titleTextTransform: 'none',
                                titleFontType: 'default',
                                titleCustomFont: '',
                                titleColor: '#000000',
                                titleCustomLineHeight: '',
                            };
                            Object.keys(defaults).forEach(key => {
                                updateCarouselConfig(key, defaults[key]);
                            });
                        }}
                    >
                        <RotateCcw size={14} className="mr-1" /> Restablecer
                    </Button>
                </div>

                <div>
                    <Label>Estilo de texto</Label>
                    <Select
                        value={textStyle}
                        onValueChange={(val) => {
                            updateCarouselConfig('titleTextStyle', val);
                            if (val !== 'custom' && themeSettings) {
                                updateCarouselConfig('titleFontSize', themeSettings[`${val}_fontSize`]?.replace('px', '') || '20');
                                updateCarouselConfig('titleFontWeight', themeSettings[`${val}_fontWeight`] || 'bold');
                                updateCarouselConfig('titleLineHeight', themeSettings[`${val}_lineHeight`] || '1.2');
                                updateCarouselConfig('titleTextTransform', themeSettings[`${val}_textTransform`] || 'none');
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="heading1">Heading 1</SelectItem>
                            <SelectItem value="heading2">Heading 2</SelectItem>
                            <SelectItem value="heading3">Heading 3</SelectItem>
                            <SelectItem value="heading4">Heading 4</SelectItem>
                            <SelectItem value="paragraph">Párrafo</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {textStyle === 'custom' && (
                    <>
                        <div>
                            <Label>Tamaño de fuente</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => updateCarouselConfig('titleFontSize', e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    value={fontSizeUnit}
                                    onValueChange={(val) => updateCarouselConfig('titleFontSizeUnit', val)}
                                >
                                    <SelectTrigger className="w-24">
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

                        <div>
                            <Label>Peso de fuente</Label>
                            <Select
                                value={fontWeight}
                                onValueChange={(val) => updateCarouselConfig('titleFontWeight', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="bold">Negrita</SelectItem>
                                    <SelectItem value="600">Seminegrita</SelectItem>
                                    <SelectItem value="300">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Altura de línea</Label>
                            <Select
                                value={lineHeight}
                                onValueChange={(val) => {
                                    updateCarouselConfig('titleLineHeight', val);
                                    if (val !== 'custom') {
                                        updateCarouselConfig('titleCustomLineHeight', '');
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tight">Tight (1.2)</SelectItem>
                                    <SelectItem value="normal">Normal (1.4)</SelectItem>
                                    <SelectItem value="loose">Loose (1.6)</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                            {lineHeight === 'custom' && (
                                <Input
                                    type="text"
                                    value={customLineHeight}
                                    onChange={(e) => updateCarouselConfig('titleCustomLineHeight', e.target.value)}
                                    placeholder="ej. 1.8, 2"
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div>
                            <Label>Transformación de texto</Label>
                            <Select
                                value={textTransform}
                                onValueChange={(val) => updateCarouselConfig('titleTextTransform', val)}
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
                        </div>
                    </>
                )}

                <div>
                    <Label>Tipo de fuente</Label>
                    <Select
                        value={fontType}
                        onValueChange={(val) => updateCarouselConfig('titleFontType', val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Por defecto (tema)</SelectItem>
                            <SelectItem value="body_font">Body Font</SelectItem>
                            <SelectItem value="heading_font">Heading Font</SelectItem>
                            <SelectItem value="subheading_font">Subheading Font</SelectItem>
                            <SelectItem value="accent_font">Accent Font</SelectItem>
                            <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {fontType === 'custom' && (
                    <div>
                        <Label>Fuente personalizada</Label>
                        <Input
                            value={customFont}
                            onChange={(e) => updateCarouselConfig('titleCustomFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                        />
                    </div>
                )}

                <div>
                    <Label>Color del texto</Label>
                    <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateCarouselConfig('titleColor', e.target.value)}
                    />
                </div>
            </div>
        );
    };

    // Renderizar controles de tipografía para texto
    const renderTextTypography = () => {
        const textStyle = editContent.textTextStyle || 'paragraph';
        const fontSize = editContent.textFontSize || (textStyle === 'custom' ? '14' : themeSettings?.[`${textStyle}_fontSize`]?.replace('px', '') || '14');
        const fontSizeUnit = editContent.textFontSizeUnit || (editContent.textFontSize?.toString().includes('rem') ? 'rem' : 'px');
        const fontWeight = editContent.textFontWeight || 'normal';
        const lineHeight = editContent.textLineHeight || '1.6';
        const textTransform = editContent.textTextTransform || 'none';
        const fontType = editContent.textFontType || 'default';
        const customFont = editContent.textCustomFont || '';
        const color = editContent.textColor || '#666666';
        const customLineHeight = editContent.textCustomLineHeight || '';

        return (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const defaults = {
                                textTextStyle: 'paragraph',
                                textFontSize: themeSettings?.paragraph_fontSize?.replace('px', '') || '14',
                                textFontSizeUnit: 'px',
                                textFontWeight: 'normal',
                                textLineHeight: '1.6',
                                textTextTransform: 'none',
                                textFontType: 'default',
                                textCustomFont: '',
                                textColor: '#666666',
                                textCustomLineHeight: '',
                            };
                            Object.keys(defaults).forEach(key => {
                                updateCarouselConfig(key, defaults[key]);
                            });
                        }}
                    >
                        <RotateCcw size={14} className="mr-1" /> Restablecer
                    </Button>
                </div>

                <div>
                    <Label>Estilo de texto</Label>
                    <Select
                        value={textStyle}
                        onValueChange={(val) => {
                            updateCarouselConfig('textTextStyle', val);
                            if (val !== 'custom' && themeSettings) {
                                updateCarouselConfig('textFontSize', themeSettings[`${val}_fontSize`]?.replace('px', '') || '14');
                                updateCarouselConfig('textFontWeight', themeSettings[`${val}_fontWeight`] || 'normal');
                                updateCarouselConfig('textLineHeight', themeSettings[`${val}_lineHeight`] || '1.6');
                                updateCarouselConfig('textTextTransform', themeSettings[`${val}_textTransform`] || 'none');
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paragraph">Párrafo</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {textStyle === 'custom' && (
                    <>
                        <div>
                            <Label>Tamaño de fuente</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => updateCarouselConfig('textFontSize', e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    value={fontSizeUnit}
                                    onValueChange={(val) => updateCarouselConfig('textFontSizeUnit', val)}
                                >
                                    <SelectTrigger className="w-24">
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

                        <div>
                            <Label>Peso de fuente</Label>
                            <Select
                                value={fontWeight}
                                onValueChange={(val) => updateCarouselConfig('textFontWeight', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="bold">Negrita</SelectItem>
                                    <SelectItem value="600">Seminegrita</SelectItem>
                                    <SelectItem value="300">Light</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Altura de línea</Label>
                            <Select
                                value={lineHeight}
                                onValueChange={(val) => {
                                    updateCarouselConfig('textLineHeight', val);
                                    if (val !== 'custom') {
                                        updateCarouselConfig('textCustomLineHeight', '');
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tight">Tight (1.2)</SelectItem>
                                    <SelectItem value="normal">Normal (1.4)</SelectItem>
                                    <SelectItem value="loose">Loose (1.6)</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                            {lineHeight === 'custom' && (
                                <Input
                                    type="text"
                                    value={customLineHeight}
                                    onChange={(e) => updateCarouselConfig('textCustomLineHeight', e.target.value)}
                                    placeholder="ej. 1.8, 2"
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div>
                            <Label>Transformación de texto</Label>
                            <Select
                                value={textTransform}
                                onValueChange={(val) => updateCarouselConfig('textTextTransform', val)}
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
                        </div>
                    </>
                )}

                <div>
                    <Label>Tipo de fuente</Label>
                    <Select
                        value={fontType}
                        onValueChange={(val) => updateCarouselConfig('textFontType', val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Por defecto (tema)</SelectItem>
                            <SelectItem value="body_font">Body Font</SelectItem>
                            <SelectItem value="heading_font">Heading Font</SelectItem>
                            <SelectItem value="subheading_font">Subheading Font</SelectItem>
                            <SelectItem value="accent_font">Accent Font</SelectItem>
                            <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {fontType === 'custom' && (
                    <div>
                        <Label>Fuente personalizada</Label>
                        <Input
                            value={customFont}
                            onChange={(e) => updateCarouselConfig('textCustomFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                        />
                    </div>
                )}

                <div>
                    <Label>Color del texto</Label>
                    <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateCarouselConfig('textColor', e.target.value)}
                    />
                </div>
            </div>
        );
    };

    // Renderizar controles de tarjeta
    const renderCardControls = () => {
        const padding = editContent.cardPadding || '16px';
        const borderWidth = editContent.cardBorderWidth || '0';
        const borderStyle = editContent.cardBorderStyle || 'solid';
        const borderColor = editContent.cardBorderColor || '#cccccc';
        const borderRadius = editContent.cardBorderRadius || '8';
        const backgroundColor = editContent.cardBackgroundColor || '#ffffff';
        const shadow = editContent.cardShadow || 'none';
        const displayMode = editContent.displayMode || 'card';
        const aspectRatio = editContent.aspectRatio || 'square';

        return (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            updateCarouselConfig('cardPadding', '16px');
                            updateCarouselConfig('cardBorderWidth', '0');
                            updateCarouselConfig('cardBorderStyle', 'solid');
                            updateCarouselConfig('cardBorderColor', '#cccccc');
                            updateCarouselConfig('cardBorderRadius', '8');
                            updateCarouselConfig('cardBackgroundColor', '#ffffff');
                            updateCarouselConfig('cardShadow', 'none');
                            updateCarouselConfig('displayMode', 'card');
                            updateCarouselConfig('aspectRatio', 'square');
                        }}
                    >
                        <RotateCcw size={14} className="mr-1" /> Restablecer
                    </Button>
                </div>

                <div>
                    <Label>Modo de visualización</Label>
                    <Select
                        value={displayMode}
                        onValueChange={(val) => updateCarouselConfig('displayMode', val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="card">Debajo de la imagen (tarjeta)</SelectItem>
                            <SelectItem value="overlay">Sobre la imagen (overlay)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Aspect Ratio</Label>
                    <Select
                        value={aspectRatio}
                        onValueChange={(val) => updateCarouselConfig('aspectRatio', val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="square">Cuadrado (1:1)</SelectItem>
                            <SelectItem value="landscape">Paisaje (16:9)</SelectItem>
                            <SelectItem value="portrait">Retrato (4:5)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Padding (px)</Label>
                    <Input
                        type="text"
                        value={padding}
                        onChange={(e) => updateCarouselConfig('cardPadding', e.target.value)}
                        placeholder="16px"
                    />
                </div>

                <div>
                    <Label>Ancho del borde (px)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={parseInt(borderWidth) || 0}
                        onChange={(e) => updateCarouselConfig('cardBorderWidth', e.target.value)}
                    />
                </div>

                {parseInt(borderWidth) > 0 && (
                    <>
                        <div>
                            <Label>Estilo del borde</Label>
                            <Select
                                value={borderStyle}
                                onValueChange={(val) => updateCarouselConfig('cardBorderStyle', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solid">Sólido</SelectItem>
                                    <SelectItem value="dashed">Discontinuo</SelectItem>
                                    <SelectItem value="dotted">Punteado</SelectItem>
                                    <SelectItem value="double">Doble</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Color del borde</Label>
                            <Input
                                type="color"
                                value={borderColor}
                                onChange={(e) => updateCarouselConfig('cardBorderColor', e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div>
                    <Label>Radio de borde (px)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={parseInt(borderRadius) || 8}
                        onChange={(e) => updateCarouselConfig('cardBorderRadius', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Color de fondo</Label>
                    <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => updateCarouselConfig('cardBackgroundColor', e.target.value)}
                    />
                </div>

                <div>
                    <Label>Sombra</Label>
                    <Select
                        value={shadow}
                        onValueChange={(val) => updateCarouselConfig('cardShadow', val)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin sombra</SelectItem>
                            <SelectItem value="0 1px 3px rgba(0,0,0,0.12)">Pequeña</SelectItem>
                            <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Mediana</SelectItem>
                            <SelectItem value="0 10px 15px rgba(0,0,0,0.1)">Grande</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Gestión de imágenes */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">Imágenes ({images.length}/9)</h3>
                    <Button size="sm" onClick={handleAddImage} disabled={images.length >= 9}>
                        <Plus size={16} className="mr-2" /> Agregar imagen
                    </Button>
                </div>

                <ScrollArea className="h-80">
                    {images.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border rounded-lg">
                            No hay imágenes. Haz clic en "Agregar imagen" para empezar.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start gap-4">
                                        
                                        <div className="flex flex-col items-center gap-2">

                                        {/* Miniatura */}
                                        <div className="w-20 h-20 mx-auto flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                            {img.src ? (
                                                <img src={img.src} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Campos de título y texto */}
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Título"
                                                value={img.title || ''}
                                                onChange={(e) => handleImageFieldChange(idx, 'title', e.target.value)}
                                                />
                                            <Input
                                                placeholder="Texto"
                                                value={img.text || ''}
                                                onChange={(e) => handleImageFieldChange(idx, 'text', e.target.value)}
                                                />
                                                </div>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => moveImage(idx, 'up')}
                                                disabled={idx === 0}
                                            >
                                                <ChevronUp size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => moveImage(idx, 'down')}
                                                disabled={idx === images.length - 1}
                                            >
                                                <ChevronDown size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditImage(idx)}
                                            >
                                                <ImageIcon size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            <Separator />

            {/* Configuración del carrusel */}
            <div className="space-y-4">
                <h3 className="font-medium">Configuración del carrusel</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Slides a mostrar</Label>
                        <Input
                            type="number"
                            min="1"
                            max="5"
                            value={editContent.slidesToShow || 3}
                            onChange={(e) => updateCarouselConfig('slidesToShow', parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label>Gap entre slides (px)</Label>
                        <Input
                            type="number"
                            value={editContent.gap || 16}
                            onChange={(e) => updateCarouselConfig('gap', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={editContent.autoplay || false}
                            onCheckedChange={(val) => updateCarouselConfig('autoplay', val)}
                        />
                        <Label>Autoplay</Label>
                    </div>
                    {editContent.autoplay && (
                        <div>
                            <Label>Velocidad (ms)</Label>
                            <Input
                                type="number"
                                value={editContent.autoplaySpeed || 3000}
                                onChange={(e) => updateCarouselConfig('autoplaySpeed', parseInt(e.target.value))}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={editContent.showArrows !== false}
                            onCheckedChange={(val) => updateCarouselConfig('showArrows', val)}
                        />
                        <Label>Mostrar flechas</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={editContent.showDots !== false}
                            onCheckedChange={(val) => updateCarouselConfig('showDots', val)}
                        />
                        <Label>Mostrar puntos</Label>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Personalizaciones de título */}
            <div className="space-y-4">
                <h3 className="font-medium">Título</h3>
                {renderTitleTypography()}
            </div>

            <Separator />

            {/* Personalizaciones de texto */}
            <div className="space-y-4">
                <h3 className="font-medium">Texto</h3>
                {renderTextTypography()}
            </div>

            <Separator />

            {/* Personalizaciones de tarjeta */}
            <div className="space-y-4">
                <h3 className="font-medium">Tarjeta</h3>
                {renderCardControls()}
            </div>

            <Separator />

            {/* Estilos del contenedor */}
            <div className="space-y-4">
                <h3 className="font-medium">Estilos del contenedor</h3>
                <div>
                    <Label>Color de fondo</Label>
                    <Input
                        type="color"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    />
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Padding arriba (px)</Label>
                        <Input
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 20}
                            onChange={(e) => updateStyle('paddingTop', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Padding derecha (px)</Label>
                        <Input
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 20}
                            onChange={(e) => updateStyle('paddingRight', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Padding abajo (px)</Label>
                        <Input
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 20}
                            onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Padding izquierda (px)</Label>
                        <Input
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 20}
                            onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                        />
                    </div>
                </div> */}
            </div>

            {/* Selector de imágenes */}
            <ImageSelector
                open={isImageSelectorOpen}
                onOpenChange={setIsImageSelectorOpen}
                onSelectImage={handleImageSelect}
                allImages={allImages}
                page={page}
            />
        </div>
    );
};

export default ImageCarouselEditDialog;