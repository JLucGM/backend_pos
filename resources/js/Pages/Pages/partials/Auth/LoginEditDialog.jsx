import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';

const LoginEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título principal</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Iniciar Sesión'}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                    type="text"
                    value={editContent?.subtitle || 'Ingresa a tu cuenta'}
                    onChange={(e) => setEditContent({ ...editContent, subtitle: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar campo de email</Label>
                    <Switch
                        checked={editContent?.showEmail !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showEmail: checked })}
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
                    <Label>Mostrar "Recordarme"</Label>
                    <Switch
                        checked={editContent?.showRemember === true}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showRemember: checked })}
                    />
                </div>

                {editContent?.showRemember && (
                    <div>
                        <Label htmlFor="rememberText">Texto "Recordarme"</Label>
                        <Input
                            type="text"
                            value={editContent?.rememberText || 'Recordarme'}
                            onChange={(e) => setEditContent({ ...editContent, rememberText: e.target.value })}
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
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showRegisterLink: checked })}
                    />
                </div>

                {editContent?.showRegisterLink && (
                    <div>
                        <Label htmlFor="registerText">Texto del enlace de registro</Label>
                        <Input
                            type="text"
                            value={editContent?.registerText || '¿No tienes una cuenta? Regístrate'}
                            onChange={(e) => setEditContent({ ...editContent, registerText: e.target.value })}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <Label>Mostrar "Olvidé mi contraseña"</Label>
                    <Switch
                        checked={editContent?.showForgotPassword === true}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showForgotPassword: checked })}
                    />
                </div>

                {editContent?.showForgotPassword && (
                    <div>
                        <Label htmlFor="forgotPasswordText">Texto "Olvidé contraseña"</Label>
                        <Input
                            type="text"
                            value={editContent?.forgotPasswordText || '¿Olvidaste tu contraseña?'}
                            onChange={(e) => setEditContent({ ...editContent, forgotPasswordText: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                    type="text"
                    value={editContent?.buttonText || 'Iniciar Sesión'}
                    onChange={(e) => setEditContent({ ...editContent, buttonText: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="maxWidth">Ancho máximo</Label>
                <Input
                    type="text"
                    value={editStyles?.maxWidth || '400px'}
                    onChange={(e) => setEditStyles({ ...editStyles, maxWidth: e.target.value })}
                />
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
                <div>
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        type="text"
                        value={editStyles?.padding || '32px'}
                        onChange={(e) => setEditStyles({ ...editStyles, padding: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        type="text"
                        value={editStyles?.borderRadius || '12px'}
                        onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="titleColor">Color del título</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.titleColor || '#000000'}
                        onChange={(e) => setEditStyles({ ...editStyles, titleColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.titleColor || '#000000'}
                        onChange={(e) => setEditStyles({ ...editStyles, titleColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="buttonBackgroundColor">Color de fondo del botón</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.buttonBackgroundColor || '#3b82f6'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.buttonBackgroundColor || '#3b82f6'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginEditDialog;