import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/Components/ui/color-picker';

const AnnouncementBarEditDialog = ({
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

    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateContent = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    // Asegurar que editContent sea un objeto
    const content = typeof editContent === 'object' ? editContent : {};

    // Valores resueltos para los ColorPicker
    const bgColor = resolveValue(editStyles.backgroundColor) || '#000000';
    const arrowBgColor = resolveValue(editStyles.arrowBackgroundColor) || '#000000';
    const arrowIconColor = resolveValue(editStyles.arrowIconColor) || '#ffffff';
    const arrowBorderColor = resolveValue(editStyles.arrowBorderColor) || '#ffffff';
    const arrowHoverBgColor = resolveValue(editStyles.arrowHoverBackgroundColor) || 'rgba(255,255,255,0.4)';

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuración de Barra de Anuncios</h3>

            {/* Configuración del carrusel */}
            <div className="space-y-4">
                <h4 className="font-medium">Configuración del Carrusel</h4>

                <div>
                    <Label htmlFor="autoplayTime">Tiempo de Auto-rotación (segundos)</Label>
                    <Input
                        id="autoplayTime"
                        type="number"
                        min="1"
                        max="10"
                        value={content.autoplayTime || 5}
                        onChange={(e) => updateContent('autoplayTime', parseInt(e.target.value))}
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Tiempo entre cambios automáticos de anuncios (1-10 segundos)
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Configuración de apariencia */}
            <div className="space-y-4">
                <h4 className="font-medium">Apariencia</h4>

                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <ColorPicker
                        value={bgColor}
                        onChange={(hex) => updateStyle('backgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <div>
                    <Label>Padding</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-gray-600">Superior</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editStyles.paddingTop) || 15}
                                onChange={(e) => updateStyle('paddingTop', e.target.value)}
                                placeholder="15"
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-gray-600">Inferior</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editStyles.paddingBottom) || 15}
                                onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                                placeholder="15"
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-gray-600">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editStyles.paddingLeft) || 20}
                                onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                                placeholder="20"
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight" className="text-xs text-gray-600">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editStyles.paddingRight) || 20}
                                onChange={(e) => updateStyle('paddingRight', e.target.value)}
                                placeholder="20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Configuración de las flechas de navegación */}
            <div className="space-y-4">
                <h4 className="font-medium">Flechas de Navegación</h4>

                <div>
                    <Label htmlFor="arrowBackgroundColor">Color de Fondo de las Flechas</Label>
                    <ColorPicker
                        value={arrowBgColor}
                        onChange={(hex) => updateStyle('arrowBackgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <div>
                    <Label htmlFor="arrowOpacity">Opacidad de las Flechas</Label>
                    <Input
                        id="arrowOpacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editStyles.arrowOpacity || 1}
                        onChange={(e) => updateStyle('arrowOpacity', parseFloat(e.target.value))}
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Valor entre 0 (transparente) y 1 (opaco)
                    </p>
                </div>

                <div>
                    <Label htmlFor="arrowSize">Tamaño de las Flechas</Label>
                    <Input
                        id="arrowSize"
                        type="number"
                        min="20"
                        max="60"
                        value={parseInt(editStyles.arrowSize) || 32}
                        onChange={(e) => updateStyle('arrowSize', e.target.value)}
                        placeholder="32"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowIconSize">Tamaño del Ícono</Label>
                    <Input
                        id="arrowIconSize"
                        type="number"
                        min="12"
                        max="32"
                        value={parseInt(editStyles.arrowIconSize) || 16}
                        onChange={(e) => updateStyle('arrowIconSize', e.target.value)}
                        placeholder="16"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowIconColor">Color del Ícono</Label>
                    <ColorPicker
                        value={arrowIconColor}
                        onChange={(hex) => updateStyle('arrowIconColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <div>
                    <Label htmlFor="arrowBorderRadius">Radio del Borde</Label>
                    <Input
                        id="arrowBorderRadius"
                        type="number"
                        value={parseInt(editStyles.arrowBorderRadius) || 50}
                        onChange={(e) => updateStyle('arrowBorderRadius', e.target.value)}
                        placeholder="50"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowBorderWidth">Grosor del Borde</Label>
                    <Input
                        id="arrowBorderWidth"
                        type="number"
                        value={parseInt(editStyles.arrowBorderWidth) || 0}
                        onChange={(e) => updateStyle('arrowBorderWidth', e.target.value)}
                        placeholder="0"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowBorderColor">Color del Borde</Label>
                    <ColorPicker
                        value={arrowBorderColor}
                        onChange={(hex) => updateStyle('arrowBorderColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <div>
                    <Label htmlFor="arrowHoverBackgroundColor">Color de Fondo al Hover (Opcional)</Label>
                    <ColorPicker
                        value={arrowHoverBgColor}
                        onChange={(hex, opacity) => {
                            const color = opacity < 1
                                ? `rgba(${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}, ${opacity})`
                                : hex;
                            updateStyle('arrowHoverBackgroundColor', color);
                        }}
                        showOpacity={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Ajusta el color y la opacidad según necesites.
                    </p>
                </div>
            </div>

            <Separator className="my-4" />

            {/* Información sobre los anuncios */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Gestión de Anuncios</h4>
                <p className="text-sm text-blue-700 mb-2">
                    Para agregar anuncios individuales a esta barra:
                </p>
                <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                    <li>Expande este componente en el árbol de componentes</li>
                    <li>Haz clic en "Agregar bloque" debajo de la barra de anuncios</li>
                    <li>Selecciona "Anuncio" para agregar un nuevo anuncio</li>
                    <li>Configura el texto y navegación de cada anuncio individualmente</li>
                </ol>
                <p className="text-sm text-blue-700 mt-2">
                    <strong>Nota:</strong> Si hay múltiples anuncios, se mostrarán en carrusel con navegación automática y manual.
                </p>
            </div>
        </div>
    );
};

export default AnnouncementBarEditDialog;