import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const LinkEditDialog = ({
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
        setEditStyles(prev => ({
            ...prev,
            fontSize: themeSettings?.paragraph_fontSize || '16px',
            fontWeight: themeSettings?.paragraph_fontWeight || 'normal',
            lineHeight: themeSettings?.paragraph_lineHeight || '1.6',
            textTransform: themeSettings?.paragraph_textTransform || 'none',
            fontType: 'default',
            customFont: '',
            color: themeSettings?.links ? `hsl(${themeSettings.links})` : '#0000EE',
            textDecoration: 'underline',
        }));
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
                    Restablecer estilos
                </Button>
            </div>

            <div>
                <Label htmlFor="linkContent">Texto del enlace (opcional)</Label>
                <Input
                    id="linkContent"
                    value={editStyles.linkText || ''}
                    onChange={(e) => updateStyle('linkText', e.target.value)}
                    placeholder="Texto que se mostrará"
                />
            </div>

            <div>
                <Label htmlFor="content">URL</Label>
                <Textarea
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="https://example.com"
                    rows={2}
                />
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
                        <SelectItem value="heading1">
                            Heading 1 - {themeSettings?.heading1_size || '2.5rem'}
                        </SelectItem>
                        <SelectItem value="heading2">
                            Heading 2 - {themeSettings?.heading2_size || '2rem'}
                        </SelectItem>
                        <SelectItem value="heading3">
                            Heading 3 - {themeSettings?.heading3_size || '1.75rem'}
                        </SelectItem>
                        <SelectItem value="heading4">
                            Heading 4 - {themeSettings?.heading4_size || '1.5rem'}
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
                            value={editStyles.fontSize || '16px'}
                            onChange={(e) => updateStyle('fontSize', e.target.value)}
                            placeholder="16px"
                        />
                    </div>

                    <div>
                        <Label htmlFor="fontWeight">Peso de fuente</Label>
                        <Select
                            value={editStyles.fontWeight || 'normal'}
                            onValueChange={(value) => updateStyle('fontWeight', value)}
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

            <div>
                <Label htmlFor="textTransform">Transformación de texto</Label>
                <Select
                    value={editStyles.textTransform || 'none'}
                    onValueChange={(value) => updateStyle('textTransform', value)}
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

            <Separator className="my-4" />

            <div>
                <Label htmlFor="color">Color del enlace</Label>
                <div className="flex gap-2">
                    <Input
                        id="color"
                        value={editStyles.color || (themeSettings?.links ? `hsl(${themeSettings.links})` : '#0000EE')}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        placeholder="#0000EE"
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.color || (themeSettings?.links ? `hsl(${themeSettings.links})` : '#0000EE')}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="hoverColor">Color al pasar el mouse</Label>
                <div className="flex gap-2">
                    <Input
                        id="hoverColor"
                        value={editStyles.hoverColor || (themeSettings?.hover_links ? `hsl(${themeSettings.hover_links})` : '#0000FF')}
                        onChange={(e) => updateStyle('hoverColor', e.target.value)}
                        placeholder="#0000FF"
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.hoverColor || (themeSettings?.hover_links ? `hsl(${themeSettings.hover_links})` : '#0000FF')}
                        onChange={(e) => updateStyle('hoverColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="textDecoration">Decoración de texto</Label>
                <Select
                    value={editStyles.textDecoration || 'underline'}
                    onValueChange={(value) => updateStyle('textDecoration', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="underline">Subrayado</SelectItem>
                        <SelectItem value="none">Ninguna</SelectItem>
                        <SelectItem value="overline">Sobrelínea</SelectItem>
                        <SelectItem value="line-through">Tachado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="hoverTextDecoration">Decoración al pasar el mouse</Label>
                <Select
                    value={editStyles.hoverTextDecoration || 'underline'}
                    onValueChange={(value) => updateStyle('hoverTextDecoration', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="underline">Subrayado</SelectItem>
                        <SelectItem value="none">Ninguna</SelectItem>
                        <SelectItem value="overline">Sobrelínea</SelectItem>
                        <SelectItem value="line-through">Tachado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default LinkEditDialog;