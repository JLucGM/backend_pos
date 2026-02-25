// components/BuilderPages/partials/HeroBannerEditDialog.jsx
import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { Separator } from '@/Components/ui/separator';

const HeroBannerEditDialog = ({
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

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="heightVh">Altura</Label>
                <Input
                    id="heightVh"
                    type="number"
                    min="0"
                    max="100"
                    value={editContent.heightVh !== undefined ? editContent.heightVh : 100}
                    onChange={(e) => handleContentChange('heightVh', parseInt(e.target.value) || 100)}
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

            <div className="space-y-2">
                <Label>Padding del contenedor</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editContent.paddingTop) || 40}
                            onChange={(e) => handleContentChange('paddingTop', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editContent.paddingRight) || 20}
                            onChange={(e) => handleContentChange('paddingRight', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editContent.paddingBottom) || 40}
                            onChange={(e) => handleContentChange('paddingBottom', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editContent.paddingLeft) || 20}
                            onChange={(e) => handleContentChange('paddingLeft', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* <div className="space-y-2">
                <Label htmlFor="gap">Espacio entre columnas</Label>
                <Input
                    id="gap"
                    type="number"
                    value={parseInt(editContent.gap) || 40}
                    onChange={(e) => handleContentChange('gap', e.target.value)}
                />
            </div> */}

            <div className="space-y-2">
                <Label htmlFor="textGap">Espacio entre elementos de texto</Label>
                <Input
                    id="textGap"
                    type="number"
                    value={parseInt(editContent.textGap) || 20}
                    onChange={(e) => handleContentChange('textGap', e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="textAlign">Alineación del texto</Label>
                <Select
                    value={editContent.textAlign || 'left'}
                    onValueChange={(value) => handleContentChange('textAlign', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            
        </div>
    );
};

export default React.memo(HeroBannerEditDialog);