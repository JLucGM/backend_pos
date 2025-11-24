// components/Builder/dialogs/CarouselEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

const CarouselEditDialog = ({ editContent, setEditContent }) => (
    <div className="space-y-4">
        <Label htmlFor="limit">Número de productos a mostrar</Label>
        <Input
            id="limit"
            type="number"
            value={editContent.limit || 5}
            onChange={(e) => setEditContent({ ...editContent, limit: parseInt(e.target.value) })}
        />
    </div>
);

export default CarouselEditDialog;