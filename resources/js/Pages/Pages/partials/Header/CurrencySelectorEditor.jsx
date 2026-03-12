import React, { useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { resolveStyleValue } from '@/utils/themeUtils';

const CurrencySelectorEditor = ({
    buttonConfig,
    onUpdate,
    themeSettings,
    appliedTheme
}) => {
    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    const textColor = resolveValue(buttonConfig?.styles?.textColor) || 'inherit';
    const borderColor = resolveValue(buttonConfig?.styles?.borderColor) || 'transparent';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Selector de Moneda</Label>
                    <p className="text-xs text-muted-foreground">
                        Personaliza la apariencia del selector de divisa.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pl-2 border-l-2 border-muted">
                <div>
                    <Label htmlFor="currencyTextColor">Color del Texto</Label>
                    <ColorPicker
                        value={textColor}
                        onChange={(hex) => onUpdate({
                            styles: { ...buttonConfig.styles, textColor: hex }
                        })}
                    />
                </div>

                <div>
                    <Label htmlFor="currencyFontSize">Tamaño de Fuente (px)</Label>
                    <Input
                        id="currencyFontSize"
                        type="number"
                        value={parseInt(buttonConfig?.styles?.fontSize) || 14}
                        onChange={(e) => onUpdate({
                            styles: { ...buttonConfig.styles, fontSize: e.target.value }
                        })}
                        placeholder="14"
                    />
                </div>
                
                <div>
                    <Label htmlFor="currencyFontWeight">Peso de Fuente</Label>
                    <Input
                        id="currencyFontWeight"
                        value={buttonConfig?.styles?.fontWeight || '500'}
                        onChange={(e) => onUpdate({
                            styles: { ...buttonConfig.styles, fontWeight: e.target.value }
                        })}
                        placeholder="500"
                    />
                </div>

                <div className="space-y-4 pt-2 border-t border-muted mt-2">
                    <h5 className="text-sm font-medium">Borde y Estilo</h5>
                    
                    <div>
                        <Label htmlFor="currencyBorderColor">Color del Borde</Label>
                        <ColorPicker
                            value={borderColor}
                            onChange={(hex) => onUpdate({
                                styles: { ...buttonConfig.styles, borderColor: hex }
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="currencyBorderWidth">Grosor (px)</Label>
                            <Input
                                id="currencyBorderWidth"
                                type="number"
                                value={parseInt(buttonConfig?.styles?.borderWidth) || 0}
                                onChange={(e) => onUpdate({
                                    styles: { ...buttonConfig.styles, borderWidth: e.target.value }
                                })}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="currencyBorderRadius">Radio (px)</Label>
                            <Input
                                id="currencyBorderRadius"
                                type="number"
                                value={parseInt(buttonConfig?.styles?.borderRadius) || 4}
                                onChange={(e) => onUpdate({
                                    styles: { ...buttonConfig.styles, borderRadius: e.target.value }
                                })}
                                placeholder="4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CurrencySelectorEditor);
