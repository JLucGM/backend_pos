import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';

const HeaderLogoEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, themeSettings }) => {
    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            {/* <div>
                <Label htmlFor="content">Texto del Logo</Label>
                <Textarea
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Nombre de la empresa o logo"
                    rows={2}
                />
            </div>

            <div>
                <Label htmlFor="fontSize">Tamaño de fuente</Label>
                <Select
                    value={editStyles.fontSize || '24px'}
                    onValueChange={(value) => updateStyle('fontSize', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="18px">Pequeño (18px)</SelectItem>
                        <SelectItem value="24px">Mediano (24px)</SelectItem>
                        <SelectItem value="32px">Grande (32px)</SelectItem>
                        <SelectItem value="40px">Extra Grande (40px)</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editStyles.fontSize === 'custom' && (
                <div>
                    <Label htmlFor="customFontSize">Tamaño personalizado</Label>
                    <Input
                        id="customFontSize"
                        value={editStyles.customFontSize || ''}
                        onChange={(e) => updateStyle('customFontSize', e.target.value)}
                        placeholder="Ej: 28px"
                    />
                </div>
            )}

            <div>
                <Label htmlFor="fontWeight">Peso de fuente</Label>
                <Select
                    value={editStyles.fontWeight || 'bold'}
                    onValueChange={(value) => updateStyle('fontWeight', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="semibold">Seminegrita</SelectItem>
                        <SelectItem value="bold">Negrita</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label htmlFor="color">Color del logo</Label>
                <div className="flex gap-2">
                    <Input
                        id="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                    />
                    <Input
                        type="color"
                        value={editStyles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

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

            <Separator className="my-4" /> */}

            <div>
                <h4 className="font-medium mb-3">Padding del Logo (px)</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 0}
                            onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 0}
                            onChange={(e) => updateStyle('paddingRight', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 0}
                            onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 0}
                            onChange={(e) => updateStyle('paddingLeft', `${e.target.value}px`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderLogoEditDialog;