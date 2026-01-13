// components/BuilderPages/partials/ProductCardEditDialog.jsx
import React, { useEffect } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const ProductCardEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateCardConfig = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="cardBorder">Borde de la Carta</Label>
                <Select
                    value={editContent.cardBorder || 'none'}
                    onValueChange={(value) => updateCardConfig('cardBorder', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Sin borde</SelectItem>
                        <SelectItem value="solid">Con borde</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {editContent.cardBorder === 'solid' && (
                <>
                    <div>
                        <Label htmlFor="cardBorderThickness">Espesor del Borde (px)</Label>
                        <Input
                            id="cardBorderThickness"
                            type="number"
                            value={parseInt(editContent.cardBorderThickness) || 1}
                            onChange={(e) => updateCardConfig('cardBorderThickness', `${e.target.value}px`)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="cardBorderOpacity">Opacidad del Borde (0-1)</Label>
                        <Input
                            id="cardBorderOpacity"
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={editContent.cardBorderOpacity || 1}
                            onChange={(e) => updateCardConfig('cardBorderOpacity', e.target.value)}
                        />
                    </div>
                </>
            )}

            <div>
                <Label htmlFor="cardBorderRadius">Border Radius (px)</Label>
                <Input
                    id="cardBorderRadius"
                    type="number"
                    value={parseInt(editContent.cardBorderRadius) || 0}
                    onChange={(e) => updateCardConfig('cardBorderRadius', `${e.target.value}px`)}
                />
            </div>

            <Label>Padding de la Carta (px)</Label>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cardPaddingTop">Arriba</Label>
                    <Input
                        id="cardPaddingTop"
                        type="number"
                        value={parseInt(editContent.cardPaddingTop) || 0}
                        onChange={(e) => updateCardConfig('cardPaddingTop', `${e.target.value}px`)}
                    />
                </div>
                <div>
                    <Label htmlFor="cardPaddingRight">Derecha</Label>
                    <Input
                        id="cardPaddingRight"
                        type="number"
                        value={parseInt(editContent.cardPaddingRight) || 0}
                        onChange={(e) => updateCardConfig('cardPaddingRight', `${e.target.value}px`)}
                    />
                </div>
                <div>
                    <Label htmlFor="cardPaddingBottom">Abajo</Label>
                    <Input
                        id="cardPaddingBottom"
                        type="number"
                        value={parseInt(editContent.cardPaddingBottom) || 0}
                        onChange={(e) => updateCardConfig('cardPaddingBottom', `${e.target.value}px`)}
                    />
                </div>
                <div>
                    <Label htmlFor="cardPaddingLeft">Izquierda</Label>
                    <Input
                        id="cardPaddingLeft"
                        type="number"
                        value={parseInt(editContent.cardPaddingLeft) || 0}
                        onChange={(e) => updateCardConfig('cardPaddingLeft', `${e.target.value}px`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCardEditDialog;