// components/BuilderPages/partials/CarouselEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const CarouselEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    collections = [],
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

    const updateCarouselConfig = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div className="">
                <Label htmlFor="sourceType">Fuente de Productos</Label>
                <Select
                    value={editContent.sourceType || 'latest'}
                    onValueChange={(value) => updateCarouselConfig('sourceType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Últimos Productos</SelectItem>
                        <SelectItem value="collection">Colección Específica</SelectItem>
                        <SelectItem value="manual">Manual (Selección individual)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editContent.sourceType === 'collection' && (
                <div className="">
                    <Label htmlFor="collectionId">Seleccionar Colección</Label>
                    <Select
                        value={editContent.collectionId?.toString() || ''}
                        onValueChange={(value) => updateCarouselConfig('collectionId', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una colección" />
                        </SelectTrigger>
                        <SelectContent>
                            {collections.length > 0 ? (
                                collections.map((collection) => (
                                    <SelectItem key={collection.id} value={collection.id.toString()}>
                                        {collection.title}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-gray-500">
                                    No hay colecciones disponibles
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="">
                <Label htmlFor="limit">Cantidad de Productos</Label>
                <Input
                    id="limit"
                    type="number"
                    value={editContent.limit || 5}
                    onChange={(e) => updateCarouselConfig('limit', parseInt(e.target.value))}
                />
            </div>

            <div className="">
                <Label htmlFor="slidesToShow">Columnas</Label>
                <Select
                    value={editContent.slidesToShow?.toString() || '3'}
                    onValueChange={(value) => updateCarouselConfig('slidesToShow', parseInt(value))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Producto</SelectItem>
                        <SelectItem value="2">2 Productos</SelectItem>
                        <SelectItem value="3">3 Productos</SelectItem>
                        <SelectItem value="4">4 Productos</SelectItem>
                        <SelectItem value="5">5 Productos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            <div className="">
                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateCarouselConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="gapX">Gap Horizontal (px)</Label>
                    <Input
                        id="gapX"
                        type="number"
                        value={parseInt(editContent.gapX) || 10}
                        onChange={(e) => updateCarouselConfig('gapX', e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="gapY">Gap Vertical (px)</Label>
                    <Input
                        id="gapY"
                        type="number"
                        value={parseInt(editContent.gapY) || 10}
                        onChange={(e) => updateCarouselConfig('gapY', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(CarouselEditDialog);