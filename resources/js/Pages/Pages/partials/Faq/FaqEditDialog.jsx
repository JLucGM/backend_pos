import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { ColorPicker } from '@/components/ui/color-picker';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';

const FaqEditDialog = ({
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

export default React.memo(FaqEditDialog);