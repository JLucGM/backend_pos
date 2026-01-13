import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useDebounce } from '@/hooks/Builder/useDebounce';

const CheckoutPaymentEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles, isLiveEdit = true }) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const handleAddPaymentMethod = () => {
        const newMethod = {
            id: `method_${Date.now()}`,
            name: 'Nuevo método'
        };
        setEditContent({
            ...editContent,
            paymentMethods: [...(editContent?.paymentMethods || []), newMethod]
        });
    };

    const handleRemovePaymentMethod = (index) => {
        const updatedMethods = [...(editContent?.paymentMethods || [])];
        updatedMethods.splice(index, 1);
        setEditContent({
            ...editContent,
            paymentMethods: updatedMethods
        });
    };

    const handleMethodChange = (index, field, value) => {
        const updatedMethods = [...(editContent?.paymentMethods || [])];
        updatedMethods[index] = { ...updatedMethods[index], [field]: value };
        setEditContent({
            ...editContent,
            paymentMethods: updatedMethods
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Título de métodos de pago</Label>
                <Input
                    type="text"
                    value={editContent?.title || 'Método de Pago'}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                />
            </div>

            <div>
                <Label>Métodos de pago disponibles</Label>
                <div className="space-y-2 mt-2">
                    {(editContent?.paymentMethods || []).map((method, index) => (
                        <div key={method.id} className="flex items-center gap-2">
                            <Input
                                type="text"
                                value={method.name}
                                onChange={(e) => handleMethodChange(index, 'name', e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemovePaymentMethod(index)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPaymentMethod}
                    className="mt-2"
                >
                    <Plus size={16} className="mr-2" />
                    Agregar método
                </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mostrar términos y condiciones</Label>
                    <Switch
                        checked={editContent?.showTerms !== false}
                        onCheckedChange={(checked) => setEditContent({ ...editContent, showTerms: checked })}
                    />
                </div>

                {editContent?.showTerms && (
                    <div>
                        <Label htmlFor="termsText">Texto de términos</Label>
                        <Input
                            type="text"
                            value={editContent?.termsText || 'Acepto los términos y condiciones'}
                            onChange={(e) => setEditContent({ ...editContent, termsText: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="buttonText">Texto del botón</Label>
                <Input
                    type="text"
                    value={editContent?.buttonText || 'Realizar Pedido'}
                    onChange={(e) => setEditContent({ ...editContent, buttonText: e.target.value })}
                />
            </div>

            <Separator className="my-4" />

            <div>
                <Label htmlFor="backgroundColor">Color de fondo</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.backgroundColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="padding">Padding</Label>
                    <Input
                        type="text"
                        value={editStyles?.padding || '24px'}
                        onChange={(e) => setEditStyles({ ...editStyles, padding: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="borderRadius">Borde redondeado</Label>
                    <Input
                        type="text"
                        value={editStyles?.borderRadius || '12px'}
                        onChange={(e) => setEditStyles({ ...editStyles, borderRadius: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="titleSize">Tamaño del título</Label>
                <Input
                    type="text"
                    value={editStyles?.titleSize || '20px'}
                    onChange={(e) => setEditStyles({ ...editStyles, titleSize: e.target.value })}
                />
            </div>

            <div>
                <Label htmlFor="buttonBackgroundColor">Color de fondo del botón</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.buttonBackgroundColor || '#3b82f6'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.buttonBackgroundColor || '#3b82f6'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonBackgroundColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="buttonColor">Color del texto del botón</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editStyles?.buttonColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonColor: e.target.value })}
                    />
                    <Input
                        type="color"
                        value={editStyles?.buttonColor || '#ffffff'}
                        onChange={(e) => setEditStyles({ ...editStyles, buttonColor: e.target.value })}
                        className="w-12"
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPaymentEditDialog;