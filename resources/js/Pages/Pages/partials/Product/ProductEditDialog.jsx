// components/BuilderPages/partials/ProductEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductEditDialog = ({
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
    const resolveValue = useCallback((value) => resolveStyleValue(value, themeWithDefaults, appliedTheme), [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateProductConfig = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
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
            </div>

            <div>
                <Label htmlFor="limit">Límite de Productos</Label>
                <Input
                    id="limit"
                    type="number"
                    value={editContent.limit || 8}
                    onChange={(e) => updateProductConfig('limit', parseInt(e.target.value))}
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateProductConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div>
                <Label htmlFor="sourceType">Fuente de Productos</Label>
                <Select
                    value={editContent.sourceType || 'latest'}
                    onValueChange={(value) => updateProductConfig('sourceType', value)}
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
                <div>
                    <Label htmlFor="collectionId">Seleccionar Colección</Label>
                    <Select
                        value={editContent.collectionId?.toString() || ''}
                        onValueChange={(value) => updateProductConfig('collectionId', value)}
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
        </div>
    );
};

export default React.memo(ProductEditDialog);