import React, { useEffect, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductListEditDialog = ({
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
            // cambios en vivo
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateConfig = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent?.backgroundColor) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="sourceType">Fuente de Productos</Label>
                <div className="mb-4">
                    <Select
                        value={editContent?.sourceType || 'latest'}
                        onValueChange={(value) => updateConfig('sourceType', value)}
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

                {editContent?.sourceType === 'collection' && (
                    <div className="mb-4">
                        <Label htmlFor="collectionId">Seleccionar Colección</Label>
                        <Select
                            value={editContent?.collectionId?.toString() || ''}
                            onValueChange={(value) => updateConfig('collectionId', value)}
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

                <Label>Columnas</Label>
                <Input
                    type="number"
                    value={parseInt(editContent?.columns) || 3}
                    onChange={(e) => updateConfig('columns', parseInt(e.target.value) || 1)}
                />
            </div>

            <div>
                <Label>Límite por página</Label>
                <Input
                    type="number"
                    value={parseInt(editContent?.limit) || 8}
                    onChange={(e) => updateConfig('limit', parseInt(e.target.value) || 1)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Gap X (ej. 10px)</Label>
                    <Input
                        value={resolveValue(editContent?.gapX) || '10px'}
                        onChange={(e) => updateConfig('gapX', e.target.value)}
                    />
                </div>
                <div>
                    <Label>Gap Y (ej. 10px)</Label>
                    <Input
                        value={resolveValue(editContent?.gapY) || '10px'}
                        onChange={(e) => updateConfig('gapY', e.target.value)}
                    />
                </div>
            </div>

            <div>
                <Label>Color de Fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => updateConfig('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>
        </div>
    );
};

export default React.memo(ProductListEditDialog);