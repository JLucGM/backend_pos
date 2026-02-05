import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const BannerEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateBannerConfig = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Estado para controlar si se muestra el fondo del contenedor interno
    const hasInnerContainerBackground = editContent.innerContainerHasBackground !== false;
    const innerContainerBackgroundColor = editContent.innerContainerBackgroundColor || '#ffffff';

    // Función para manejar el cambio del switch
    const handleBackgroundToggle = (checked) => {
        updateBannerConfig('innerContainerHasBackground', checked);
        // Si se desactiva el fondo, establecer transparent
        if (!checked) {
            updateBannerConfig('innerContainerBackgroundColor', 'transparent');
            updateBannerConfig('innerContainerBackgroundOpacity', 1);
        } else if (innerContainerBackgroundColor === 'transparent') {
            // Si se activa y actualmente es transparent, establecer un color por defecto
            updateBannerConfig('innerContainerBackgroundColor', '#ffffff');
        }
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="contenedor" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="contenedor">Contenedor</TabsTrigger>
                    <TabsTrigger value="posicion">Posición</TabsTrigger>
                    <TabsTrigger value="interno">Contenedor Interno</TabsTrigger>
                </TabsList>

                {/* Pestaña Contenedor */}
                <TabsContent value="contenedor" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="containerHeight">Altura del Contenedor</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="containerHeight"
                                    type="number"
                                    value={parseInt(editContent.containerHeight) || 400}
                                    onChange={(e) => updateBannerConfig('containerHeight', e.target.value)}
                                />
                                <Select
                                    value={editContent.containerHeightUnit || 'px'}
                                    onValueChange={(value) => updateBannerConfig('containerHeightUnit', value)}
                                >
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="px">px</SelectItem>
                                        <SelectItem value="vh">vh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="containerWidth">Ancho del Contenedor</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="containerWidth"
                                    type="number"
                                    value={parseInt(editContent.containerWidth) || 100}
                                    onChange={(e) => updateBannerConfig('containerWidth', e.target.value)}
                                />
                                <Select
                                    value={editContent.containerWidthUnit || '%'}
                                    onValueChange={(value) => updateBannerConfig('containerWidthUnit', value)}
                                >
                                    <SelectTrigger className="w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="px">px</SelectItem>
                                        <SelectItem value="%">%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Label>Márgenes</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="marginTop">Superior</Label>
                            <Input
                                id="marginTop"
                                type="number"
                                value={parseInt(editContent.marginTop) || 0}
                                onChange={(e) => updateBannerConfig('marginTop', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginRight">Derecha</Label>
                            <Input
                                id="marginRight"
                                type="number"
                                value={parseInt(editContent.marginRight) || 0}
                                onChange={(e) => updateBannerConfig('marginRight', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginBottom">Inferior</Label>
                            <Input
                                id="marginBottom"
                                type="number"
                                value={parseInt(editContent.marginBottom) || 0}
                                onChange={(e) => updateBannerConfig('marginBottom', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginLeft">Izquierda</Label>
                            <Input
                                id="marginLeft"
                                type="number"
                                value={parseInt(editContent.marginLeft) || 0}
                                onChange={(e) => updateBannerConfig('marginLeft', e.target.value)}
                            />
                        </div>
                    </div>

                    <Label>Padding</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop">Superior</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editContent.paddingTop) || 20}
                                onChange={(e) => updateBannerConfig('paddingTop', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editContent.paddingRight) || 20}
                                onChange={(e) => updateBannerConfig('paddingRight', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom">Inferior</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editContent.paddingBottom) || 20}
                                onChange={(e) => updateBannerConfig('paddingBottom', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editContent.paddingLeft) || 20}
                                onChange={(e) => updateBannerConfig('paddingLeft', e.target.value)}
                            />
                        </div>
                    </div>

                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <Input
                        id="backgroundColor"
                        type="color"
                        value={editContent.backgroundColor || '#ffffff'}
                        onChange={(e) => updateBannerConfig('backgroundColor', e.target.value)}
                    />

                    <Label htmlFor="backgroundImage">Imagen de Fondo (URL)</Label>
                    <Input
                        id="backgroundImage"
                        value={editContent.backgroundImage || ''}
                        onChange={(e) => updateBannerConfig('backgroundImage', e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />

                    {/* <Label htmlFor="backgroundVideo">Video de Fondo (URL)</Label>
                    <Input
                        id="backgroundVideo"
                        value={editContent.backgroundVideo || ''}
                        onChange={(e) => updateBannerConfig('backgroundVideo', e.target.value)}
                        placeholder="https://ejemplo.com/video.mp4"
                    /> */}

                    <Label htmlFor="backgroundSize">Tamaño de Fondo</Label>
                    <Select
                        value={editContent.backgroundSize || 'cover'}
                        onValueChange={(value) => updateBannerConfig('backgroundSize', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cover">Cover</SelectItem>
                            <SelectItem value="contain">Contain</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                    </Select>
                </TabsContent>

                {/* Pestaña Posición */}
                <TabsContent value="posicion" className="space-y-4">
                    <Label>Posición del Contenido en el Contenedor</Label>

                    <Label htmlFor="containerVerticalPosition">Posición Vertical</Label>
                    <Select
                        value={editContent.containerVerticalPosition || 'center'}
                        onValueChange={(value) => updateBannerConfig('containerVerticalPosition', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="top">Arriba</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="bottom">Abajo</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="containerHorizontalPosition">Posición Horizontal</Label>
                    <Select
                        value={editContent.containerHorizontalPosition || 'center'}
                        onValueChange={(value) => updateBannerConfig('containerHorizontalPosition', value)}
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

                    <Label htmlFor="contentDirection">Dirección del Contenido</Label>
                    <Select
                        value={editContent.contentDirection || 'vertical'}
                        onValueChange={(value) => updateBannerConfig('contentDirection', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vertical">Vertical (Columna)</SelectItem>
                            <SelectItem value="horizontal">Horizontal (Fila)</SelectItem>
                        </SelectContent>
                    </Select>
                </TabsContent>

                {/* Pestaña Contenedor Interno */}
                <TabsContent value="interno" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="innerContainerShow">Mostrar Contenedor Interno</Label>
                        <Switch
                            id="innerContainerShow"
                            checked={editContent.innerContainerShow !== false}
                            onCheckedChange={(checked) => updateBannerConfig('innerContainerShow', checked)}
                        />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="innerContainerHasBackground">Mostrar Fondo</Label>
                            <Switch
                                id="innerContainerHasBackground"
                                checked={hasInnerContainerBackground}
                                onCheckedChange={handleBackgroundToggle}
                            />
                        </div>

                        {hasInnerContainerBackground && (
                            <>
                                <div>
                                    <Label htmlFor="innerContainerBackgroundColor">Color de Fondo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="innerContainerBackgroundColor"
                                            type="color"
                                            value={innerContainerBackgroundColor === 'transparent' ? '#ffffff' : innerContainerBackgroundColor}
                                            onChange={(e) => updateBannerConfig('innerContainerBackgroundColor', e.target.value)}
                                            className="w-12"
                                        />
                                        <Input
                                            id="innerContainerBackgroundColorHex"
                                            value={innerContainerBackgroundColor === 'transparent' ? '#ffffff' : innerContainerBackgroundColor}
                                            onChange={(e) => updateBannerConfig('innerContainerBackgroundColor', e.target.value)}
                                            placeholder="#ffffff"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="innerContainerBackgroundOpacity">Opacidad (0-1)</Label>
                                    <Input
                                        id="innerContainerBackgroundOpacity"
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={editContent.innerContainerBackgroundOpacity || 0.8}
                                        onChange={(e) => updateBannerConfig('innerContainerBackgroundOpacity', parseFloat(e.target.value))}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        0 = transparente, 1 = opaco
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <Label htmlFor="innerContainerBorderRadius">Border Radius</Label>
                        <Input
                            id="innerContainerBorderRadius"
                            type="number"
                            value={parseInt(editContent.innerContainerBorderRadius) || 0}
                            onChange={(e) => updateBannerConfig('innerContainerBorderRadius', e.target.value)}
                        />
                    </div>

                    <Label>Padding del Contenedor Interno</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="innerContainerPaddingTop">Superior</Label>
                            <Input
                                id="innerContainerPaddingTop"
                                type="number"
                                value={parseInt(editContent.innerContainerPaddingTop) || 20}
                                onChange={(e) => updateBannerConfig('innerContainerPaddingTop', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="innerContainerPaddingRight">Derecha</Label>
                            <Input
                                id="innerContainerPaddingRight"
                                type="number"
                                value={parseInt(editContent.innerContainerPaddingRight) || 20}
                                onChange={(e) => updateBannerConfig('innerContainerPaddingRight', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="innerContainerPaddingBottom">Inferior</Label>
                            <Input
                                id="innerContainerPaddingBottom"
                                type="number"
                                value={parseInt(editContent.innerContainerPaddingBottom) || 20}
                                onChange={(e) => updateBannerConfig('innerContainerPaddingBottom', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="innerContainerPaddingLeft">Izquierda</Label>
                            <Input
                                id="innerContainerPaddingLeft"
                                type="number"
                                value={parseInt(editContent.innerContainerPaddingLeft) || 20}
                                onChange={(e) => updateBannerConfig('innerContainerPaddingLeft', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="innerContainerWidth">Ancho del Contenedor</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="innerContainerWidth"
                                type="number"
                                value={parseInt(editContent.innerContainerWidth) || ''}
                                onChange={(e) => updateBannerConfig('innerContainerWidth', e.target.value)}
                                placeholder="Auto"
                            />
                            <Select
                                value={editContent.innerContainerWidthUnit || 'px'}
                                onValueChange={(value) => updateBannerConfig('innerContainerWidthUnit', value)}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="px">px</SelectItem>
                                    <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="innerContainerMaxWidth">Ancho Máximo</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="innerContainerMaxWidth"
                                type="number"
                                value={parseInt(editContent.innerContainerMaxWidth) || 800}
                                onChange={(e) => updateBannerConfig('innerContainerMaxWidth', e.target.value)}
                                placeholder="800"
                            />
                            <Select
                                value={editContent.innerContainerMaxWidthUnit || 'px'}
                                onValueChange={(value) => updateBannerConfig('innerContainerMaxWidthUnit', value)}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="px">px</SelectItem>
                                    <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BannerEditDialog;