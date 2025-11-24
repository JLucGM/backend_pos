// components/Builder/dialogs/LinkEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const LinkEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => (
    <div className="space-y-4">
        <Label htmlFor="content">URL</Label>
        <Input
            id="content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="https://example.com"
        />
        <Label htmlFor="color">Color</Label>
        <Input
            id="color"
            type="color"
            value={editStyles.color || '#000000'}
            onChange={(e) => setEditStyles({ ...editStyles, color: e.target.value })}
        />
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

export default LinkEditDialog;