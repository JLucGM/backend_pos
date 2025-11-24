// components/Builder/dialogs/ContainerEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ContainerEditDialog = ({ editStyles, setEditStyles }) => (
    <div className="space-y-4">
        <Label htmlFor="bgColor">Fondo</Label>
        <Input
            id="bgColor"
            type="color"
            value={editStyles.backgroundColor || '#f9f9f9'}
            onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
        />
        <Label htmlFor="padding">Padding</Label>
        <Select value={editStyles.padding || '10px'} onValueChange={(value) => setEditStyles({ ...editStyles, padding: value })}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="5px">5px</SelectItem>
                <SelectItem value="10px">10px</SelectItem>
                <SelectItem value="15px">15px</SelectItem>
                <SelectItem value="20px">20px</SelectItem>
            </SelectContent>
        </Select>
    </div>
);

export default ContainerEditDialog;