// components/BuilderPages/partials/BannerEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const BannerEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateBannerConfig = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="contenedor" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="contenedor">Contenedor</TabsTrigger>
                    <TabsTrigger value="posicion">Posición</TabsTrigger>
                    {/* <TabsTrigger value="titulo">Título</TabsTrigger> */}
                    {/* <TabsTrigger value="texto">Texto</TabsTrigger> */}
                </TabsList>

                {/* Pestaña Contenedor */}
                <TabsContent value="contenedor" className="space-y-4">
                    <Label htmlFor="containerHeight">Altura del Contenedor</Label>
                    <Input
                        id="containerHeight"
                        value={editContent.containerHeight || '400px'}
                        onChange={(e) => updateBannerConfig('containerHeight', e.target.value)}
                    />

                    <Label htmlFor="containerWidth">Ancho del Contenedor</Label>
                    <Input
                        id="containerWidth"
                        value={editContent.containerWidth || '100%'}
                        onChange={(e) => updateBannerConfig('containerWidth', e.target.value)}
                    />

                    <Label>Márgenes (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="marginTop">Superior</Label>
                            <Input
                                id="marginTop"
                                type="number"
                                value={parseInt(editContent.marginTop) || 0}
                                onChange={(e) => updateBannerConfig('marginTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginRight">Derecha</Label>
                            <Input
                                id="marginRight"
                                type="number"
                                value={parseInt(editContent.marginRight) || 0}
                                onChange={(e) => updateBannerConfig('marginRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginBottom">Inferior</Label>
                            <Input
                                id="marginBottom"
                                type="number"
                                value={parseInt(editContent.marginBottom) || 0}
                                onChange={(e) => updateBannerConfig('marginBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="marginLeft">Izquierda</Label>
                            <Input
                                id="marginLeft"
                                type="number"
                                value={parseInt(editContent.marginLeft) || 0}
                                onChange={(e) => updateBannerConfig('marginLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    <Label>Padding (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="paddingTop">Superior</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editContent.paddingTop) || 20}
                                onChange={(e) => updateBannerConfig('paddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editContent.paddingRight) || 20}
                                onChange={(e) => updateBannerConfig('paddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom">Inferior</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editContent.paddingBottom) || 20}
                                onChange={(e) => updateBannerConfig('paddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editContent.paddingLeft) || 20}
                                onChange={(e) => updateBannerConfig('paddingLeft', `${e.target.value}px`)}
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

                    <Label htmlFor="backgroundVideo">Video de Fondo (URL)</Label>
                    <Input
                        id="backgroundVideo"
                        value={editContent.backgroundVideo || ''}
                        onChange={(e) => updateBannerConfig('backgroundVideo', e.target.value)}
                        placeholder="https://ejemplo.com/video.mp4"
                    />

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

                {/* Pestaña Título */}
                {/* <TabsContent value="titulo" className="space-y-4">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        value={editContent.title || 'Título del Banner'}
                        onChange={(e) => updateBannerConfig('title', e.target.value)}
                    />

                    <Label htmlFor="titleLayout">Layout</Label>
                    <Select 
                        value={editContent.titleLayout || 'fit'} 
                        onValueChange={(value) => updateBannerConfig('titleLayout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                            <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="titleAlignment">Alineación del Título</Label>
                    <Select 
                        value={editContent.titleAlignment || 'center'} 
                        onValueChange={(value) => updateBannerConfig('titleAlignment', value)}
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

                    <Label htmlFor="titleBackground">Color de Fondo</Label>
                    <Input
                        id="titleBackground"
                        type="color"
                        value={editContent.titleBackground || '#ffffff'}
                        onChange={(e) => updateBannerConfig('titleBackground', e.target.value)}
                    />

                    <Label htmlFor="titleBackgroundOpacity">Opacidad del Fondo (0-1)</Label>
                    <Input
                        id="titleBackgroundOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editContent.titleBackgroundOpacity || 1}
                        onChange={(e) => updateBannerConfig('titleBackgroundOpacity', e.target.value)}
                    />

                    <Label htmlFor="titleBorderRadius">Border Radius (px)</Label>
                    <Input
                        id="titleBorderRadius"
                        type="number"
                        value={parseInt(editContent.titleBorderRadius) || 0}
                        onChange={(e) => updateBannerConfig('titleBorderRadius', `${e.target.value}px`)}
                    />

                    <Label>Padding del Título (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="titlePaddingTop">Superior</Label>
                            <Input
                                id="titlePaddingTop"
                                type="number"
                                value={parseInt(editContent.titlePaddingTop) || 10}
                                onChange={(e) => updateBannerConfig('titlePaddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="titlePaddingRight">Derecha</Label>
                            <Input
                                id="titlePaddingRight"
                                type="number"
                                value={parseInt(editContent.titlePaddingRight) || 10}
                                onChange={(e) => updateBannerConfig('titlePaddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="titlePaddingBottom">Inferior</Label>
                            <Input
                                id="titlePaddingBottom"
                                type="number"
                                value={parseInt(editContent.titlePaddingBottom) || 10}
                                onChange={(e) => updateBannerConfig('titlePaddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="titlePaddingLeft">Izquierda</Label>
                            <Input
                                id="titlePaddingLeft"
                                type="number"
                                value={parseInt(editContent.titlePaddingLeft) || 10}
                                onChange={(e) => updateBannerConfig('titlePaddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    <Label htmlFor="titleColor">Color del Texto</Label>
                    <Input
                        id="titleColor"
                        type="color"
                        value={editContent.titleColor || '#000000'}
                        onChange={(e) => updateBannerConfig('titleColor', e.target.value)}
                    />

                    <Label htmlFor="titleFontSize">Tamaño de Fuente</Label>
                    <Select 
                        value={editContent.titleFontSize || '32px'} 
                        onValueChange={(value) => updateBannerConfig('titleFontSize', value)}
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

                    <Label htmlFor="titleFontWeight">Grosor de Fuente</Label>
                    <Select 
                        value={editContent.titleFontWeight || 'bold'} 
                        onValueChange={(value) => updateBannerConfig('titleFontWeight', value)}
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
                </TabsContent> */}

                {/* Pestaña Texto */}
                {/* <TabsContent value="texto" className="space-y-4">
                    <Label htmlFor="text">Texto</Label>
                    <Input
                        id="text"
                        value={editContent.text || 'Texto descriptivo del banner'}
                        onChange={(e) => updateBannerConfig('text', e.target.value)}
                    />

                    <Label htmlFor="textLayout">Layout</Label>
                    <Select 
                        value={editContent.textLayout || 'fit'} 
                        onValueChange={(value) => updateBannerConfig('textLayout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                            <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="textAlignment">Alineación del Texto</Label>
                    <Select 
                        value={editContent.textAlignment || 'center'} 
                        onValueChange={(value) => updateBannerConfig('textAlignment', value)}
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

                    <Label htmlFor="textBackground">Color de Fondo</Label>
                    <Input
                        id="textBackground"
                        type="color"
                        value={editContent.textBackground || '#ffffff'}
                        onChange={(e) => updateBannerConfig('textBackground', e.target.value)}
                    />

                    <Label htmlFor="textBackgroundOpacity">Opacidad del Fondo (0-1)</Label>
                    <Input
                        id="textBackgroundOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editContent.textBackgroundOpacity || 1}
                        onChange={(e) => updateBannerConfig('textBackgroundOpacity', e.target.value)}
                    />

                    <Label htmlFor="textBorderRadius">Border Radius (px)</Label>
                    <Input
                        id="textBorderRadius"
                        type="number"
                        value={parseInt(editContent.textBorderRadius) || 0}
                        onChange={(e) => updateBannerConfig('textBorderRadius', `${e.target.value}px`)}
                    />

                    <Label>Padding del Texto (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="textPaddingTop">Superior</Label>
                            <Input
                                id="textPaddingTop"
                                type="number"
                                value={parseInt(editContent.textPaddingTop) || 10}
                                onChange={(e) => updateBannerConfig('textPaddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="textPaddingRight">Derecha</Label>
                            <Input
                                id="textPaddingRight"
                                type="number"
                                value={parseInt(editContent.textPaddingRight) || 10}
                                onChange={(e) => updateBannerConfig('textPaddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="textPaddingBottom">Inferior</Label>
                            <Input
                                id="textPaddingBottom"
                                type="number"
                                value={parseInt(editContent.textPaddingBottom) || 10}
                                onChange={(e) => updateBannerConfig('textPaddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="textPaddingLeft">Izquierda</Label>
                            <Input
                                id="textPaddingLeft"
                                type="number"
                                value={parseInt(editContent.textPaddingLeft) || 10}
                                onChange={(e) => updateBannerConfig('textPaddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>

                    <Label htmlFor="textColor">Color del Texto</Label>
                    <Input
                        id="textColor"
                        type="color"
                        value={editContent.textColor || '#000000'}
                        onChange={(e) => updateBannerConfig('textColor', e.target.value)}
                    />

                    <Label htmlFor="textFontSize">Tamaño de Fuente</Label>
                    <Select 
                        value={editContent.textFontSize || '16px'} 
                        onValueChange={(value) => updateBannerConfig('textFontSize', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12px">12px</SelectItem>
                            <SelectItem value="16px">16px</SelectItem>
                            <SelectItem value="20px">20px</SelectItem>
                            <SelectItem value="24px">24px</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="textFontWeight">Grosor de Fuente</Label>
                    <Select 
                        value={editContent.textFontWeight || 'normal'} 
                        onValueChange={(value) => updateBannerConfig('textFontWeight', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Negrita</SelectItem>
                            <SelectItem value="600">Seminegrita</SelectItem>
                        </SelectContent>
                    </Select>
                </TabsContent> */}
            </Tabs>
        </div>
    );
};

export default BannerEditDialog;