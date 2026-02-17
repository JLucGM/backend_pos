import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductDetailStockEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = useCallback((value) => resolveStyleValue(value, themeWithDefaults, appliedTheme), [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleStyleChange = useCallback((key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditStyles]);

    const handleContentChange = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const resetToDefaults = useCallback(() => {
        const textStyle = editStyles.textStyle || 'paragraph';

        let defaultStyles = {};

        if (textStyle === 'paragraph' && themeSettings) {
            defaultStyles = {
                fontSize: themeSettings.paragraph_fontSize || '14px',
                fontWeight: themeSettings.paragraph_fontWeight || 'normal',
                fontType: 'default',
                customFont: '',
            };
        }

        setEditStyles(prev => ({
            ...prev,
            ...defaultStyles
        }));
    }, [editStyles.textStyle, themeSettings, setEditStyles]);

    const currentFontType = editStyles.fontType || 'default';

    // Valores resueltos para colores
    const inStockBgColor = resolveValue(editStyles.inStockBgColor) || '#dcfce7';
    const inStockColor = resolveValue(editStyles.inStockColor) || '#166534';
    const inStockBorderColor = resolveValue(editStyles.inStockBorderColor) || '#bbf7d0';
    const outOfStockBgColor = resolveValue(editStyles.outOfStockBgColor) || '#fee2e2';
    const outOfStockColor = resolveValue(editStyles.outOfStockColor) || '#991b1b';
    const outOfStockBorderColor = resolveValue(editStyles.outOfStockBorderColor) || '#fecaca';

    return (
        <div className="space-y-4">
            {/* Botón para restablecer a valores por defecto */}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToDefaults}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restablecer tipografía
                </Button>
            </div>

            <Tabs defaultValue="content">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                    <TabsTrigger value="styles">Estilos</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="inStockText">Texto en stock</Label>
                            <Input
                                id="inStockText"
                                value={editContent?.inStockText || 'En stock'}
                                onChange={(e) => handleContentChange('inStockText', e.target.value)}
                                placeholder="Texto cuando hay stock"
                            />
                        </div>
                        <div>
                            <Label htmlFor="inStockIcon">Icono en stock</Label>
                            <Input
                                id="inStockIcon"
                                value={editContent?.inStockIcon || '✓'}
                                onChange={(e) => handleContentChange('inStockIcon', e.target.value)}
                                placeholder="Ej: ✓"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="lowStockText">Texto stock bajo</Label>
                            <Input
                                id="lowStockText"
                                value={editContent?.lowStockText || 'Pocas unidades'}
                                onChange={(e) => handleContentChange('lowStockText', e.target.value)}
                                placeholder="Texto cuando stock bajo"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lowStockIcon">Icono stock bajo</Label>
                            <Input
                                id="lowStockIcon"
                                value={editContent?.lowStockIcon || '⚠'}
                                onChange={(e) => handleContentChange('lowStockIcon', e.target.value)}
                                placeholder="Ej: ⚠"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="outOfStockText">Texto agotado</Label>
                            <Input
                                id="outOfStockText"
                                value={editContent?.outOfStockText || 'Agotado'}
                                onChange={(e) => handleContentChange('outOfStockText', e.target.value)}
                                placeholder="Texto cuando agotado"
                            />
                        </div>
                        <div>
                            <Label htmlFor="outOfStockIcon">Icono agotado</Label>
                            <Input
                                id="outOfStockIcon"
                                value={editContent?.outOfStockIcon || '✗'}
                                onChange={(e) => handleContentChange('outOfStockIcon', e.target.value)}
                                placeholder="Ej: ✗"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="showSku"
                            checked={editContent?.showSku || false}
                            onCheckedChange={(checked) => handleContentChange('showSku', checked)}
                        />
                        <Label htmlFor="showSku">Mostrar SKU del producto</Label>
                    </div>
                </TabsContent>

                <TabsContent value="styles" className="space-y-4">
                    {/* Estilo del Texto */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Estilo del Texto</h4>

                        <div>
                            <Label htmlFor="fontSize">Tamaño de fuente</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="fontSize"
                                    type="number"
                                    value={parseInt(editStyles.fontSize) || ''}
                                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                    placeholder="14"
                                    className="flex-1"
                                />
                                <Select
                                    value={editStyles.fontSizeUnit || (editStyles.fontSize?.toString().includes('rem') ? 'rem' : 'px')}
                                    onValueChange={(value) => handleStyleChange('fontSizeUnit', value)}
                                >
                                    <SelectTrigger className="w-[80px]">
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
                            <Label htmlFor="fontWeight">Peso de fuente</Label>
                            <Select
                                value={editStyles.fontWeight || '500'}
                                onValueChange={(value) => handleStyleChange('fontWeight', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medio</SelectItem>
                                    <SelectItem value="semibold">Seminegrita</SelectItem>
                                    <SelectItem value="bold">Negrita</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tipo de fuente */}
                        <div>
                            <Label htmlFor="fontType">Tipo de Fuente</Label>
                            <Select
                                value={currentFontType}
                                onValueChange={(value) => handleStyleChange('fontType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">
                                        Por defecto (usar fuente del tema para este estilo)
                                    </SelectItem>
                                    <SelectItem value="body_font">
                                        Body Font ({themeWithDefaults.body_font || 'Inter'})
                                    </SelectItem>
                                    <SelectItem value="heading_font">
                                        Heading Font ({themeWithDefaults.heading_font || 'Inter'})
                                    </SelectItem>
                                    <SelectItem value="subheading_font">
                                        Subheading Font ({themeWithDefaults.subheading_font || 'Inter'})
                                    </SelectItem>
                                    <SelectItem value="accent_font">
                                        Accent Font ({themeWithDefaults.accent_font || 'Inter'})
                                    </SelectItem>
                                    <SelectItem value="custom">Personalizada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {currentFontType === 'custom' && (
                            <div>
                                <Label htmlFor="customFont">Fuente Personalizada</Label>
                                <Input
                                    id="customFont"
                                    value={editStyles.customFont || ''}
                                    onChange={(e) => handleStyleChange('customFont', e.target.value)}
                                    placeholder="'Roboto', sans-serif"
                                />
                            </div>
                        )}
                    </div>

                    <Separator className="my-4" />

                    {/* Estilos del Contenedor */}
                    <div className="space-y-4">
                        <Label>Padding interno</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="paddingTop">Superior</Label>
                                <Input
                                    id="paddingTop"
                                    type="number"
                                    value={parseInt(editStyles.paddingTop) || 0}
                                    onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingRight">Derecha</Label>
                                <Input
                                    id="paddingRight"
                                    type="number"
                                    value={parseInt(editStyles.paddingRight) || 0}
                                    onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingBottom">Inferior</Label>
                                <Input
                                    id="paddingBottom"
                                    type="number"
                                    value={parseInt(editStyles.paddingBottom) || 0}
                                    onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingLeft">Izquierda</Label>
                                <Input
                                    id="paddingLeft"
                                    type="number"
                                    value={parseInt(editStyles.paddingLeft) || 0}
                                    onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="borderRadius">Borde redondeado</Label>
                                <Input
                                    id="borderRadius"
                                    type="number"
                                    value={parseInt(editStyles.borderRadius) || 0}
                                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="borderWidth">Grosor de borde</Label>
                                <Input
                                    id="borderWidth"
                                    type="number"
                                    value={parseInt(editStyles.borderWidth) || 0}
                                    onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">Colores para en stock</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label htmlFor="inStockBgColor" className="text-xs">Color fondo</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={inStockBgColor}
                                        onChange={(hex) => handleStyleChange('inStockBgColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('inStockBgColor', 'theme.success_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="inStockColor" className="text-xs">Color texto</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={inStockColor}
                                        onChange={(hex) => handleStyleChange('inStockColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('inStockColor', 'theme.success_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="inStockBorderColor" className="text-xs">Color borde</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={inStockBorderColor}
                                        onChange={(hex) => handleStyleChange('inStockBorderColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('inStockBorderColor', 'theme.success_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-sm">Colores para agotado</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label htmlFor="outOfStockBgColor" className="text-xs">Color fondo</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={outOfStockBgColor}
                                        onChange={(hex) => handleStyleChange('outOfStockBgColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('outOfStockBgColor', 'theme.danger_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="outOfStockColor" className="text-xs">Color texto</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={outOfStockColor}
                                        onChange={(hex) => handleStyleChange('outOfStockColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('outOfStockColor', 'theme.danger_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="outOfStockBorderColor" className="text-xs">Color borde</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <ColorPicker
                                        value={outOfStockBorderColor}
                                        onChange={(hex) => handleStyleChange('outOfStockBorderColor', hex)}
                                        showOpacity={false}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleStyleChange('outOfStockBorderColor', 'theme.danger_color')}
                                    >
                                        Tema
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default React.memo(ProductDetailStockEditDialog);