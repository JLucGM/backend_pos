import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { useDebounce } from "@/hooks/Builder/useDebounce";
import { Switch } from "@/Components/ui/switch";
import { useEffect } from "react";

const FooterEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateContent = (key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

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
            </div>

            {/* Redes Sociales */}
            <div>
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
            </div>

            {/* Estilos */}
            <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Estilos del Footer</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="backgroundColor">Color de Fondo</Label>
                        <div className="flex gap-2">
                            <Input
                                id="backgroundColor"
                                value={editStyles.backgroundColor || '#f8fafc'}
                                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                type="color"
                                value={editStyles.backgroundColor || '#f8fafc'}
                                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                className="w-12"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="borderTop">Borde Superior</Label>
                        <Input
                            id="borderTop"
                            value={editStyles.borderTop || '1px solid #e5e7eb'}
                            onChange={(e) => updateStyle('borderTop', e.target.value)}
                        />
                    </div>

                    <div>
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
                    </div>

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

                <div className="grid grid-cols-4 gap-4">
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

export default FooterEditDialog;