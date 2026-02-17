import React, { useEffect, useState, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const FooterMenuEditDialog = ({
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

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    }, [themeWithDefaults, appliedTheme]);

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
                items: editContent
            });
            setSelectedMenuId('none');
        }
    }, [editContent, setEditContent]);

    const handleMenuChange = useCallback((menuId) => {
        setSelectedMenuId(menuId);

        if (menuId === 'none') {
            setEditContent({
                menuId: null,
                items: []
            });
        } else {
            const selectedMenu = availableMenus?.find(menu => menu.id.toString() === menuId);
            setEditContent({
                menuId: selectedMenu ? parseInt(menuId) : null,
                items: selectedMenu ? selectedMenu.items : []
            });
        }
    }, [availableMenus, setEditContent]);

    const resetTypographyToDefaults = useCallback(() => {
        const defaultStyles = {
            fontSize: '14px',
            fontWeight: 'normal',
            textTransform: 'none',
            lineHeight: '1.6',
            fontType: 'default',
            customFont: '',
        };

        setEditStyles(prev => ({
            ...prev,
            ...defaultStyles
        }));
    }, [setEditStyles]);

    const currentFontType = editStyles.fontType || 'default';
    const colorValue = resolveValue(editStyles.color) || '#666666';

    return (
        <div className="space-y-4">
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

            </div>

            <Separator className="my-4" />

            <div>

                <div className="mb-3">
                    <Label htmlFor="display">Tipo de visualización</Label>
                    <Select
                        value={editStyles.display || 'column'}
                        onValueChange={(value) => updateStyle('display', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="column">En columna</SelectItem>
                            <SelectItem value="row">En fila</SelectItem>
                            <SelectItem value="grid">En grid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-3">
                    <Label htmlFor="gap">Espaciado entre elementos</Label>
                    <Select
                        value={editStyles.gap || '10px'}
                        onValueChange={(value) => updateStyle('gap', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5px">Pequeño (5px)</SelectItem>
                            <SelectItem value="10px">Mediano (10px)</SelectItem>
                            <SelectItem value="15px">Grande (15px)</SelectItem>
                            <SelectItem value="20px">Extra Grande (20px)</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.gap === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customGap">Espaciado personalizado</Label>
                        <div className="flex gap-2">
                            <Input
                                id="customGap"
                                type="number"
                                value={parseInt(editStyles.customGap) || ''}
                                onChange={(e) => updateStyle('customGap', e.target.value)}
                                placeholder="Ej: 12"
                                className="flex-1"
                            />
                            <Select
                                value={editStyles.customGapUnit || 'px'}
                                onValueChange={(value) => updateStyle('customGapUnit', value)}
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
                )}
            </div>

            <Separator className="my-4" />

            <div className="mb-3">
                <Label htmlFor="color">Color del texto</Label>
                <ColorPicker
                    value={colorValue}
                    onChange={(hex) => updateStyle('color', hex)}
                    showOpacity={false}
                />
            </div>

            <div>
                <div className="mb-3">
                    <Label htmlFor="fontSize">Tamaño de fuente</Label>
                    <Select
                        value={editStyles.fontSize || '14px'}
                        onValueChange={(value) => updateStyle('fontSize', value)}
                        className="flex-1"
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="12px">Pequeño (12px)</SelectItem>
                            <SelectItem value="14px">Mediano (14px)</SelectItem>
                            <SelectItem value="16px">Grande (16px)</SelectItem>
                            <SelectItem value="18px">Extra Grande (18px)</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.fontSize === 'custom' && (
                    <div className="mb-3">
                        <Label htmlFor="customFontSize">Tamaño personalizado</Label>
                        <div className="flex gap-2">
                            <Input
                                id="customFontSize"
                                type="number"
                                value={parseInt(editStyles.customFontSize) || ''}
                                onChange={(e) => updateStyle('customFontSize', e.target.value)}
                                placeholder="Ej: 15"
                                className="flex-1"
                            />
                            <Select
                                value={editStyles.customFontSizeUnit || 'px'}
                                onValueChange={(value) => updateStyle('customFontSizeUnit', value)}
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
                )}

                <div className="mb-3">
                    <Label htmlFor="fontWeight">Peso de fuente</Label>
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
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-3">
                    <Label htmlFor="textTransform">Transformación de texto</Label>
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
                                Por defecto (usar fuente del tema)
                            </SelectItem>
                            <SelectItem value="body_font">
                                Body Font ({themeSettings?.body_font || 'Inter'})
                            </SelectItem>
                            <SelectItem value="heading_font">
                                Heading Font ({themeSettings?.heading_font || 'Inter'})
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

        </div>
    );
};

export default React.memo(FooterMenuEditDialog);