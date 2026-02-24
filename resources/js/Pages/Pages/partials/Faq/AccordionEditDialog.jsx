import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';

const AccordionEditDialog = ({
    editContent,
    setEditContent,
    isLiveEdit = true,
    themeSettings,
    appliedTheme
}) => {
    const debouncedContent = useDebounce(editContent, 300);

    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);

    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeWithDefaults, appliedTheme);
    }, [themeWithDefaults, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, isLiveEdit]);

    const handleContentChange = useCallback((key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    }, [setEditContent]);

    const bgColor = resolveValue(editContent.backgroundColor) || resolveValue(themeWithDefaults.background) || '#ffffff';
    const borderColor = resolveValue(editContent.borderColor) || resolveValue(themeWithDefaults.borders) || '#e5e7eb';

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Padding</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editContent.paddingTop) || 0}
                            onChange={(e) => handleContentChange('paddingTop', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editContent.paddingRight) || 0}
                            onChange={(e) => handleContentChange('paddingRight', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editContent.paddingBottom) || 0}
                            onChange={(e) => handleContentChange('paddingBottom', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editContent.paddingLeft) || 0}
                            onChange={(e) => handleContentChange('paddingLeft', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Border</Label>
                <Select
                    value={editContent.border || 'none'}
                    onValueChange={(value) => handleContentChange('border', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de border" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin border</SelectItem>
                        <SelectItem value="solid">Border sólido</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editContent.border === 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="borderThickness">Grosor del border</Label>
                        <Input
                            id="borderThickness"
                            type="number"
                            value={parseInt(editContent.borderThickness) || 1}
                            onChange={(e) => handleContentChange('borderThickness', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="borderColor">Color del border</Label>
                        <ColorPicker
                            value={borderColor}
                            onChange={(hex) => handleContentChange('borderColor', hex)}
                            showOpacity={false}
                        />
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label htmlFor="borderRadius">Border radius</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editContent.borderRadius) || 0}
                    onChange={(e) => handleContentChange('borderRadius', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <ColorPicker
                    value={bgColor}
                    onChange={(hex) => handleContentChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>
        </div>
    );
};

export default React.memo(AccordionEditDialog);