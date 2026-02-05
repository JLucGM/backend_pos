import React, { useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { Separator } from '@/Components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { useDebounce } from '@/hooks/Builder/useDebounce';

export default function ProfileEditDialog({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    isLiveEdit = true
}) {
    const content = editContent || {};
    const styles = editStyles || {};

    const debouncedContent = useDebounce(editContent, 300);
    const debouncedStyles = useDebounce(editStyles, 300);

    useEffect(() => {
        if (isLiveEdit) {
            // Las actualizaciones se manejan automáticamente
        }
    }, [debouncedContent, debouncedStyles, isLiveEdit]);

    const updateContent = (key, value) => {
        setEditContent(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateStyle = (key, value) => {
        setEditStyles(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Contenido</TabsTrigger>
                    <TabsTrigger value="styles">Estilos</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    <div>
                        <Label htmlFor="title">Título Principal</Label>
                        <Input
                            id="title"
                            value={content.title || ''}
                            onChange={(e) => updateContent('title', e.target.value)}
                            placeholder="Mi Perfil"
                        />
                    </div>

                    <div>
                        <Label htmlFor="layoutType">Tipo de Layout</Label>
                        <select
                            id="layoutType"
                            value={content.layoutType || 'tabs'}
                            onChange={(e) => updateContent('layoutType', e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="tabs">Tabs (Pestañas)</option>
                            <option value="grid">Grid (Cuadrícula)</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                            Tabs: Organiza el contenido en pestañas. Grid: Muestra todo en una cuadrícula.
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="personalInfoTitle">Título Información Personal</Label>
                        <Input
                            id="personalInfoTitle"
                            value={content.personalInfoTitle || ''}
                            onChange={(e) => updateContent('personalInfoTitle', e.target.value)}
                            placeholder="Información Personal"
                        />
                    </div>

                    <div>
                        <Label htmlFor="addressesTitle">Título Direcciones</Label>
                        <Input
                            id="addressesTitle"
                            value={content.addressesTitle || ''}
                            onChange={(e) => updateContent('addressesTitle', e.target.value)}
                            placeholder="Direcciones de Envío"
                        />
                    </div>

                    <div>
                        <Label htmlFor="giftCardsTitle">Título Gift Cards</Label>
                        <Input
                            id="giftCardsTitle"
                            value={content.giftCardsTitle || ''}
                            onChange={(e) => updateContent('giftCardsTitle', e.target.value)}
                            placeholder="Mis Gift Cards"
                        />
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="loginRequiredTitle">Título cuando no hay sesión</Label>
                        <Input
                            id="loginRequiredTitle"
                            value={content.loginRequiredTitle || ''}
                            onChange={(e) => updateContent('loginRequiredTitle', e.target.value)}
                            placeholder="Inicia sesión para ver tu perfil"
                        />
                    </div>

                    <div>
                        <Label htmlFor="loginRequiredMessage">Mensaje cuando no hay sesión</Label>
                        <Textarea
                            id="loginRequiredMessage"
                            value={content.loginRequiredMessage || ''}
                            onChange={(e) => updateContent('loginRequiredMessage', e.target.value)}
                            placeholder="Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="loginButtonText">Texto del botón de login</Label>
                        <Input
                            id="loginButtonText"
                            value={content.loginButtonText || ''}
                            onChange={(e) => updateContent('loginButtonText', e.target.value)}
                            placeholder="Iniciar Sesión"
                        />
                    </div>
                </TabsContent>

                <TabsContent value="styles" className="space-y-4">
                    <div>
                        <Label>Configuración del Contenedor</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label htmlFor="maxWidth">Ancho máximo</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="maxWidth"
                                        type="number"
                                        value={parseInt(styles.maxWidth) || 1200}
                                        onChange={(e) => updateStyle('maxWidth', e.target.value)}
                                        placeholder="1200"
                                        className="flex-1"
                                    />
                                    <Select
                                        value={styles.maxWidthUnit || (styles.maxWidth?.toString().includes('%') ? '%' : 'px')}
                                        onValueChange={(value) => updateStyle('maxWidthUnit', value)}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="px">px</SelectItem>
                                            <SelectItem value="%">%</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="backgroundColor">Color de fondo</Label>
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={styles.backgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label>Espaciado (Padding)</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label htmlFor="paddingTop">Superior</Label>
                                <Input
                                    id="paddingTop"
                                    type="number"
                                    value={parseInt(styles.paddingTop) || 40}
                                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                                    placeholder="40"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingBottom">Inferior</Label>
                                <Input
                                    id="paddingBottom"
                                    type="number"
                                    value={parseInt(styles.paddingBottom) || 40}
                                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                                    placeholder="40"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingLeft">Izquierdo</Label>
                                <Input
                                    id="paddingLeft"
                                    type="number"
                                    value={parseInt(styles.paddingLeft) || 20}
                                    onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                                    placeholder="20"
                                />
                            </div>
                            <div>
                                <Label htmlFor="paddingRight">Derecho</Label>
                                <Input
                                    id="paddingRight"
                                    type="number"
                                    value={parseInt(styles.paddingRight) || 20}
                                    onChange={(e) => updateStyle('paddingRight', e.target.value)}
                                    placeholder="20"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label>Título Principal</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label htmlFor="titleColor">Color</Label>
                                <Input
                                    id="titleColor"
                                    type="color"
                                    value={styles.titleColor || '#000000'}
                                    onChange={(e) => updateStyle('titleColor', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="titleSize">Tamaño</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="titleSize"
                                        type="number"
                                        value={parseInt(styles.titleSize) || 32}
                                        onChange={(e) => updateStyle('titleSize', e.target.value)}
                                        placeholder="32"
                                        className="flex-1"
                                    />
                                    <Select
                                        value={styles.titleSizeUnit || (styles.titleSize?.toString().includes('rem') ? 'rem' : 'px')}
                                        onValueChange={(value) => updateStyle('titleSizeUnit', value)}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="px">px</SelectItem>
                                            <SelectItem value="rem">rem</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="titleWeight">Peso</Label>
                                <select
                                    id="titleWeight"
                                    value={styles.titleWeight || 'bold'}
                                    onChange={(e) => updateStyle('titleWeight', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="600">Semi Bold</option>
                                    <option value="700">Bold</option>
                                    <option value="800">Extra Bold</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="titleAlignment">Alineación</Label>
                                <select
                                    id="titleAlignment"
                                    value={styles.titleAlignment || 'left'}
                                    onChange={(e) => updateStyle('titleAlignment', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="left">Izquierda</option>
                                    <option value="center">Centro</option>
                                    <option value="right">Derecha</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label>Tarjetas</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <Label htmlFor="cardBackgroundColor">Color de fondo</Label>
                                <Input
                                    id="cardBackgroundColor"
                                    type="color"
                                    value={styles.cardBackgroundColor || '#ffffff'}
                                    onChange={(e) => updateStyle('cardBackgroundColor', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cardBorderRadius">Radio del borde</Label>
                                <Input
                                    id="cardBorderRadius"
                                    type="number"
                                    value={parseInt(styles.cardBorderRadius) || 12}
                                    onChange={(e) => updateStyle('cardBorderRadius', e.target.value)}
                                    placeholder="12"
                                />
                            </div>
                            <div>
                                <Label htmlFor="cardBorder">Borde</Label>
                                <Input
                                    id="cardBorder"
                                    value={styles.cardBorder || ''}
                                    onChange={(e) => updateStyle('cardBorder', e.target.value)}
                                    placeholder="1px solid #e5e7eb"
                                />
                            </div>
                            <div>
                                <Label htmlFor="cardPadding">Padding interno</Label>
                                <Input
                                    id="cardPadding"
                                    type="number"
                                    value={parseInt(styles.cardPadding) || 24}
                                    onChange={(e) => updateStyle('cardPadding', e.target.value)}
                                    placeholder="24"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Label htmlFor="borderRadius">Radio del borde del contenedor</Label>
                        <Input
                            id="borderRadius"
                            type="number"
                            value={parseInt(styles.borderRadius) || 0}
                            onChange={(e) => updateStyle('borderRadius', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}