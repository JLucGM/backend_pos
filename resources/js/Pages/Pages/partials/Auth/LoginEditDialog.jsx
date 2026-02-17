import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker'; // Asegurar que sea la versión controlada

const LoginEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    isLiveEdit = true,
    themeSettings,
    appliedTheme
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    // Memoizar funciones de actualización
    const handleContentChange = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const handleStylesChange = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    // Valores resueltos para ColorPicker
    const bgColorValue = resolveValue(editStyles?.backgroundColor) || '#ffffff';
    const titleColorValue = resolveValue(editStyles?.titleColor) || resolveValue(themeSettings?.heading) || '#000000';
    const subtitleColorValue = resolveValue(editStyles?.subtitleColor) || resolveValue(themeSettings?.heading) || '#000000';
    const buttonBgColorValue = resolveValue(editStyles?.buttonBackgroundColor) || resolveValue(themeSettings?.primary_button_background) || '#3b82f6';
    const borderColor = resolveValue(editStyles?.borderColor) || resolveValue(themeSettings?.borderColor) || '#3b82f6';

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título principal</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Iniciar Sesión'}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                />
            </div>

            {/* Tamaño del titulo */}
            <div className="space-y-2">
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <div className="flex gap-2">
                    <Input
                        id="titleSize"
                        type="number"
                        value={parseInt(editStyles?.titleSize) || 28}
                        onChange={(e) => handleStylesChange('titleSize', e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles?.titleSizeUnit || (editStyles?.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => handleStylesChange('titleSizeUnit', value)}
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

            {/* Color del título */}
            <div>
                <Label>Color del título</Label>
                <ColorPicker
                    value={titleColorValue}
                    onChange={(hex) => handleStylesChange('titleColor', hex)}
                    showOpacity={false}
                />
            </div>

            <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                    type="text"
                    value={editContent?.subtitle || 'Ingresa a tu cuenta'}
                    onChange={(e) => handleContentChange('subtitle', e.target.value)}
                />
            </div>

            {/* Tamaño del subtitulo */}
            <div className="space-y-2">
                <Label htmlFor="subtitleSize">Tamaño del subtítulo</Label>
                <div className="flex gap-2">
                    <Input
                        id="subtitleSize"
                        type="number"
                        value={parseInt(editStyles?.subtitleSize) || 16}
                        onChange={(e) => handleStylesChange('subtitleSize', e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        value={editStyles?.subtitleSizeUnit || (editStyles?.subtitleSize?.toString().includes('rem') ? 'rem' : 'px')}
                        onValueChange={(value) => handleStylesChange('subtitleSizeUnit', value)}
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

            {/* Color del subtítulo */}
            <div>
                <Label>Color del título</Label>
                <ColorPicker
                    value={subtitleColorValue}
                    onChange={(hex) => handleStylesChange('subtitleColor', hex)}
                    showOpacity={false}
                />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de email</Label>
                    <Switch
                        checked={editContent?.showEmail !== false}
                        onCheckedChange={(checked) => handleContentChange('showEmail', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de contraseña</Label>
                    <Switch
                        checked={editContent?.showPassword !== false}
                        onCheckedChange={(checked) => handleContentChange('showPassword', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label>Mostrar "Recordarme"</Label>
                    <Switch
                        checked={editContent?.showRemember === true}
                        onCheckedChange={(checked) => handleContentChange('showRemember', checked)}
                    />
                </div>

                {editContent?.showRemember && (
                    <div>
                        <Label htmlFor="rememberText">Texto "Recordarme"</Label>
                        <Input
                            type="text"
                            value={editContent?.rememberText || 'Recordarme'}
                            onChange={(e) => handleContentChange('rememberText', e.target.value)}
                        />
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar enlace de registro</Label>
                    <Switch
                        checked={editContent?.showRegisterLink !== false}
                        onCheckedChange={(checked) => handleContentChange('showRegisterLink', checked)}
                    />
                </div>

                {editContent?.showRegisterLink && (
                    <div>
                        <Label htmlFor="registerText">Texto del enlace de registro</Label>
                        <Input
                            type="text"
                            value={editContent?.registerText || '¿No tienes una cuenta? Regístrate'}
                            onChange={(e) => handleContentChange('registerText', e.target.value)}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Label>Mostrar "Olvidé mi contraseña"</Label>
                    <Switch
                        checked={editContent?.showForgotPassword === true}
                        onCheckedChange={(checked) => handleContentChange('showForgotPassword', checked)}
                    />
                </div>

                {editContent?.showForgotPassword && (
                    <div>
                        <Label htmlFor="forgotPasswordText">Texto "Olvidé contraseña"</Label>
                        <Input
                            type="text"
                            value={editContent?.forgotPasswordText || '¿Olvidaste tu contraseña?'}
                            onChange={(e) => handleContentChange('forgotPasswordText', e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                    type="text"
                    value={editContent?.buttonText || 'Iniciar Sesión'}
                    onChange={(e) => handleContentChange('buttonText', e.target.value)}
                />
            </div>

            <Separator className="my-4" />

            {/* Sección de estilos */}
            <div>
                <Label htmlFor="maxWidth">Ancho máximo del formulario</Label>
                <div className="flex gap-2">
                    <Input
                        id="maxWidth"
                        type="number"
                        value={parseInt(editStyles?.maxWidth) || 400}
                        onChange={(e) => handleStylesChange('maxWidth', e.target.value)}
                        placeholder="400"
                        className="flex-1"
                    />
                    <Select
                        value={editStyles?.maxWidthUnit || (editStyles?.maxWidth?.toString().includes('%') ? '%' : 'px')}
                        onValueChange={(value) => handleStylesChange('maxWidthUnit', value)}
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        id="paddingTop"
                        type="number"
                        value={parseInt(editStyles?.paddingTop) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => handleStylesChange('paddingTop', e.target.value)}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        id="paddingBottom"
                        type="number"
                        value={parseInt(editStyles?.paddingBottom) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => handleStylesChange('paddingBottom', e.target.value)}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        id="paddingLeft"
                        type="number"
                        value={parseInt(editStyles?.paddingLeft) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => handleStylesChange('paddingLeft', e.target.value)}
                        placeholder="32"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        id="paddingRight"
                        type="number"
                        value={parseInt(editStyles?.paddingRight) || parseInt(editStyles?.padding) || 32}
                        onChange={(e) => handleStylesChange('paddingRight', e.target.value)}
                        placeholder="32"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="borderRadius">Borde redondeado del formulario</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles?.borderRadius) || 12}
                    onChange={(e) => handleStylesChange('borderRadius', e.target.value)}
                    placeholder="12"
                />
            </div>

            <div>
                <Label>Color border</Label>
                <ColorPicker
                    value={borderColor}
                    onChange={(hex) => handleStylesChange('borderColor', hex)}
                    showOpacity={false}
                />
            </div>


            {/* Color de fondo del formulario */}
            <div>
                <Label>Color de fondo del formulario</Label>
                <ColorPicker
                    value={bgColorValue}
                    onChange={(hex) => handleStylesChange('backgroundColor', hex)}
                    showOpacity={false}
                />
            </div>



            {/* Color de fondo del botón */}
            <div>
                <Label>Color de fondo del botón</Label>
                <ColorPicker
                    value={buttonBgColorValue}
                    onChange={(hex) => handleStylesChange('buttonBackgroundColor', hex)}
                    showOpacity={false}
                />
            </div>
            
        </div>
    );
};

export default React.memo(LoginEditDialog);