import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';

const HeaderButtonsGroupEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateContent = (key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="showSearch">Mostrar botón de búsqueda</Label>
                <Switch
                    id="showSearch"
                    checked={editContent?.showSearch !== false}
                    onCheckedChange={(checked) => updateContent('showSearch', checked)}
                />
            </div>

            <div>
                <Label htmlFor="gap">Espaciado entre botones (px)</Label>
                <Input
                    id="gap"
                    type="number"
                    value={parseInt(editStyles.gap) || 10}
                    onChange={(e) => updateStyle('gap', `${e.target.value}px`)}
                />
            </div>
        </div>
    );
};

export default HeaderButtonsGroupEditDialog;