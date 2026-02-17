import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useDebounce } from "@/hooks/Builder/useDebounce";
import { Switch } from "@/Components/ui/switch";
import React, { useEffect, useCallback } from "react";
import { resolveStyleValue, getThemeWithDefaults } from "@/utils/themeUtils";
import { ColorPicker } from "@/components/ui/color-picker";

const FooterEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
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

    const updateContent = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const bgColor = resolveValue(editStyles.backgroundColor) || '#f8fafc';
    const borders = resolveValue(editStyles?.borders) || '#ffffff';

    return (
        <div className="space-y-6">
            {/* Configuración general */}
            <div>
                <h4 className="font-medium mb-3">Configuración General</h4>

                <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="showCopyright">Mostrar Copyright</Label>
                    <Switch
                        id="showCopyright"
                        checked={editContent?.showCopyright || true}
                        onCheckedChange={(checked) => updateContent('showCopyright', checked)}
                    />
                </div>

                {editContent?.showCopyright && (
                    <div className="mb-4">
                        <Label htmlFor="copyrightText">Texto de Copyright</Label>
                        <Textarea
                            id="copyrightText"
                            value={editContent?.copyrightText || ''}
                            onChange={(e) => updateContent('copyrightText', e.target.value)}
                            rows={2}
                            placeholder="© 2023 Mi Empresa. Todos los derechos reservados."
                        />
                    </div>
                )}

                <div className="mb-4">
                    <Label htmlFor="layout">Diseño del Footer</Label>
                    <Select
                        value={editContent?.layout || 'grid'}
                        onValueChange={(value) => updateContent('layout', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="grid">Grid (Columnas fijas)</SelectItem>
                            <SelectItem value="flex">Flex (Responsivo)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-4">
                    <Label htmlFor="columns">Número de Columnas</Label>
                    <Select
                        value={editContent?.columns?.toString() || '3'}
                        onValueChange={(value) => updateContent('columns', parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 Columna</SelectItem>
                            <SelectItem value="2">2 Columnas</SelectItem>
                            <SelectItem value="3">3 Columnas</SelectItem>
                            <SelectItem value="4">4 Columnas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Color de Fondo */}
                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <ColorPicker
                        value={bgColor}
                        onChange={(hex) => updateStyle('backgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>
            </div>

            {/* Redes Sociales */}
            {/* <div>
                <h4 className="font-medium mb-3">Redes Sociales</h4>

                <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="showSocial">Mostrar Redes Sociales</Label>
                    <Switch
                        id="showSocial"
                        checked={editContent?.socialMedia?.show || false}
                        onCheckedChange={(checked) => {
                            const currentSocial = editContent?.socialMedia || {};
                            updateContent('socialMedia', {
                                ...currentSocial,
                                show: checked
                            });
                        }}
                    />
                </div>

                {editContent?.socialMedia?.show && (
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                                id="facebook"
                                value={editContent.socialMedia.facebook || ''}
                                onChange={(e) => {
                                    const currentSocial = editContent.socialMedia;
                                    updateContent('socialMedia', {
                                        ...currentSocial,
                                        facebook: e.target.value
                                    });
                                }}
                                placeholder="https://facebook.com/empresa"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={editContent.socialMedia.instagram || ''}
                                onChange={(e) => {
                                    const currentSocial = editContent.socialMedia;
                                    updateContent('socialMedia', {
                                        ...currentSocial,
                                        instagram: e.target.value
                                    });
                                }}
                                placeholder="https://instagram.com/empresa"
                            />
                        </div>
                        <div>
                            <Label htmlFor="twitter">Twitter</Label>
                            <Input
                                id="twitter"
                                value={editContent.socialMedia.twitter || ''}
                                onChange={(e) => {
                                    const currentSocial = editContent.socialMedia;
                                    updateContent('socialMedia', {
                                        ...currentSocial,
                                        twitter: e.target.value
                                    });
                                }}
                                placeholder="https://twitter.com/empresa"
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={editContent.socialMedia.linkedin || ''}
                                onChange={(e) => {
                                    const currentSocial = editContent.socialMedia;
                                    updateContent('socialMedia', {
                                        ...currentSocial,
                                        linkedin: e.target.value
                                    });
                                }}
                                placeholder="https://linkedin.com/company/empresa"
                            />
                        </div>
                    </div>
                )}
            </div> */}

            {/* Estilos */}
            <div className="pt-4 border-t">


                <div className="grid grid-cols-1 gap-4 mb-4">
                    
                    <div className="space-y-2">
                        <Label htmlFor="borderWidth">Ancho de borde</Label>
                        <Input
                            id="borderWidth"
                            type="number"
                            value={parseInt(editStyles.borderWidth) || 1}
                            onChange={(e) => updateStyle('borderWidth', e.target.value)}
                            placeholder="8"
                        />
                    </div>

                    <div>
                        <Label htmlFor="borders">Color del border</Label>
                        <ColorPicker
                            value={borders}
                            onChange={(hex) => updateStyle('borders', hex)}
                            showOpacity={false}
                        />
                    </div>


                
                    {/* <div>
                        <Label htmlFor="maxWidth">Ancho Máximo</Label>
                        <div className="flex gap-2">
                            <Input
                                id="maxWidth"
                                type="number"
                                value={parseInt(editStyles.maxWidth) || 1200}
                                onChange={(e) => updateStyle('maxWidth', e.target.value)}
                                placeholder="1200"
                                className="flex-1"
                            />
                            <Select
                                value={editStyles.maxWidthUnit || (editStyles.maxWidth?.toString().includes('%') ? '%' : 'px')}
                                onValueChange={(value) => updateStyle('maxWidthUnit', value)}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="px">px</SelectItem>
                                    <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div> */}

                    <div>
                        <Label htmlFor="gap">Espaciado (Gap)</Label>
                        <Input
                            id="gap"
                            type="number"
                            value={parseInt(editStyles.gap) || 40}
                            onChange={(e) => updateStyle('gap', e.target.value)}
                            placeholder="40"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 40}
                            onChange={(e) => updateStyle('paddingTop', e.target.value)}
                            placeholder="40"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecho</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 20}
                            onChange={(e) => updateStyle('paddingRight', e.target.value)}
                            placeholder="20"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 40}
                            onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                            placeholder="40"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierdo</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 20}
                            onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                            placeholder="20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FooterEditDialog);