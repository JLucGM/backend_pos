import React, { useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { resolveStyleValue, getThemeWithDefaults } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

const ProductListPriceFilterEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme
}) => {
    const themeWithDefaults = getThemeWithDefaults(themeSettings, appliedTheme);
    const resolveValue = useCallback((value) => resolveStyleValue(value, themeWithDefaults, appliedTheme), [themeWithDefaults, appliedTheme]);

    const updateStyles = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const borderColor = resolveValue(editStyles.borderColor) || '#cccccc';
    const backgroundColor = resolveValue(editStyles.background) || '#ffffff';

    return (
        <div className="space-y-4">
            <div>
                <Label>Border Radius (px)</Label>
                <Input
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 4}
                    onChange={(e) => updateStyles('borderRadius', `${e.target.value}px`)}
                />
            </div>

            <div>
                <Label>Color del Borde</Label>
                <div className="flex items-center gap-2">
                    <ColorPicker
                        value={borderColor}
                        onChange={(hex) => updateStyles('borderColor', hex)}
                        showOpacity={false}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStyles('borderColor', 'theme.borders')}
                    >
                        Tema
                    </Button>
                </div>
            </div>

            <div>
                <Label>Color de Fondo</Label>
                <div className="flex items-center gap-2">
                    <ColorPicker
                        value={backgroundColor}
                        onChange={(hex) => updateStyles('background', hex)}
                        showOpacity={false}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStyles('background', 'theme.background')}
                    >
                        Tema
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductListPriceFilterEditDialog);