import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';
import { ColorPicker } from '@/components/ui/color-picker';

// Importar los componentes de botones
import CartButtonEditor from './CartButtonEditor';
import SearchButtonEditor from './SearchButtonEditor';
import ProfileButtonEditor from './ProfileButtonEditor';
import CurrencySelectorEditor from './CurrencySelectorEditor';

const HeaderEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    isLiveEdit = true,
    themeSettings,
    appliedTheme
}) => {
    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    const resolveValue = useCallback((value) => {
        return resolveStyleValue(value, themeSettings, appliedTheme);
    }, [themeSettings, appliedTheme]);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateContent = useCallback((key, value) => {
        setEditContent(prev => ({ ...prev, [key]: value }));
    }, [setEditContent]);

    const updateNestedContent = useCallback((path, key, value) => {
        setEditContent(prev => {
            const newContent = { ...prev };
            let current = newContent;

            for (const p of path) {
                if (!current[p]) current[p] = {};
                current = current[p];
            }

            current[key] = value;
            return newContent;
        });
    }, [setEditContent]);

    const updateButtonConfig = useCallback((buttonName, newConfig) => {
        setEditContent(prev => {
            const newContent = { ...prev };
            if (!newContent.buttons) newContent.buttons = {};
            if (!newContent.buttons[buttonName]) newContent.buttons[buttonName] = {};

            newContent.buttons[buttonName] = {
                ...newContent.buttons[buttonName],
                ...newConfig
            };
            return newContent;
        });
    }, [setEditContent]);

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const getPositionInfo = useCallback(() => {
        const logoPos = editContent?.logoPosition || 'left';
        if (logoPos === 'left') {
            return "Orden: Logo → Menú → Botones (Carrito, Buscador, Perfil)";
        } else if (logoPos === 'center') {
            return "Orden: Menú → Logo → Botones";
        } else if (logoPos === 'right') {
            return "Orden: Menú → Logo (pegado a botones) → Botones";
        }
        return "";
    }, [editContent?.logoPosition]);

    const bgColor = resolveValue(editStyles.backgroundColor) || '#ffffff';
    const borders = resolveValue(editStyles?.borders) || '#ffffff';


    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="buttons">Botones</TabsTrigger>
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
                        checked={(editContent?.stickyType ? editContent.stickyType !== 'none' : Boolean(editContent?.sticky)) || false}
                        onCheckedChange={(checked) => updateContent('stickyType', checked ? 'fixed' : 'none')}
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
                    <Label htmlFor="height">Altura del Header</Label>
                    <div className="flex gap-2">
                        <Input
                            id="height"
                            type="number"
                            value={parseInt(editContent?.height) || 70}
                            onChange={(e) => updateContent('height', e.target.value)}
                            placeholder="70"
                            className="flex-1"
                        />
                        <Select
                            value={editContent?.heightUnit || (editContent?.height?.toString().includes('vh') ? 'vh' : 'px')}
                            onValueChange={(value) => updateContent('heightUnit', value)}
                        >
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="px">px</SelectItem>
                                <SelectItem value="vh">vh</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="backgroundColor">Color de Fondo</Label>
                    <ColorPicker
                        value={bgColor}
                        onChange={(hex) => updateStyle('backgroundColor', hex)}
                        showOpacity={false}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Padding Superior</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 20}
                            onChange={(e) => updateStyle('paddingTop', e.target.value)}
                            placeholder="20"
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Padding Inferior</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 20}
                            onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                            placeholder="20"
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

            <TabsContent value="buttons" className="space-y-6">
                <div>
                    <Label htmlFor="buttonsGap">Espaciado entre botones</Label>
                    <Input
                        id="buttonsGap"
                        type="number"
                        value={parseInt(editContent?.buttons?.buttonsGap) || 10}
                        onChange={(e) => updateNestedContent(['buttons'], 'buttonsGap', e.target.value)}
                        placeholder="10"
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="font-medium">Personalización de botones</h4>

                    <div className="grid grid-cols-1 gap-4">
                        <CartButtonEditor
                            buttonConfig={editContent?.buttons?.cart || {}}
                            onUpdate={(newConfig) => updateButtonConfig('cart', newConfig)}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                        <Separator className='my-4' />
                        <SearchButtonEditor
                            buttonConfig={editContent?.buttons?.search || {}}
                            showSearch={editContent?.buttons?.showSearch}
                            onUpdate={(newConfig) => updateButtonConfig('search', newConfig)}
                            onUpdateShowSearch={(value) => updateNestedContent(['buttons'], 'showSearch', value)}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                        <Separator className='my-4' />
                        <ProfileButtonEditor
                            buttonConfig={editContent?.buttons?.profile || {}}
                            onUpdate={(newConfig) => updateButtonConfig('profile', newConfig)}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                        <Separator className='my-4' />
                        <CurrencySelectorEditor
                            buttonConfig={editContent?.buttons?.currency || {}}
                            onUpdate={(newConfig) => updateButtonConfig('currency', newConfig)}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                        />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
};

export default React.memo(HeaderEditDialog);