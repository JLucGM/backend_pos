import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const RegisterEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título principal</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Crear Cuenta'}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                    type="text"
                    value={editContent?.subtitle || 'Regístrate para empezar a comprar'}
                    onChange={(e) => setEditContent({ ...editContent, subtitle: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de nombre</Label>
                    <Switch
                        checked={editContent?.showName !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showName: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de email</Label>
                    <Switch
                        checked={editContent?.showEmail !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showEmail: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de teléfono</Label>
                    <Switch
                        checked={editContent?.showPhone === true}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showPhone: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de contraseña</Label>
                    <Switch
                        checked={editContent?.showPassword !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showPassword: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de confirmar contraseña</Label>
                    <Switch
                        checked={editContent?.showConfirmPassword !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showConfirmPassword: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar términos y condiciones</Label>
                    <Switch
                        checked={editContent?.showTerms !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showTerms: checked })}
                    />
                </div>

                {editContent?.showTerms && (
                    <div>
                        <Label htmlFor="termsText">Texto de términos</Label>
                        <Input
                            type="text"
                            value={editContent?.termsText || 'Acepto los términos y condiciones'}
                            onChange={(e) => setEditContent({ ...editContent, termsText: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar enlace de login</Label>
                    <Switch
                        checked={editContent?.showLoginLink !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showLoginLink: checked })}
                    />
                </div>

                {editContent?.showLoginLink && (
                    <div>
                        <Label htmlFor="loginText">Texto del enlace de login</Label>
                        <Input
                            type="text"
                            value={editContent?.loginText || '¿Ya tienes una cuenta? Inicia sesión'}
                            onChange={(e) => setEditContent({ ...editContent, loginText: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                    type="text"
                    value={editContent?.buttonText || 'Crear Cuenta'}
                    onChange={(e) => setEditContent({ ...editContent, buttonText: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="maxWidth">Ancho máximo</Label>
                <div className="flex gap-2">
                    <Input
                        id="maxWidth"
                        type="number"
                        value={parseInt(editStyles?.maxWidth) || 400}
                        onChange={(e) => setEditStyles({ ...editStyles, maxWidth: e.target.value })}
                        placeholder="400"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles?.maxWidthUnit || (editStyles?.maxWidth?.toString().includes('%') ? '%' : 'px')}
                        onValueChange={(value) => setEditStyles({ ...editStyles, maxWidthUnit: value })}
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
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles?.paddingTop) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingTop: e.target.value })}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles?.paddingBottom) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: e.target.value })}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        id="paddingLeft"
                        type="number"
                        value={parseInt(editStyles?.paddingLeft) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: e.target.value })}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles?.paddingRight) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingRight: e.target.value })}
                        placeholder="32"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="borderRadius">Borde redondeado</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles?.borderRadius) || 12}
                    onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                    placeholder="12"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="titleSize">Tamaño del título</Label>
                    <div className="flex gap-2">
                        <Input
                            id="titleSize"
                            type="number"
                            value={parseInt(editStyles?.titleSize) || 28}
                            onChange={(e) => setEditStyles({ ...editStyles, titleSize: e.target.value })}
                            className="flex-1"
                        />
                        <Select
                            value={editStyles?.titleSizeUnit || (editStyles?.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => setEditStyles({ ...editStyles, titleSizeUnit: value })}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subtitleSize">Tamaño del subtítulo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="subtitleSize"
                            type="number"
                            value={parseInt(editStyles?.subtitleSize) || 16}
                            onChange={(e) => setEditStyles({ ...editStyles, subtitleSize: e.target.value })}
                            className="flex-1"
                        />
                        <Select
                            value={editStyles?.subtitleSizeUnit || (editStyles?.subtitleSize?.toString().includes('rem') ? 'rem' : 'px')}
                            onValueChange={(value) => setEditStyles({ ...editStyles, subtitleSizeUnit: value })}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="rem">rem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="buttonBackgroundColor">Color de fondo del botón</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.buttonBackgroundColor || '#10b981'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.buttonBackgroundColor || '#10b981'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterEditDialog;