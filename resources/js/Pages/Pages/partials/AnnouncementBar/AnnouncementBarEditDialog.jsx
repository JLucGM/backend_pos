import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const AnnouncementBarEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateContent = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    // Asegurar que editContent sea un objeto
    const content = typeof editContent === 'object' ? editContent : {};

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
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="backgroundColor"
                            value={editStyles.backgroundColor || '#000000'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.backgroundColor || '#000000'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                <div>
                    <Label>Padding (px)</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                            <Label htmlFor="paddingTop" className="text-xs text-gray-600">Superior</Label>
                            <Input
                                id="paddingTop"
                                type="number"
                                min="0"
                                max="100"
                                value={parseInt(editStyles.paddingTop) || 15}
                                onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingBottom" className="text-xs text-gray-600">Inferior</Label>
                            <Input
                                id="paddingBottom"
                                type="number"
                                min="0"
                                max="100"
                                value={parseInt(editStyles.paddingBottom) || 15}
                                onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingLeft" className="text-xs text-gray-600">Izquierda</Label>
                            <Input
                                id="paddingLeft"
                                type="number"
                                min="0"
                                max="100"
                                value={parseInt(editStyles.paddingLeft) || 20}
                                onChange={(e) => updateStyle('paddingLeft', `${e.target.value}px`)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="paddingRight" className="text-xs text-gray-600">Derecha</Label>
                            <Input
                                id="paddingRight"
                                type="number"
                                min="0"
                                max="100"
                                value={parseInt(editStyles.paddingRight) || 20}
                                onChange={(e) => updateStyle('paddingRight', `${e.target.value}px`)}
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
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="arrowBackgroundColor"
                            value={editStyles.arrowBackgroundColor || '#000000'}
                            onChange={(e) => updateStyle('arrowBackgroundColor', e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.arrowBackgroundColor || '#000000'}
                            onChange={(e) => updateStyle('arrowBackgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
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
                    <Label htmlFor="arrowSize">Tamaño de las Flechas (px)</Label>
                    <Input
                        id="arrowSize"
                        type="number"
                        min="20"
                        max="60"
                        value={parseInt(editStyles.arrowSize) || 32}
                        onChange={(e) => updateStyle('arrowSize', `${e.target.value}px`)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowIconSize">Tamaño del Ícono (px)</Label>
                    <Input
                        id="arrowIconSize"
                        type="number"
                        min="12"
                        max="32"
                        value={parseInt(editStyles.arrowIconSize) || 16}
                        onChange={(e) => updateStyle('arrowIconSize', e.target.value)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowIconColor">Color del Ícono</Label>
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="arrowIconColor"
                            value={editStyles.arrowIconColor || '#ffffff'}
                            onChange={(e) => updateStyle('arrowIconColor', e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.arrowIconColor || '#ffffff'}
                            onChange={(e) => updateStyle('arrowIconColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="arrowBorderRadius">Radio del Borde</Label>
                    <Input
                        id="arrowBorderRadius"
                        value={editStyles.arrowBorderRadius || '50%'}
                        onChange={(e) => updateStyle('arrowBorderRadius', e.target.value)}
                        placeholder="50% (circular) o 8px (redondeado)"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowBorderWidth">Grosor del Borde (px)</Label>
                    <Input
                        id="arrowBorderWidth"
                        type="number"
                        min="0"
                        max="5"
                        value={parseInt(editStyles.arrowBorderWidth) || 0}
                        onChange={(e) => updateStyle('arrowBorderWidth', `${e.target.value}px`)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="arrowBorderColor">Color del Borde</Label>
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="arrowBorderColor"
                            value={editStyles.arrowBorderColor || 'transparent'}
                            onChange={(e) => updateStyle('arrowBorderColor', e.target.value)}
                            placeholder="transparent"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.arrowBorderColor === 'transparent' ? '#ffffff' : editStyles.arrowBorderColor || '#ffffff'}
                            onChange={(e) => updateStyle('arrowBorderColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="arrowHoverBackgroundColor">Color de Fondo al Hover (Opcional)</Label>
                    <div className="flex gap-2 mt-1">
                        <Input
                            id="arrowHoverBackgroundColor"
                            value={editStyles.arrowHoverBackgroundColor || ''}
                            onChange={(e) => updateStyle('arrowHoverBackgroundColor', e.target.value)}
                            placeholder="rgba(255, 255, 255, 0.4)"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value="#ffffff"
                            onChange={(e) => {
                                const hex = e.target.value;
                                const rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16));
                                updateStyle('arrowHoverBackgroundColor', `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`);
                            }}
                            className="w-12"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Si se deja vacío, se usará el efecto hover automático
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