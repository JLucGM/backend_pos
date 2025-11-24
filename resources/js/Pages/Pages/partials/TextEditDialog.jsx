// components/Builder/dialogs/TextEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const TextEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => (
    <div className="space-y-4">
        <Label htmlFor="content">Contenido</Label>
        <textarea
            id="content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-20 p-2 border rounded"
        />

        {/* Layout */}
        <Label htmlFor="layout">Layout</Label>
        <Select value={editStyles.layout || 'fit'} onValueChange={(value) => setEditStyles({ ...editStyles, layout: value })}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
            </SelectContent>
        </Select>

        {/* Alignment (solo si layout es fill) */}
        {editStyles.layout === 'fill' && (
            <>
                <Label htmlFor="alignment">Alineación</Label>
                <Select value={editStyles.alignment || 'left'} onValueChange={(value) => setEditStyles({ ...editStyles, alignment: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Izquierda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                </Select>
            </>
        )}

        {/* Padding Individual */}
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="paddingTop">Arriba</Label>
                <Input
                    id="paddingTop"
                    type="number"
                    value={parseInt(editStyles.paddingTop) || 0}
                    onChange={(e) => setEditStyles({ ...editStyles, paddingTop: `${e.target.value}px` })}
                />
            </div>
            <div>
                <Label htmlFor="paddingRight">Derecha</Label>
                <Input
                    id="paddingRight"
                    type="number"
                    value={parseInt(editStyles.paddingRight) || 0}
                    onChange={(e) => setEditStyles({ ...editStyles, paddingRight: `${e.target.value}px` })}
                />
            </div>
            <div>
                <Label htmlFor="paddingBottom">Abajo</Label>
                <Input
                    id="paddingBottom"
                    type="number"
                    value={parseInt(editStyles.paddingBottom) || 0}
                    onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: `${e.target.value}px` })}
                />
            </div>
            <div>
                <Label htmlFor="paddingLeft">Izquierda</Label>
                <Input
                    id="paddingLeft"
                    type="number"
                    value={parseInt(editStyles.paddingLeft) || 0}
                    onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: `${e.target.value}px` })}
                />
            </div>
        </div>

        {/* Background */}
        <Label htmlFor="backgroundColor">Color de Fondo</Label>
        <Input
            id="backgroundColor"
            type="color"
            value={editStyles.backgroundColor || '#ffffff'}
            onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
        />

        {/* Border-Radius */}
        <Label htmlFor="borderRadius">Radio de Borde (px)</Label>
        <Input
            id="borderRadius"
            type="number"
            value={parseInt(editStyles.borderRadius) || 0}
            onChange={(e) => setEditStyles({ ...editStyles, borderRadius: `${e.target.value}px` })}
        />

        {/* Color */}
        <Label htmlFor="color">Color</Label>
        <Input
            id="color"
            type="color"
            value={editStyles.color || '#000000'}
            onChange={(e) => setEditStyles({ ...editStyles, color: e.target.value })}
        />

        {/* FontSize */}
        <Label htmlFor="fontSize">Tamaño de fuente</Label>
        <Select value={editStyles.fontSize || '16px'} onValueChange={(value) => setEditStyles({ ...editStyles, fontSize: value })}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="12px">12px</SelectItem>
                <SelectItem value="16px">16px</SelectItem>
                <SelectItem value="20px">20px</SelectItem>
                <SelectItem value="24px">24px</SelectItem>
            </SelectContent>
        </Select>
    </div>
);

export default TextEditDialog;