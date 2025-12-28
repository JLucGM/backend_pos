import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Badge } from '@/Components/ui/badge';
import { Info } from 'lucide-react';

const ProductDetailImageEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings, // Recibir themeSettings
}) => {
    const theme = themeSettings || {};

    const handleStyleChange = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Función para mostrar valor del tema
    const renderThemeReference = (themeKey, label) => {
        const themeValue = theme[themeKey];
        if (!themeValue) return null;
        
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Info size={12} />
                <span>{label} del tema: </span>
                <Badge variant="outline" className="text-xs">
                    {themeValue}
                </Badge>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="styles">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="styles">Estilos</TabsTrigger>
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                </TabsList>
                
                <TabsContent value="styles" className="space-y-4">
                    {/* Sección de referencia al tema */}
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                            <Info className="inline mr-1" size={14} />
                            Valores del tema actual
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {theme.border_radius && (
                                <div>
                                    <span className="text-gray-600">Border Radius: </span>
                                    <Badge variant="secondary" className="ml-1">
                                        {theme.border_radius}
                                    </Badge>
                                </div>
                            )}
                            {theme.borders && (
                                <div>
                                    <span className="text-gray-600">Color borde: </span>
                                    <Badge variant="secondary" className="ml-1">
                                        hsla({theme.borders}, 1)
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="aspectRatio">
                            Relación de aspecto
                            {renderThemeReference('image_aspect_ratio', 'Valor por defecto')}
                        </Label>
                        <Select 
                            value={editStyles.aspectRatio || 'square'} 
                            onValueChange={(value) => handleStyleChange('aspectRatio', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona relación de aspecto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="square">Cuadrado (1:1)</SelectItem>
                                <SelectItem value="landscape">Horizontal (16:9)</SelectItem>
                                <SelectItem value="portrait">Vertical (4:5)</SelectItem>
                                <SelectItem value="auto">Automático</SelectItem>
                                <SelectItem value="theme">Usar valor del tema</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="imageBorder">
                                Borde
                                {renderThemeReference('image_default_border', 'Configuración')}
                            </Label>
                            <Select 
                                value={editStyles.imageBorder || 'theme'} 
                                onValueChange={(value) => handleStyleChange('imageBorder', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de borde" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="theme">Usar configuración del tema</SelectItem>
                                    <SelectItem value="none">Sin borde</SelectItem>
                                    <SelectItem value="solid">Sólido</SelectItem>
                                    <SelectItem value="dashed">Discontinuo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {editStyles.imageBorder !== 'none' && editStyles.imageBorder !== 'theme' && (
                            <>
                                <div>
                                    <Label htmlFor="imageBorderThickness">
                                        Grosor del borde
                                        {renderThemeReference('image_border_thickness', 'Valor del tema')}
                                    </Label>
                                    <Input 
                                        id="imageBorderThickness"
                                        value={editStyles.imageBorderThickness || theme.image_border_thickness || '1px'}
                                        onChange={(e) => handleStyleChange('imageBorderThickness', e.target.value)}
                                        placeholder="Ej: 2px"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="imageBorderOpacity">
                                        Opacidad del borde
                                        {renderThemeReference('image_border_opacity', 'Valor del tema')}
                                    </Label>
                                    <Input 
                                        id="imageBorderOpacity"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={editStyles.imageBorderOpacity || theme.image_border_opacity || '1'}
                                        onChange={(e) => handleStyleChange('imageBorderOpacity', e.target.value)}
                                    />
                                    <span className="text-xs text-gray-500 ml-2">
                                        {editStyles.imageBorderOpacity || theme.image_border_opacity || '1'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="imageBorderRadius">
                            Borde redondeado
                            {renderThemeReference('image_border_radius', 'Valor del tema')}
                        </Label>
                        <Input 
                            id="imageBorderRadius"
                            value={editStyles.imageBorderRadius || theme.image_border_radius || theme.border_radius || '12px'}
                            onChange={(e) => handleStyleChange('imageBorderRadius', e.target.value)}
                            placeholder="Ej: 12px"
                        />
                        <div className="flex gap-2 mt-1">
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => handleStyleChange('imageBorderRadius', theme.image_border_radius || theme.border_radius || '8px')}
                            >
                                Usar valor del tema
                            </button>
                            <button
                                type="button"
                                className="text-xs text-gray-600 hover:text-gray-800"
                                onClick={() => handleStyleChange('imageBorderRadius', '0px')}
                            >
                                Sin bordes redondeados
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="objectFit">
                            Ajuste de imagen
                            {renderThemeReference('image_object_fit', 'Valor del tema')}
                        </Label>
                        <Select 
                            value={editStyles.objectFit || theme.image_object_fit || 'cover'} 
                            onValueChange={(value) => handleStyleChange('objectFit', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Ajuste de imagen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cover">Cubrir</SelectItem>
                                <SelectItem value="contain">Contener</SelectItem>
                                <SelectItem value="fill">Rellenar</SelectItem>
                                <SelectItem value="theme">Usar valor del tema</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                    <div>
                        <Label htmlFor="imageUrl">URL de la imagen</Label>
                        <Input 
                            id="imageUrl"
                            value={editContent || ''}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Dejar vacío para usar la imagen del producto
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="altText">Texto alternativo</Label>
                        <Input 
                            id="altText"
                            value={editStyles.altText || ''}
                            onChange={(e) => handleStyleChange('altText', e.target.value)}
                            placeholder="Descripción de la imagen"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProductDetailImageEditDialog;