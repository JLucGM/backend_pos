// components/Builder/dialogs/ImageEditDialog.jsx
import React from 'react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ImageEditDialog = ({ editContent, setEditContent, media }) => (
    <div className="space-y-4">
        <Label>Seleccionar Imagen</Label>
        <Select value={editContent} onValueChange={(value) => setEditContent(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Elige una imagen" />
            </SelectTrigger>
            <SelectContent>
                {media.filter(m => m.type === 'image').map((item) => (
                    <SelectItem key={item.id} value={item.url}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default ImageEditDialog;