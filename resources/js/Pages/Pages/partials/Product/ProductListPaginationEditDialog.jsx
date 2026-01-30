import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

const ProductListPaginationEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const update = (key, value) => setEditStyles(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-4">
            <div>
                <Label>Border Radius (px)</Label>
                <Input type="number" value={parseInt(editStyles.borderRadius) || 4} onChange={(e) => update('borderRadius', `${e.target.value}px`)} />
            </div>

            <div>
                <Label>Border Color</Label>
                <Input value={editStyles.borderColor || '#000'} onChange={(e) => update('borderColor', e.target.value)} />
            </div>

            <div>
                <Label>Border Thickness (px)</Label>
                <Input type="number" value={parseInt(editStyles.borderThickness) || 1} onChange={(e) => update('borderThickness', `${e.target.value}px`)} />
            </div>

            <div>
                <Label>Background</Label>
                <Input value={editStyles.background || '#fff'} onChange={(e) => update('background', e.target.value)} />
            </div>
        </div>
    );
};

export default ProductListPaginationEditDialog;
