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
            </Tabs>
        </div>
    );
};

export default BannerEditDialog;