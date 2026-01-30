import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductListEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // cambios en vivo
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateConfig = (key, value) => setEditContent(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-4">
            <div>
                <Label>Columnas</Label>
                <Input type="number" value={parseInt(editContent.columns) || 3} onChange={(e) => updateConfig('columns', parseInt(e.target.value) || 1)} />
            </div>

            <div>
                <Label>Límite por página</Label>
                <Input type="number" value={parseInt(editContent.limit) || 8} onChange={(e) => updateConfig('limit', parseInt(e.target.value) || 1)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Gap X (ej. 10px)</Label>
                    <Input value={editContent.gapX || '10px'} onChange={(e) => updateConfig('gapX', e.target.value)} />
                </div>
                <div>
                    <Label>Gap Y (ej. 10px)</Label>
                    <Input value={editContent.gapY || '10px'} onChange={(e) => updateConfig('gapY', e.target.value)} />
                </div>
            </div>

            <div>
                <Label>Background Color (hex)</Label>
                <Input value={editContent.backgroundColor || ''} onChange={(e) => updateConfig('backgroundColor', e.target.value)} />
            </div>
        </div>
    );
};

export default ProductListEditDialog;
