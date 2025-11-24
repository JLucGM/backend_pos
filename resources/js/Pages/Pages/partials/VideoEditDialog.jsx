// components/Builder/dialogs/VideoEditDialog.jsx
import React from 'react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const VideoEditDialog = ({ editContent, setEditContent, media }) => (
    <div className="space-y-4">
        <Label>Seleccionar Video</Label>
        <Select value={editContent} onValueChange={(value) => setEditContent(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Elige un video" />
            </SelectTrigger>
            <SelectContent>
                {media.filter(m => m.type === 'video').map((item) => (
                    <SelectItem key={item.id} value={item.url}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default VideoEditDialog;