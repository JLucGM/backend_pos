import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CartEditDialog = ({ editContent, editStyles, setEditStyles, isLiveEdit = true }) => {
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
                <Label htmlFor="layoutType">Tipo de Layout</Label>
                <Select
                    value={editStyles.layoutType || 'grid'}
                    onValueChange={(value) => setEditStyles({ ...editStyles, layoutType: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="grid">Grid (2 columnas)</SelectItem>
                        <SelectItem value="stack">Stack (1 columna)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* <div>
                <Label htmlFor="maxWidth">Ancho máximo</Label>
                <Input
                    type="text"
                    value={editStyles.maxWidth || '1200px'}
                    onChange={(e) => setEditStyles({ ...editStyles, maxWidth: e.target.value })}
                    placeholder="Ej: 1200px, 100%"
                />
            </div> */}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingTop">Padding Superior</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingTop || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingTop: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="paddingBottom">Padding Inferior</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingBottom || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="paddingLeft">Padding Izquierdo</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingLeft || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="paddingRight">Padding Derecho</Label>
                    <Input
                        type="text"
                        value={editStyles.paddingRight || '20px'}
                        onChange={(e) => setEditStyles({ ...editStyles, paddingRight: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="gap">Espacio entre elementos</Label>
                <Input
                    type="text"
                    value={editStyles.gap || '40px'}
                    onChange={(e) => setEditStyles({ ...editStyles, gap: e.target.value })}
                    placeholder="Ej: 40px"
                />
            </div>

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                    />
                    <Input
                        type="color"
                        value={editStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default CartEditDialog;