// components/BuilderPages/partials/ContainerEditDialog.jsx
import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ContainerEditDialog = ({ editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedStyles, isLiveEdit]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">{/* El container siempre será de ancho completo, así que no mostramos opción de Layout */}
            {/* El container siempre será de ancho completo, así que no mostramos opción de Layout */}

            {/* Alignment */}
            <Label htmlFor="alignment">Alineación</Label>
            <Select value={editStyles.alignment || 'left'} onValueChange={(value) => updateStyle('alignment', value)}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                </SelectContent>
            </Select>

            {/* Dirección (Flex Direction) */}
            <Label htmlFor="direction">Dirección</Label>
            <Select value={editStyles.direction || 'row'} onValueChange={(value) => updateStyle('direction', value)}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="row">Horizontal</SelectItem>
                    <SelectItem value="column">Vertical</SelectItem>
                </SelectContent>
            </Select>

            {/* Gap entre elementos hijos */}
            <Label htmlFor="gap">Gap entre elementos (px)</Label>
            <Input
                id="gap"
                type="number"
                value={parseInt(editStyles.gap) || 0}
                onChange={(e) => updateStyle('gap', `${e.target.value}px`)}
            />

            {/* Padding Individual */}
            <Label>Padding (px)</Label>
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

            {/* Background */}
            <Label htmlFor="backgroundColor">Color de Fondo</Label>
            <Input
                id="backgroundColor"
                type="color"
                value={editStyles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            />

            {/* Border-Radius */}
            <Label htmlFor="borderRadius">Radio de Borde (px)</Label>
            <Input
                id="borderRadius"
                type="number"
                value={parseInt(editStyles.borderRadius) || 0}
                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
            />
        </div>
    );
};

export default ContainerEditDialog;