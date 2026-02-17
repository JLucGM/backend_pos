// components/BuilderPages/partials/HeaderMenuEditDialog.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const HeaderMenuEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    availableMenus,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    // Estado para el menú seleccionado
    const [selectedMenuId, setSelectedMenuId] = useState(
        editContent && editContent.menuId ? editContent.menuId.toString() : 'none'
    );

    // Efecto para convertir editContent si es un array (estructura antigua)
    useEffect(() => {
        if (Array.isArray(editContent)) {
            setEditContent({
                menuId: null,
            });
            setSelectedMenuId('none');
        } else if (editContent?.menuId) {
            setSelectedMenuId(editContent.menuId.toString());
        }
    }, [editContent, setEditContent]);

    const handleMenuChange = useCallback((menuId) => {
        setSelectedMenuId(menuId);

        if (menuId === 'none') {
            setEditContent({
                menuId: null,
            });
        } else {
            setEditContent({
                menuId: parseInt(menuId),
            });
        }
    }, [setEditContent]);

    const resetTypographyToDefaults = useCallback(() => {
        const defaultStyles = {
            fontSize: '16px',
            fontWeight: 'normal',
            textTransform: 'none',
            fontType: 'default',
            customFont: '',
        };

        setEditStyles(prev => ({
            ...prev,
            ...defaultStyles
        }));
    }, [setEditStyles]);

    const currentFontType = editStyles.fontType || 'default';

    // Valores resueltos para ColorPicker
    const colorValue = resolveValue(editStyles.color) || '#000000';
    const buttonBackgroundColor = resolveValue(editStyles.buttonBackgroundColor);
    const buttonBgColorForPicker = (buttonBackgroundColor && buttonBackgroundColor !== 'transparent') ? buttonBackgroundColor : '#ffffff';
    const hoverColorValue = resolveValue(editStyles.hoverColor) || '#000000';
    const hoverBgColorValue = resolveValue(editStyles.hoverBackgroundColor) || '#f3f4f6';
    const borderColorValue = resolveValue(editStyles.borderColor) || '#000000';

    return (
        <div className="space-y-4">
            {/* Botón para restablecer tipografía */}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetTypographyToDefaults}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restablecer tipografía
                </Button>
            </div>

            {/* Menú Dinámico */}
            <div>
                <h4 className="font-medium mb-3">Menú Dinámico</h4>
                <Select value={selectedMenuId} onValueChange={handleMenuChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un menú" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin menú (editar manualmente)</SelectItem>
                        {availableMenus?.map(menu => (
                            <SelectItem key={menu.id} value={menu.id.toString()}>
                                {menu.name} ({menu.items?.length || 0} items)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                    Selecciona un menú dinámico para usar en el header. Los items se cargarán automáticamente.
                </p>
            </div>

            <Separator className="my-4" />

            {/* Tipografía de los botones */}
            <div>
                <h4 className="font-medium mb-3">Tipografía de los botones</h4>

                {/* Tamaño de fuente */}
                <div className="mb-3">
                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.fontSize || '16px'}
                            onValueChange={(value) => updateStyle('fontSize', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="14px">Pequeño (14px)</SelectItem>
                                <SelectItem value="16px">Mediano (16px)</SelectItem>
                                <SelectItem value="18px">Grande (18px)</SelectItem>
                                <SelectItem value="20px">Extra Grande (20px)</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {editStyles.fontSize === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customFontSize">Tamaño personalizado</Label>
                        <Input
                            id="customFontSize"
                            value={editStyles.customFontSize || ''}
                            onChange={(e) => updateStyle('customFontSize', e.target.value)}
                            placeholder="Ej: 17px, 1.1rem"
                        />
                    </div>
                )}

                {/* Peso de fuente */}
                <div className="mb-3">
                    <Label htmlFor="fontWeight">Peso de fuente</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.fontWeight || 'normal'}
                            onValueChange={(value) => updateStyle('fontWeight', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="300">Ligero</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="500">Medio</SelectItem>
                                <SelectItem value="600">Seminegrita</SelectItem>
                                <SelectItem value="700">Negrita</SelectItem>
                                <SelectItem value="800">Extra Negrita</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Transformación de texto */}
                <div className="mb-3">
                    <Label htmlFor="textTransform">Transformación de texto</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.textTransform || 'none'}
                            onValueChange={(value) => updateStyle('textTransform', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Normal</SelectItem>
                                <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                                <SelectItem value="lowercase">minúsculas</SelectItem>
                                <SelectItem value="capitalize">Capitalizar Palabras</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Altura de línea */}
                <div className="mb-3">
                    <Label htmlFor="lineHeight">Altura de línea</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.lineHeight || 'normal'}
                            onValueChange={(value) => updateStyle('lineHeight', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tight">Tight (1.2)</SelectItem>
                                <SelectItem value="normal">Normal (1.4)</SelectItem>
                                <SelectItem value="loose">Loose (1.6)</SelectItem>
                                <SelectItem value="custom">Personalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {editStyles.lineHeight === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customLineHeight">Altura personalizada</Label>
                        <Input
                            id="customLineHeight"
                            value={editStyles.customLineHeight || ''}
                            onChange={(e) => updateStyle('customLineHeight', e.target.value)}
                            placeholder="Ej: 1.5"
                        />
                    </div>
                )}

                <Separator className="my-4" />

                {/* Tipo de fuente */}
                <div className="mb-3">
                    <Label htmlFor="fontType">Tipo de Fuente</Label>
                    <Select
                        value={currentFontType}
                        onValueChange={(value) => updateStyle('fontType', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">
                                Por defecto (usar fuente del tema para menús)
                            </SelectItem>
                            <SelectItem value="body_font">
                                Body Font ({themeSettings?.body_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="heading_font">
                                Heading Font ({themeSettings?.heading_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="subheading_font">
                                Subheading Font ({themeSettings?.subheading_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="accent_font">
                                Accent Font ({themeSettings?.accent_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {currentFontType === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customFont">Fuente Personalizada</Label>
                        <Input
                            id="customFont"
                            value={editStyles.customFont || ''}
                            onChange={(e) => updateStyle('customFont', e.target.value)}
                            placeholder="'Roboto', 'Arial', sans-serif"
                        />
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* COLORES DE LOS BOTONES */}
            <div>
                <h4 className="font-medium mb-3">Colores de los botones</h4>

                {/* Color del texto */}
                <div className="mb-3">
                    <Label htmlFor="color">Color del texto</Label>
                    <ColorPicker
                        value={colorValue}
                        onChange={(hex) => updateStyle('color', hex)}
                        showOpacity={false}
                    />
                </div>

                {/* Color de fondo de los botones (con soporte para transparente) */}
                <div className="mb-3">
                    <Label htmlFor="buttonBackgroundColor">Color de fondo de los botones</Label>
                    <div className="flex items-center gap-2">
                        <ColorPicker
                            value={buttonBgColorForPicker}
                            onChange={(hex) => updateStyle('buttonBackgroundColor', hex)}
                            showOpacity={false}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateStyle('buttonBackgroundColor', 'transparent')}
                        >
                            Sin fondo
                        </Button>
                    </div>
                </div>

                {/* Color hover del texto */}
                <div className="mb-3">
                    <Label htmlFor="hoverColor">Color hover (texto)</Label>
                    <ColorPicker
                        value={hoverColorValue}
                        onChange={(hex) => updateStyle('hoverColor', hex)}
                        showOpacity={false}
                    />
                </div>

                {/* Color de fondo hover */}
                <div className="mb-3">
                    <Label htmlFor="hoverBackgroundColor">Color de fondo hover</Label>
                    <ColorPicker
                        value={hoverBgColorValue}
                        onChange={(hex) => updateStyle('hoverBackgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>
            </div>

            <Separator className="my-4" />

            {/* BORDES DE LOS BOTONES */}
            <div>
                <h4 className="font-medium mb-3">Bordes de los botones</h4>

                {/* Ancho del borde */}
                <div className="mb-3">
                    <Label htmlFor="borderWidth">Ancho del borde</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.borderWidth || '0px'}
                            onValueChange={(value) => updateStyle('borderWidth', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0px">Sin borde</SelectItem>
                                <SelectItem value="1px">Fino (1px)</SelectItem>
                                <SelectItem value="2px">Mediano (2px)</SelectItem>
                                <SelectItem value="3px">Grueso (3px)</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {editStyles.borderWidth === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customBorderWidth">Ancho personalizado</Label>
                        <Input
                            id="customBorderWidth"
                            value={editStyles.customBorderWidth || ''}
                            onChange={(e) => updateStyle('customBorderWidth', e.target.value)}
                            placeholder="Ej: 4px"
                        />
                    </div>
                )}

                {/* Color del borde */}
                <div className="mb-3">
                    <Label htmlFor="borderColor">Color del borde</Label>
                    <ColorPicker
                        value={borderColorValue}
                        onChange={(hex) => updateStyle('borderColor', hex)}
                        showOpacity={false}
                    />
                </div>

                {/* Border-radius */}
                <div className="mb-3">
                    <Label htmlFor="borderRadius">Radio de borde</Label>
                    <div className="flex gap-2">
                        <Select
                            value={editStyles.borderRadius || '0px'}
                            onValueChange={(value) => updateStyle('borderRadius', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0px">Sin redondeo</SelectItem>
                                <SelectItem value="4px">Pequeño (4px)</SelectItem>
                                <SelectItem value="8px">Mediano (8px)</SelectItem>
                                <SelectItem value="12px">Grande (12px)</SelectItem>
                                <SelectItem value="9999px">Completo (círculo)</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {editStyles.borderRadius === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customBorderRadius">Radio personalizado</Label>
                        <Input
                            id="customBorderRadius"
                            value={editStyles.customBorderRadius || ''}
                            onChange={(e) => updateStyle('customBorderRadius', e.target.value)}
                            placeholder="Ej: 10px, 50%"
                        />
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* PADDING DE LOS BOTONES */}
            <div>
                <h4 className="font-medium mb-3">Padding de los botones (px)</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 5}
                            onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 10}
                            onChange={(e) => updateStyle('paddingRight', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 5}
                            onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 10}
                            onChange={(e) => updateStyle('paddingLeft', `${e.target.value}px`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(HeaderMenuEditDialog);