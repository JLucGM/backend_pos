import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const DividerEditDialog = ({
    editStyles,
    setEditStyles,
    editContent,
    setEditContent,
    isLiveEdit
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            {/* Grosor de la línea */}
            <div>
                <Label htmlFor="divider-lineWidth">Grosor de la línea</Label>
                <Input
                    id="divider-lineWidth"
                    value={editStyles.lineWidth || '1px'}
                    onChange={(e) => updateStyle('lineWidth', e.target.value)}
                    placeholder="1px, 2px, 0.5px..."
                />
            </div>

            {/* Largo de la línea */}
            <div>
                <Label htmlFor="divider-lineLength">Largo de la línea</Label>
                <Input
                    id="divider-lineLength"
                    value={editStyles.lineLength || '100%'}
                    onChange={(e) => updateStyle('lineLength', e.target.value)}
                    placeholder="100%, 200px, 50%..."
                />
            </div>

            {/* Color de la línea */}
            <div>
                <Label htmlFor="divider-lineColor">Color de la línea</Label>
                <div className="flex gap-2">
                    <Input
                        id="divider-lineColor"
                        value={editStyles.lineColor || '#000000'}
                        onChange={(e) => updateStyle('lineColor', e.target.value)}
                        placeholder="#000000"
                    />
                    <Input
                        type="color"
                        value={editStyles.lineColor || '#000000'}
                        onChange={(e) => updateStyle('lineColor', e.target.value)}
                        className="w-12"
                    />
                </div>
            </div>

            {/* Opacidad */}
            <div>
                <Label htmlFor="divider-opacity">Opacidad (0-1)</Label>
                <Input
                    type="range"
                    id="divider-opacity"
                    value={editStyles.opacity || '1'}
                    onChange={(e) => updateStyle('opacity', e.target.value)}
                    min="0"
                    max="1"
                    step="0.1"
                    className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                    Opacidad actual: {editStyles.opacity || '1'}
                </div>
            </div>

            {/* Padding Top */}
            <div>
                <Label htmlFor="divider-paddingTop">Padding Superior</Label>
                <Input
                    id="divider-paddingTop"
                    value={editStyles.paddingTop || '20px'}
                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                    placeholder="20px"
                />
            </div>

            {/* Padding Bottom */}
            <div>
                <Label htmlFor="divider-paddingBottom">Padding Inferior</Label>
                <Input
                    id="divider-paddingBottom"
                    value={editStyles.paddingBottom || '20px'}
                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                    placeholder="20px"
                />
            </div>
        </div>
    );
};

export default DividerEditDialog;