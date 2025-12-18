import React from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';

const HeaderEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => {
    const updateContent = (key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    };

    const updateNestedContent = (path, key, value) => {
        setEditContent(prev => {
            const newContent = { ...prev };
            let current = newContent;
            
            // Navegar hasta el objeto padre
            for (const p of path) {
                if (!current[p]) current[p] = {};
                current = current[p];
            }
            
            // Actualizar la propiedad
            current[key] = value;
            return newContent;
        });
    };

    const updateButtonStyle = (buttonName, styleKey, value) => {
        setEditContent(prev => {
            const newContent = { ...prev };
            if (!newContent.buttons) newContent.buttons = {};
            if (!newContent.buttons[buttonName]) newContent.buttons[buttonName] = {};
            if (!newContent.buttons[buttonName].styles) newContent.buttons[buttonName].styles = {};
            
            newContent.buttons[buttonName].styles[styleKey] = value;
            return newContent;
        });
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    };

    const getPositionInfo = () => {
        const logoPos = editContent?.logoPosition || 'left';
        
        if (logoPos === 'left') {
            return "Orden: Logo → Menú → Botones (Carrito, Buscador, Perfil)";
        } else if (logoPos === 'center') {
            return "Orden: Menú → Logo → Botones";
        } else if (logoPos === 'right') {
            return "Orden: Menú → Logo (pegado a botones) → Botones";
        }
        return "";
    };

    // Componente para editar estilos de un botón específico
    const ButtonStyleEditor = ({ buttonName, buttonLabel }) => {
        const buttonConfig = editContent?.buttons?.[buttonName] || {};
        const buttonStyles = buttonConfig.styles || {};
        
        return (
            <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium text-sm">{buttonLabel}</h4>
                
                {/* Color del icono */}
                <div>
                    <Label htmlFor={`${buttonName}-iconColor`} className="text-xs">Color del icono</Label>
                    <div className="flex gap-2">
                        <Input
                            id={`${buttonName}-iconColor`}
                            value={buttonStyles.iconColor || '#000000'}
                            onChange={(e) => updateButtonStyle(buttonName, 'iconColor', e.target.value)}
                            className="flex-1 h-8 text-xs"
                        />
                        <Input
                            type="color"
                            value={buttonStyles.iconColor || '#000000'}
                            onChange={(e) => updateButtonStyle(buttonName, 'iconColor', e.target.value)}
                            className="w-8 h-8"
                        />
                    </div>
                </div>
                
                {/* Color de fondo */}
                <div>
                    <Label htmlFor={`${buttonName}-backgroundColor`} className="text-xs">Color de fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id={`${buttonName}-backgroundColor`}
                            value={buttonStyles.backgroundColor || '#000000'}
                            onChange={(e) => updateButtonStyle(buttonName, 'backgroundColor', e.target.value)}
                            className="flex-1 h-8 text-xs"
                        />
                        <Input
                            type="color"
                            value={buttonStyles.backgroundColor || '#000000'}
                            onChange={(e) => updateButtonStyle(buttonName, 'backgroundColor', e.target.value)}
                            className="w-8 h-8"
                        />
                    </div>
                </div>
                
                {/* Opacidad del fondo */}
                <div>
                    <Label htmlFor={`${buttonName}-backgroundOpacity`} className="text-xs">Opacidad del fondo (0-1)</Label>
                    <Input
                        id={`${buttonName}-backgroundOpacity`}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={buttonStyles.backgroundOpacity || '1'}
                        onChange={(e) => updateButtonStyle(buttonName, 'backgroundOpacity', e.target.value)}
                        className="h-8 text-xs"
                    />
                </div>
                
                <Separator />
                
                {/* Configuración del borde */}
                <div className="grid grid-cols-1 gap-2">
                    <div>
                        <Label htmlFor={`${buttonName}-borderWidth`} className="text-xs">Ancho borde</Label>
                        <Input
                            id={`${buttonName}-borderWidth`}
                            type="number"
                            value={parseInt(buttonStyles.borderWidth) || 0}
                            onChange={(e) => updateButtonStyle(buttonName, 'borderWidth', `${e.target.value}px`)}
                            className="h-8 text-xs"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor={`${buttonName}-borderColor`} className="text-xs">Color borde</Label>
                        <Input
                            type="color"
                            value={buttonStyles.borderColor || '#000000'}
                            onChange={(e) => updateButtonStyle(buttonName, 'borderColor', e.target.value)}
                            className="h-8 w-full"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor={`${buttonName}-borderOpacity`} className="text-xs">Opac. borde</Label>
                        <Input
                            id={`${buttonName}-borderOpacity`}
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={buttonStyles.borderOpacity || '1'}
                            onChange={(e) => updateButtonStyle(buttonName, 'borderOpacity', e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
                
                {/* Radio de borde */}
                <div>
                    <Label htmlFor={`${buttonName}-borderRadius`} className="text-xs">Radio de borde (px)</Label>
                    <Input
                        id={`${buttonName}-borderRadius`}
                        type="number"
                        value={parseInt(buttonStyles.borderRadius) || 50}
                        onChange={(e) => updateButtonStyle(buttonName, 'borderRadius', `${e.target.value}px`)}
                        className="h-8 text-xs"
                    />
                </div>
                
                <Separator />
                
                {/* Tamaño */}
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <Label htmlFor={`${buttonName}-width`} className="text-xs">Ancho (px)</Label>
                        <Input
                            id={`${buttonName}-width`}
                            type="number"
                            value={parseInt(buttonStyles.width) || 36}
                            onChange={(e) => updateButtonStyle(buttonName, 'width', `${e.target.value}px`)}
                            className="h-8 text-xs"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor={`${buttonName}-height`} className="text-xs">Alto (px)</Label>
                        <Input
                            id={`${buttonName}-height`}
                            type="number"
                            value={parseInt(buttonStyles.height) || 36}
                            onChange={(e) => updateButtonStyle(buttonName, 'height', `${e.target.value}px`)}
                            className="h-8 text-xs"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor={`${buttonName}-padding`} className="text-xs">Padding (px)</Label>
                        <Input
                            id={`${buttonName}-padding`}
                            type="number"
                            value={parseInt(buttonStyles.padding) || 8}
                            onChange={(e) => updateButtonStyle(buttonName, 'padding', `${e.target.value}px`)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>
                
                {/* Para el carrito, mostrar contador */}
                {buttonName === 'cart' && (
                    <div>
                        <Label htmlFor="cartCount" className="text-xs">Contador del carrito</Label>
                        <Input
                            id="cartCount"
                            value={editContent?.buttons?.cart?.count || '0'}
                            onChange={(e) => updateNestedContent(['buttons', 'cart'], 'count', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="Dejar vacío para ocultar"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="buttons">Botones</TabsTrigger>
                <TabsTrigger value="styles">Estilos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        {getPositionInfo()}
                    </AlertDescription>
                </Alert>

                <div>
                    <Label htmlFor="logoPosition">Posición del Logo</Label>
                    <Select
                        value={editContent?.logoPosition || 'left'}
                        onValueChange={(value) => updateContent('logoPosition', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">
                                Izquierda (Logo primero, luego menú)
                            </SelectItem>
                            <SelectItem value="center">
                                Centro (Menú primero, luego logo)
                            </SelectItem>
                            <SelectItem value="right">
                                Derecha (Menú primero, logo pegado a botones)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="sticky">Header Fijo (Sticky)</Label>
                    <Switch
                        id="sticky"
                        checked={editContent?.sticky || false}
                        onCheckedChange={(checked) => updateContent('sticky', checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="fullWidth">Ancho Completo</Label>
                    <Switch
                        id="fullWidth"
                        checked={editContent?.fullWidth !== false}
                        onCheckedChange={(checked) => updateContent('fullWidth', checked)}
                    />
                </div>

                <div>
                    <Label htmlFor="height">Altura del Header (px)</Label>
                    <Input
                        id="height"
                        type="number"
                        value={parseInt(editContent?.height) || 70}
                        onChange={(e) => updateContent('height', `${e.target.value}px`)}
                    />
                </div>
            </TabsContent>
            
            <TabsContent value="buttons" className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="showSearch">Mostrar botón de búsqueda</Label>
                    <Switch
                        id="showSearch"
                        checked={editContent?.buttons?.showSearch !== false}
                        onCheckedChange={(checked) => updateNestedContent(['buttons'], 'showSearch', checked)}
                    />
                </div>

                <div>
                    <Label htmlFor="buttonsGap">Espaciado entre botones (px)</Label>
                    <Input
                        id="buttonsGap"
                        type="number"
                        value={parseInt(editContent?.buttons?.buttonsGap) || 10}
                        onChange={(e) => updateNestedContent(['buttons'], 'buttonsGap', `${e.target.value}px`)}
                    />
                </div>

                <Separator />
                
                <div className="space-y-4">
                    <h4 className="font-medium">Personalización de botones</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <ButtonStyleEditor buttonName="cart" buttonLabel="Carrito" />
                        <ButtonStyleEditor buttonName="search" buttonLabel="Buscador" />
                        <ButtonStyleEditor buttonName="profile" buttonLabel="Perfil" />
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="styles" className="space-y-4">
                <h4 className="font-medium mb-3">Estilos del Header</h4>

                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <div className="flex gap-2">
                        <Input
                            id="backgroundColor"
                            value={editStyles.backgroundColor || '#ffffff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            type="color"
                            value={editStyles.backgroundColor || '#ffffff'}
                            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                            className="w-12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Padding Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 20}
                            onChange={(e) => updateStyle('paddingTop', `${e.target.value}px`)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Padding Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 20}
                            onChange={(e) => updateStyle('paddingBottom', `${e.target.value}px`)}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="borderBottom">Borde Inferior</Label>
                    <Input
                        id="borderBottom"
                        value={editStyles.borderBottom || '1px solid #e5e7eb'}
                        onChange={(e) => updateStyle('borderBottom', e.target.value)}
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default HeaderEditDialog;