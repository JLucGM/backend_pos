import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductPriceEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    const resetToDefaults = () => {
        const textStyle = editStyles.textStyle || 'paragraph';

        if (textStyle === 'paragraph' && themeSettings) {
            setEditStyles(prev => ({
                ...prev,
                fontSize: themeSettings.paragraph_fontSize || '16px',
                fontWeight: themeSettings.paragraph_fontWeight || 'normal',
                lineHeight: themeSettings.paragraph_lineHeight || '1.6',
                textTransform: themeSettings.paragraph_textTransform || 'none',
                fontType: 'default',
                customFont: '',
            }));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetToDefaults}
                    className="flex items-center gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restablecer tipografía
                </Button>
            </div>

            <div>
                <Label htmlFor="textTransform">Transformación de texto</Label>
                <div className="flex gap-2">
                    <Select
                        value={editStyles.textTransform || 'none'}
                        onValueChange={(value) => updateStyle('textTransform', value)}
                        className="flex-1"
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Normal</SelectItem>
                            <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                            <SelectItem value="lowercase">minúsculas</SelectItem>
                            <SelectItem value="capitalize">Capitalizar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="textStyle">Estilo de Texto</Label>
                <Select
                    value={editStyles.textStyle || 'paragraph'}
                    onValueChange={(value) => {
                        updateStyle('textStyle', value);

                        if (value === 'paragraph' && themeSettings) {
                            updateStyle('fontSize', themeSettings.paragraph_fontSize || '16px');
                            updateStyle('fontWeight', themeSettings.paragraph_fontWeight || 'normal');
                            updateStyle('lineHeight', themeSettings.paragraph_lineHeight || '1.6');
                            updateStyle('textTransform', themeSettings.paragraph_textTransform || 'none');
                            updateStyle('fontType', 'default');
                            updateStyle('customFont', '');
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="paragraph">
                            Párrafo - {themeSettings?.paragraph_fontSize || '16px'}
                        </SelectItem>
                        <SelectItem value="custom">
                            Personalizado
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.textStyle === 'custom' && (
                <>
                    <div>
                        <Label htmlFor="fontSize">Tamaño de fuente</Label>
                        <Input
                            id="fontSize"
                            value={editStyles.fontSize || '14px'}
                            onChange={(e) => updateStyle('fontSize', e.target.value)}
                            placeholder="14px"
                            className="flex-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="fontWeight">Peso de fuente</Label>
                        <Select
                            value={editStyles.fontWeight || 'normal'}
                            onValueChange={(value) => updateStyle('fontWeight', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Negrita</SelectItem>
                                <SelectItem value="600">Seminegrita</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="lineHeight">Altura de línea</Label>
                        <Select
                            value={editStyles.lineHeight || '1.6'}
                            onValueChange={(value) => updateStyle('lineHeight', value)}
                            className="flex-1"
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tight">Tight (1.2)</SelectItem>
                                <SelectItem value="normal">Normal (1.4)</SelectItem>
                                <SelectItem value="loose">Loose (1.6)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="fontType">Tipo de Fuente</Label>
                <Select
                    value={editStyles.fontType || 'default'}
                    onValueChange={(value) => updateStyle('fontType', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">
                            Por defecto (usar fuente del tema para este estilo)
                        </SelectItem>
                        <SelectItem value="body_font">
                            Body Font ({themeSettings?.body_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="heading_font">
                            Heading Font ({themeSettings?.heading_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="subheading_font">
                            Subheading Font ({themeSettings?.subheading_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="accent_font">
                            Accent Font ({themeSettings?.accent_font || 'Inter'})
                        </SelectItem>
                        <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.fontType === 'custom' && (
                <div>
                    <Label htmlFor="customFont">Fuente Personalizada</Label>
                    <Input
                        id="customFont"
                        value={editStyles.customFont || ''}
                        onChange={(e) => updateStyle('customFont', e.target.value)}
                        placeholder="'Roboto', sans-serif"
                    />
                </div>
            )}

            <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Estilo de contenedor</h4>

                <div>
                    <Label htmlFor="layout">Layout</Label>
                    <Select
                        value={editStyles.layout || 'fit'}
                        onValueChange={(value) => updateStyle('layout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                            <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {editStyles.layout === 'fill' && (
                    <div>
                        <Label htmlFor="alignment">Alineación</Label>
                        <Select
                            value={editStyles.alignment || 'left'}
                            onValueChange={(value) => updateStyle('alignment', value)}
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
                )}

                <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            value={editStyles.color || '#666666'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            placeholder="#666666"
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.color || '#666666'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPriceEditDialog;