import React, { useEffect, useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';

const FooterMenuEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings, availableMenus }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Estado para el menú seleccionado
    const [selectedMenuId, setSelectedMenuId] = useState(
        editContent && editContent.menuId ? editContent.menuId.toString() : 'none'
    );

    // Efecto para convertir editContent si es un array (estructura antigua)
    useEffect(() => {
        if (Array.isArray(editContent)) {
            // Convertir estructura antigua a nueva
            setEditContent({
                menuId: null,
                items: editContent
            });
            setSelectedMenuId('none');
        }
    }, []);

    const handleMenuChange = (menuId) => {
        setSelectedMenuId(menuId);
        
        if (menuId === 'none') {
            // Sin menú seleccionado
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
    };

    // Función para restablecer tipografía a valores por defecto
    const resetTypographyToDefaults = () => {
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
    };

    // Determinar el tipo de fuente actual
    const currentFontType = editStyles.fontType || 'default';

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

            {/* MENÚ DINÁMICO - IGUAL QUE HEADER */}
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
                    Selecciona un menú dinámico para usar en el footer. Los items se cargarán automáticamente.
                </p>
            </div>

            <Separator className="my-4" />

            {/* DISPLAY Y DIRECCIÓN */}
            <div>
                <h4 className="font-medium mb-3">Diseño del Menú</h4>
                
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

                {/* Gap entre elementos */}
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
                        <Input
                            id="customGap"
                            value={editStyles.customGap || ''}
                            onChange={(e) => updateStyle('customGap', e.target.value)}
                            placeholder="Ej: 12px, 1rem"
                        />
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* TIPOGRAFÍA */}
            <div>
                <h4 className="font-medium mb-3">Tipografía</h4>

                {/* Tamaño de fuente */}
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
                        <Input
                            id="customFontSize"
                            value={editStyles.customFontSize || ''}
                            onChange={(e) => updateStyle('customFontSize', e.target.value)}
                            placeholder="Ej: 15px, 1rem"
                        />
                    </div>
                )}

                {/* Peso de fuente */}
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

                {/* Transformación de texto */}
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

            <Separator className="my-4" />

            {/* COLORES */}
            <div>
                <h4 className="font-medium mb-3">Colores</h4>

                {/* Color del texto */}
                <div className="mb-3">
                    <Label htmlFor="color">Color del texto</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            value={editStyles.color || '#666666'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#666666"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.color || '#666666'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                {/* Color hover */}
                <div className="mb-3">
                    <Label htmlFor="hoverColor">Color hover</Label>
                    <div className="flex gap-2">
                        <Input
                            id="hoverColor"
                            value={editStyles.hoverColor || '#007bff'}
                            onChange={(e) => updateStyle('hoverColor', e.target.value)}
                            placeholder="#007bff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.hoverColor || '#007bff'}
                            onChange={(e) => updateStyle('hoverColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                {/* Subrayado al hacer hover */}
                <div className="mb-3">
                    <Label htmlFor="hoverDecoration">Efecto hover</Label>
                    <Select
                        value={editStyles.hoverDecoration || 'underline'}
                        onValueChange={(value) => updateStyle('hoverDecoration', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Ninguno</SelectItem>
                            <SelectItem value="underline">Subrayado</SelectItem>
                            <SelectItem value="overline">Línea superior</SelectItem>
                            <SelectItem value="line-through">Tachado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default FooterMenuEditDialog;