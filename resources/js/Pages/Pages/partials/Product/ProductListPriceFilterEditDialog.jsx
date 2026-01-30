import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

const ProductListPriceFilterEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateStyles = (key, value) => setEditStyles(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-4">
            <div>
                <Label>Border Radius (px)</Label>
                <Input type="number" value={parseInt(editStyles.borderRadius) || 4} onChange={(e) => updateStyles('borderRadius', `${e.target.value}px`)} />
            </div>

            <div>
                <Label>Border Color</Label>
                <Input value={editStyles.borderColor || '#ccc'} onChange={(e) => updateStyles('borderColor', e.target.value)} />
            </div>

            <div>
                <Label>Background</Label>
                <Input value={editStyles.background || '#fff'} onChange={(e) => updateStyles('background', e.target.value)} />
            </div>
        </div>
    );
};

export default ProductListPriceFilterEditDialog;
