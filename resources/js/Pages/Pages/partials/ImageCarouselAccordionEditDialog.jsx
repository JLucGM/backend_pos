import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { Plus, X, ImageIcon, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import ImageSelector from '@/Components/BuilderPages/ImageSelector';

const ImageCarouselAccordionEditDialog = ({
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
        const imageSrc = imageData.url || imageData.src; // compatible con ambos formatos
        if (selectedImageIndex === null) {
            const newImages = [...images, {
                src: imageSrc,
                title: '',
                subtitle: '',
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

    // Actualizar título o subtítulo de una imagen
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

    // Renderizar controles de tipografía para título (global)
    const renderTitleTypography = () => {
        const textStyle = editContent.titleTextStyle || 'heading2';
        const fontSize = editContent.titleFontSize || (textStyle === 'custom' ? '32' : themeSettings?.[`${textStyle}_fontSize`]?.replace('px', '') || '32');
        const fontSizeUnit = editContent.titleFontSizeUnit || (editContent.titleFontSize?.toString().includes('rem') ? 'rem' : 'px');
        const fontWeight = editContent.titleFontWeight || 'bold';
        const lineHeight = editContent.titleLineHeight || '1.2';
        const textTransform = editContent.titleTextTransform || 'none';
        const fontType = editContent.titleFontType || 'default';
        const customFont = editContent.titleCustomFont || '';
        const color = editContent.titleColor || '#ffffff';
        const customLineHeight = editContent.titleCustomLineHeight || '';

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium">Estilos del Título</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const defaults = {
                                titleTextStyle: 'heading2',
                                titleFontSize: themeSettings?.heading2_fontSize?.replace('px', '') || '32',
                                titleFontSizeUnit: 'px',
                                titleFontWeight: 'bold',
                                titleLineHeight: '1.2',
                                titleTextTransform: 'none',
                                titleFontType: 'default',
                                titleCustomFont: '',
                                titleColor: '#ffffff',
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
                                updateCarouselConfig('titleFontSize', themeSettings[`${val}_fontSize`]?.replace('px', '') || '32');
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

    // Renderizar controles de tipografía para subtítulo (global)
    const renderSubtitleTypography = () => {
        const textStyle = editContent.subtitleTextStyle || 'paragraph';
        const fontSize = editContent.subtitleFontSize || (textStyle === 'custom' ? '16' : themeSettings?.[`${textStyle}_fontSize`]?.replace('px', '') || '16');
        const fontSizeUnit = editContent.subtitleFontSizeUnit || (editContent.subtitleFontSize?.toString().includes('rem') ? 'rem' : 'px');
        const fontWeight = editContent.subtitleFontWeight || 'normal';
        const lineHeight = editContent.subtitleLineHeight || '1.6';
        const textTransform = editContent.subtitleTextTransform || 'none';
        const fontType = editContent.subtitleFontType || 'default';
        const customFont = editContent.subtitleCustomFont || '';
        const color = editContent.subtitleColor || '#e5e7eb';
        const customLineHeight = editContent.subtitleCustomLineHeight || '';

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium">Estilos del Subtítulo</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const defaults = {
                                subtitleTextStyle: 'paragraph',
                                subtitleFontSize: themeSettings?.paragraph_fontSize?.replace('px', '') || '16',
                                subtitleFontSizeUnit: 'px',
                                subtitleFontWeight: 'normal',
                                subtitleLineHeight: '1.6',
                                subtitleTextTransform: 'none',
                                subtitleFontType: 'default',
                                subtitleCustomFont: '',
                                subtitleColor: '#e5e7eb',
                                subtitleCustomLineHeight: '',
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
                            updateCarouselConfig('subtitleTextStyle', val);
                            if (val !== 'custom' && themeSettings) {
                                updateCarouselConfig('subtitleFontSize', themeSettings[`${val}_fontSize`]?.replace('px', '') || '16');
                                updateCarouselConfig('subtitleFontWeight', themeSettings[`${val}_fontWeight`] || 'normal');
                                updateCarouselConfig('subtitleLineHeight', themeSettings[`${val}_lineHeight`] || '1.6');
                                updateCarouselConfig('subtitleTextTransform', themeSettings[`${val}_textTransform`] || 'none');
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
                                    onChange={(e) => updateCarouselConfig('subtitleFontSize', e.target.value)}
                                    className="flex-1"
                                />
                                <Select
                                    value={fontSizeUnit}
                                    onValueChange={(val) => updateCarouselConfig('subtitleFontSizeUnit', val)}
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
                                onValueChange={(val) => updateCarouselConfig('subtitleFontWeight', val)}
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
                                    updateCarouselConfig('subtitleLineHeight', val);
                                    if (val !== 'custom') {
                                        updateCarouselConfig('subtitleCustomLineHeight', '');
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
                                    onChange={(e) => updateCarouselConfig('subtitleCustomLineHeight', e.target.value)}
                                    placeholder="ej. 1.8, 2"
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div>
                            <Label>Transformación de texto</Label>
                            <Select
                                value={textTransform}
                                onValueChange={(val) => updateCarouselConfig('subtitleTextTransform', val)}
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
                        onValueChange={(val) => updateCarouselConfig('subtitleFontType', val)}
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
                            onChange={(e) => updateCarouselConfig('subtitleCustomFont', e.target.value)}
                            placeholder="'Roboto', sans-serif"
                        />
                    </div>
                )}

                <div>
                    <Label>Color del texto</Label>
                    <Input
                        type="color"
                        value={color}
                        onChange={(e) => updateCarouselConfig('subtitleColor', e.target.value)}
                    />
                </div>
            </div>
        );
    };

    // Renderizar controles de borde de imagen (global)
    const renderBorderControls = () => {
        const borderWidth = editContent.borderWidth || '0';
        const borderStyle = editContent.borderStyle || 'solid';
        const borderColor = editContent.borderColor || '#000000';
        const borderRadius = editContent.borderRadius || '0';

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium">Estilos de Borde de Imagen</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            updateCarouselConfig('borderWidth', '0');
                            updateCarouselConfig('borderStyle', 'solid');
                            updateCarouselConfig('borderColor', '#000000');
                            updateCarouselConfig('borderRadius', '0');
                        }}
                    >
                        <RotateCcw size={14} className="mr-1" /> Restablecer
                    </Button>
                </div>

                <div>
                    <Label>Ancho del borde (px)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={parseInt(borderWidth) || 0}
                        onChange={(e) => updateCarouselConfig('borderWidth', e.target.value)}
                    />
                </div>

                {parseInt(borderWidth) > 0 && (
                    <>
                        <div>
                            <Label>Estilo del borde</Label>
                            <Select
                                value={borderStyle}
                                onValueChange={(val) => updateCarouselConfig('borderStyle', val)}
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
                                onChange={(e) => updateCarouselConfig('borderColor', e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div>
                    <Label>Radio de borde (px)</Label>
                    <Input
                        type="number"
                        min="0"
                        value={parseInt(borderRadius) || 0}
                        onChange={(e) => updateCarouselConfig('borderRadius', e.target.value)}
                    />
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
                                        <div className="flex flex-col">

                                        {/* Miniatura */}
                                        <div className="w-20 h-20 mx-auto mb-4 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                            {img.src ? (
                                                <img src={img.src} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Campos de título y subtítulo */}
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Título principal"
                                                value={img.title || ''}
                                                onChange={(e) => handleImageFieldChange(idx, 'title', e.target.value)}
                                                />
                                            <Input
                                                placeholder="Subtítulo (opcional)"
                                                value={img.subtitle || ''}
                                                onChange={(e) => handleImageFieldChange(idx, 'subtitle', e.target.value)}
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

            {/* Personalizaciones globales - sin tabs */}
            {renderTitleTypography()}

            <Separator />

            {renderSubtitleTypography()}

            <Separator />

            {renderBorderControls()}

            <Separator />

            {/* Estilos del contenedor (padding, fondo) */}
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

export default ImageCarouselAccordionEditDialog;