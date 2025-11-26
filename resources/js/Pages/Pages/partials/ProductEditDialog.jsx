// components/BuilderPages/partials/ProductEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const ProductEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateProductConfig = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateSectionTitleStyles = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            sectionTitleStyles: {
                ...prev.sectionTitleStyles,
                [key]: value
            }
        }));
    };

    const updateProductTitleStyles = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            productTitleStyles: {
                ...prev.productTitleStyles,
                [key]: value
            }
        }));
    };

    const updatePriceStyles = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            priceStyles: {
                ...prev.priceStyles,
                [key]: value
            }
        }));
    };

    return (
        <div className="space-y-4">
            <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="cards">Cartas</TabsTrigger>
                    <TabsTrigger value="images">Imágenes</TabsTrigger>
                    <TabsTrigger value="textos">Textos</TabsTrigger>
                </TabsList>

                {/* Pestaña Grid */}
                <TabsContent value="grid" className="space-y-4">
                    <Label htmlFor="sectionTitle">Título de la Sección</Label>
                    <Input
                        id="sectionTitle"
                        value={editContent.sectionTitle || 'Productos Destacados'}
                        onChange={(e) => updateProductConfig('sectionTitle', e.target.value)}
                    />

                    <Label htmlFor="columns">Columnas</Label>
                    <Select 
                        value={editContent.columns?.toString() || '3'} 
                        onValueChange={(value) => updateProductConfig('columns', parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 Columna</SelectItem>
                            <SelectItem value="2">2 Columnas</SelectItem>
                            <SelectItem value="3">3 Columnas</SelectItem>
                            <SelectItem value="4">4 Columnas</SelectItem>
                            <SelectItem value="5">5 Columnas</SelectItem>
                            <SelectItem value="6">6 Columnas</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="limit">Límite de Productos</Label>
                    <Input
                        id="limit"
                        type="number"
                        value={editContent.limit || 8}
                        onChange={(e) => updateProductConfig('limit', parseInt(e.target.value))}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="gapX">Gap Horizontal (px)</Label>
                            <Input
                                id="gapX"
                                type="number"
                                value={parseInt(editContent.gapX) || 10}
                                onChange={(e) => updateProductConfig('gapX', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gapY">Gap Vertical (px)</Label>
                            <Input
                                id="gapY"
                                type="number"
                                value={parseInt(editContent.gapY) || 10}
                                onChange={(e) => updateProductConfig('gapY', `${e.target.value}px`)}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Pestaña Cartas */}
                <TabsContent value="cards" className="space-y-4">
                    <Label htmlFor="cardBorder">Borde de la Carta</Label>
                    <Select 
                        value={editContent.cardBorder || 'none'} 
                        onValueChange={(value) => updateProductConfig('cardBorder', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin borde</SelectItem>
                            <SelectItem value="solid">Con borde</SelectItem>
                        </SelectContent>
                    </Select>

                    {editContent.cardBorder === 'solid' && (
                        <>
                            <Label htmlFor="cardBorderThickness">Espesor del Borde (px)</Label>
                            <Input
                                id="cardBorderThickness"
                                type="number"
                                value={parseInt(editContent.cardBorderThickness) || 1}
                                onChange={(e) => updateProductConfig('cardBorderThickness', `${e.target.value}px`)}
                            />

                            <Label htmlFor="cardBorderOpacity">Opacidad del Borde (0-1)</Label>
                            <Input
                                id="cardBorderOpacity"
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={editContent.cardBorderOpacity || 1}
                                onChange={(e) => updateProductConfig('cardBorderOpacity', e.target.value)}
                            />
                        </>
                    )}

                    <Label htmlFor="cardBorderRadius">Border Radius (px)</Label>
                    <Input
                        id="cardBorderRadius"
                        type="number"
                        value={parseInt(editContent.cardBorderRadius) || 0}
                        onChange={(e) => updateProductConfig('cardBorderRadius', `${e.target.value}px`)}
                    />

                    <Label>Padding de la Carta (px)</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cardPaddingTop">Arriba</Label>
                            <Input
                                id="cardPaddingTop"
                                type="number"
                                value={parseInt(editContent.cardPaddingTop) || 0}
                                onChange={(e) => updateProductConfig('cardPaddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cardPaddingRight">Derecha</Label>
                            <Input
                                id="cardPaddingRight"
                                type="number"
                                value={parseInt(editContent.cardPaddingRight) || 0}
                                onChange={(e) => updateProductConfig('cardPaddingRight', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cardPaddingBottom">Abajo</Label>
                            <Input
                                id="cardPaddingBottom"
                                type="number"
                                value={parseInt(editContent.cardPaddingBottom) || 0}
                                onChange={(e) => updateProductConfig('cardPaddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="cardPaddingLeft">Izquierda</Label>
                            <Input
                                id="cardPaddingLeft"
                                type="number"
                                value={parseInt(editContent.cardPaddingLeft) || 0}
                                onChange={(e) => updateProductConfig('cardPaddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Pestaña Imágenes */}
                <TabsContent value="images" className="space-y-4">
                    <Label htmlFor="imageBorder">Borde de la Imagen</Label>
                    <Select 
                        value={editContent.imageBorder || 'none'} 
                        onValueChange={(value) => updateProductConfig('imageBorder', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin borde</SelectItem>
                            <SelectItem value="solid">Con borde</SelectItem>
                        </SelectContent>
                    </Select>

                    {editContent.imageBorder === 'solid' && (
                        <>
                            <Label htmlFor="imageBorderThickness">Espesor del Borde (px)</Label>
                            <Input
                                id="imageBorderThickness"
                                type="number"
                                value={parseInt(editContent.imageBorderThickness) || 1}
                                onChange={(e) => updateProductConfig('imageBorderThickness', `${e.target.value}px`)}
                            />

                            <Label htmlFor="imageBorderOpacity">Opacidad del Borde (0-1)</Label>
                            <Input
                                id="imageBorderOpacity"
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={editContent.imageBorderOpacity || 1}
                                onChange={(e) => updateProductConfig('imageBorderOpacity', e.target.value)}
                            />
                        </>
                    )}

                    <Label htmlFor="imageBorderRadius">Border Radius (px)</Label>
                    <Input
                        id="imageBorderRadius"
                        type="number"
                        value={parseInt(editContent.imageBorderRadius) || 0}
                        onChange={(e) => updateProductConfig('imageBorderRadius', `${e.target.value}px`)}
                    />
                </TabsContent>

                {/* Pestaña Textos - CORREGIDA */}
                <TabsContent value="textos" className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Estilos del Título de Sección</h4>
                        
                        {/* Layout para título de sección */}
                        <Label htmlFor="sectionTitleLayout">Layout</Label>
                        <Select 
                            value={editContent.sectionTitleStyles?.layout || 'fit'} 
                            onValueChange={(value) => updateSectionTitleStyles('layout', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                                <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Alignment (solo si layout es fill) */}
                        {editContent.sectionTitleStyles?.layout === 'fill' && (
                            <>
                                <Label htmlFor="sectionTitleAlignment">Alineación</Label>
                                <Select 
                                    value={editContent.sectionTitleStyles?.alignment || 'center'} 
                                    onValueChange={(value) => updateSectionTitleStyles('alignment', value)}
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
                            </>
                        )}

                        <Label htmlFor="sectionTitleColor">Color del Texto</Label>
                        <Input
                            id="sectionTitleColor"
                            type="color"
                            value={editContent.sectionTitleStyles?.color || '#000000'}
                            onChange={(e) => updateSectionTitleStyles('color', e.target.value)}
                        />

                        <Label htmlFor="sectionTitleFontSize">Tamaño de Fuente</Label>
                        <Select 
                            value={editContent.sectionTitleStyles?.fontSize || '24px'} 
                            onValueChange={(value) => updateSectionTitleStyles('fontSize', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="18px">18px</SelectItem>
                                <SelectItem value="20px">20px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                                <SelectItem value="28px">28px</SelectItem>
                                <SelectItem value="32px">32px</SelectItem>
                                <SelectItem value="36px">36px</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label htmlFor="sectionTitleFontWeight">Grosor de Fuente</Label>
                        <Select 
                            value={editContent.sectionTitleStyles?.fontWeight || 'bold'} 
                            onValueChange={(value) => updateSectionTitleStyles('fontWeight', value)}
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
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Estilos del Nombre del Producto</h4>
                        
                        {/* Layout para nombre del producto */}
                        <Label htmlFor="productTitleLayout">Layout</Label>
                        <Select 
                            value={editContent.productTitleStyles?.layout || 'fit'} 
                            onValueChange={(value) => updateProductTitleStyles('layout', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                                <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Alignment (solo si layout es fill) */}
                        {editContent.productTitleStyles?.layout === 'fill' && (
                            <>
                                <Label htmlFor="productTitleAlignment">Alineación</Label>
                                <Select 
                                    value={editContent.productTitleStyles?.alignment || 'left'} 
                                    onValueChange={(value) => updateProductTitleStyles('alignment', value)}
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
                            </>
                        )}

                        <Label htmlFor="productTitleColor">Color del Texto</Label>
                        <Input
                            id="productTitleColor"
                            type="color"
                            value={editContent.productTitleStyles?.color || '#000000'}
                            onChange={(e) => updateProductTitleStyles('color', e.target.value)}
                        />

                        <Label htmlFor="productTitleFontSize">Tamaño de Fuente</Label>
                        <Select 
                            value={editContent.productTitleStyles?.fontSize || '16px'} 
                            onValueChange={(value) => updateProductTitleStyles('fontSize', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="14px">14px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="18px">18px</SelectItem>
                                <SelectItem value="20px">20px</SelectItem>
                                <SelectItem value="24px">24px</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label htmlFor="productTitleFontWeight">Grosor de Fuente</Label>
                        <Select 
                            value={editContent.productTitleStyles?.fontWeight || '600'} 
                            onValueChange={(value) => updateProductTitleStyles('fontWeight', value)}
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
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Estilos del Precio</h4>
                        
                        {/* Layout para precio */}
                        <Label htmlFor="priceLayout">Layout</Label>
                        <Select 
                            value={editContent.priceStyles?.layout || 'fit'} 
                            onValueChange={(value) => updatePriceStyles('layout', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                                <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Alignment (solo si layout es fill) */}
                        {editContent.priceStyles?.layout === 'fill' && (
                            <>
                                <Label htmlFor="priceAlignment">Alineación</Label>
                                <Select 
                                    value={editContent.priceStyles?.alignment || 'left'} 
                                    onValueChange={(value) => updatePriceStyles('alignment', value)}
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
                            </>
                        )}
                        
                        <Label htmlFor="priceColor">Color del Texto</Label>
                        <Input
                            id="priceColor"
                            type="color"
                            value={editContent.priceStyles?.color || '#666666'}
                            onChange={(e) => updatePriceStyles('color', e.target.value)}
                        />

                        <Label htmlFor="priceFontSize">Tamaño de Fuente</Label>
                        <Select 
                            value={editContent.priceStyles?.fontSize || '14px'} 
                            onValueChange={(value) => updatePriceStyles('fontSize', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12px">12px</SelectItem>
                                <SelectItem value="14px">14px</SelectItem>
                                <SelectItem value="16px">16px</SelectItem>
                                <SelectItem value="18px">18px</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label htmlFor="priceFontWeight">Grosor de Fuente</Label>
                        <Select 
                            value={editContent.priceStyles?.fontWeight || 'normal'} 
                            onValueChange={(value) => updatePriceStyles('fontWeight', value)}
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
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProductEditDialog;