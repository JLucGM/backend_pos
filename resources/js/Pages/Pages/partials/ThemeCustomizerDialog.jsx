// components/BuilderPages/ThemeCustomizerDialog.jsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'sonner';
import { Palette,  RefreshCw, Copy } from 'lucide-react';

const ThemeCustomizerDialog = ({
    open,
    onOpenChange,
    page,
    themeSettings,
    hasCopiedTheme,
    onCopyTheme,
    onSave,
    onReset
}) => {
    const [fonts] = useState([
        { label: 'Inter', value: "'Inter', sans-serif" },
        { label: 'Roboto', value: "'Roboto', sans-serif" },
        { label: 'Open Sans', value: "'Open Sans', sans-serif" },
        { label: 'Montserrat', value: "'Montserrat', sans-serif" },
        { label: 'Poppins', value: "'Poppins', sans-serif" },
        { label: 'Lato', value: "'Lato', sans-serif" },
        { label: 'Playfair Display', value: "'Playfair Display', serif" },
    ]);

    const [localSettings, setLocalSettings] = useState({});

    useEffect(() => {
        setLocalSettings(themeSettings);
    }, [themeSettings]);

    const handleChange = (key, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        onSave(localSettings);
    };

    const handleReset = () => {
        if (confirm('¿Restablecer todas las personalizaciones del tema?')) {
            onReset();
        }
    };

    const handleCopyTheme = () => {
        if (confirm('¿Copiar configuración del tema original para personalizar?')) {
            onCopyTheme();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Personalizar Tema
                    </DialogTitle>
                    <DialogDescription>
                        {hasCopiedTheme 
                            ? 'Estás editando una copia de la configuración del tema.'
                            : 'Debes copiar la configuración del tema para personalizarla.'}
                    </DialogDescription>
                </DialogHeader>

                {!hasCopiedTheme ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <Copy className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Configuración no copiada</h3>
                        <p className="text-gray-600 mb-6">
                            Para personalizar el tema, necesitas crear una copia de la configuración del tema original.
                            Esto permitirá modificarlo sin afectar al tema base.
                        </p>
                        <Button onClick={handleCopyTheme} size="lg">
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Configuración del Tema
                        </Button>
                    </div>
                ) : (
                    <>
                        <Tabs defaultValue="colors" className="mt-4">
                            <TabsList className="grid grid-cols-3">
                                <TabsTrigger value="colors">Colores</TabsTrigger>
                                <TabsTrigger value="typography">Tipografía</TabsTrigger>
                                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                            </TabsList>

                            <div className="max-h-[50vh] overflow-y-auto p-4">
                                <TabsContent value="colors">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Color Primario</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={localSettings.primary || ''}
                                                        onChange={(e) => handleChange('primary', e.target.value)}
                                                        placeholder="HSL: 209 100% 92%"
                                                    />
                                                    <div
                                                        className="w-10 h-10 rounded border"
                                                        style={{
                                                            backgroundColor: localSettings.primary 
                                                                ? `hsl(${localSettings.primary})` 
                                                                : '#e1f0fe'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Color de Fondo</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={localSettings.background || ''}
                                                        onChange={(e) => handleChange('background', e.target.value)}
                                                        placeholder="HSL: 0 0% 100%"
                                                    />
                                                    <div
                                                        className="w-10 h-10 rounded border"
                                                        style={{
                                                            backgroundColor: localSettings.background 
                                                                ? `hsl(${localSettings.background})` 
                                                                : '#ffffff'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Color de Texto</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={localSettings.foreground || ''}
                                                        onChange={(e) => handleChange('foreground', e.target.value)}
                                                    />
                                                    <div
                                                        className="w-10 h-10 rounded border"
                                                        style={{
                                                            backgroundColor: localSettings.foreground 
                                                                ? `hsl(${localSettings.foreground})` 
                                                                : '#0a0a0a'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Color Secundario</Label>
                                                <div className="flex gap-2 mt-1">
                                                    <Input
                                                        value={localSettings.secondary || ''}
                                                        onChange={(e) => handleChange('secondary', e.target.value)}
                                                    />
                                                    <div
                                                        className="w-10 h-10 rounded border"
                                                        style={{
                                                            backgroundColor: localSettings.secondary 
                                                                ? `hsl(${localSettings.secondary})` 
                                                                : '#f5f5f5'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="typography">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Fuente Principal</Label>
                                            <Select
                                                value={localSettings.fontFamily || "'Inter', sans-serif"}
                                                onValueChange={(value) => handleChange('fontFamily', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fonts.map(font => (
                                                        <SelectItem key={font.value} value={font.value}>
                                                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Radio de Bordes</Label>
                                                <Input
                                                    value={localSettings.borderRadius || '0.5rem'}
                                                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                                                    placeholder="0.5rem"
                                                />
                                            </div>
                                            <div>
                                                <Label>Tamaño Base de Fuente</Label>
                                                <Input
                                                    value={localSettings.fontSizeBase || '16px'}
                                                    onChange={(e) => handleChange('fontSizeBase', e.target.value)}
                                                    placeholder="16px"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="advanced">
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Espaciado Base</Label>
                                            <Input
                                                value={localSettings.spacingBase || '1rem'}
                                                onChange={(e) => handleChange('spacingBase', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Opacidad por Defecto</Label>
                                            <Input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={localSettings.defaultOpacity || 1}
                                                onChange={(e) => handleChange('defaultOpacity', parseFloat(e.target.value))}
                                            />
                                            <span className="text-sm text-gray-600">
                                                {localSettings.defaultOpacity || 1}
                                            </span>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={handleReset}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Restablecer al Tema Original
                            </Button>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ThemeCustomizerDialog;