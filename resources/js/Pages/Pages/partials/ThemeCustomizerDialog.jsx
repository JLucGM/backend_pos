import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'sonner';
import { Palette, RefreshCw, Copy, Eye } from 'lucide-react';

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
        { label: 'Georgia', value: "'Georgia', serif" },
        { label: 'Arial', value: "'Arial', sans-serif" },
        { label: 'Helvetica', value: "'Helvetica', sans-serif" },
        // Agregar las combinaciones que vienen por defecto
        { label: 'Arial/Helvetica', value: "'Arial', 'Helvetica', sans-serif" },
        { label: 'Georgia/Times', value: "'Georgia', 'Times New Roman', serif" },
    ]);

    const [localSettings, setLocalSettings] = useState({});

    // Valores por defecto mínimos para fuentes (solo se usarán si themeSettings está vacío)
    const defaultFontSettings = {
        body_font: "'Arial', 'Helvetica', sans-serif",
        heading_font: "'Arial', 'Helvetica', sans-serif",
        subheading_font: "'Arial', 'Helvetica', sans-serif",
        accent_font: "'Georgia', 'Times New Roman', serif",
    };

    useEffect(() => {
        if (themeSettings && typeof themeSettings === 'object' && Object.keys(themeSettings).length > 0) {
            // Si themeSettings tiene datos, usarlo directamente
            setLocalSettings(themeSettings);
        } else {
            // Si themeSettings está vacío, usar los valores por defecto mínimos
            setLocalSettings(defaultFontSettings);
        }
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

    // Función para renderizar un color picker
    const ColorPicker = ({ label, value, onChange, placeholder }) => (
        <div>
            <Label>{label}</Label>
            <div className="flex gap-2 mt-1">
                <Input
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                <div
                    className="w-10 h-10 rounded border cursor-pointer"
                    style={{
                        backgroundColor: value ? `hsl(${value})` : '#ffffff'
                    }}
                    title="Vista previa del color"
                />
            </div>
        </div>
    );

    // Función para obtener el valor de fuente resuelto
    const getResolvedFont = (fontKey) => {
        const fontValue = localSettings[fontKey];
        if (!fontValue || fontValue === 'body_font') return localSettings.body_font;
        if (fontValue === 'heading_font') return localSettings.heading_font;
        if (fontValue === 'subheading_font') return localSettings.subheading_font;
        if (fontValue === 'accent_font') return localSettings.accent_font;
        if (fontValue === 'custom') return localSettings[`${fontKey}_custom`];
        return fontValue;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Personalizar Tema - {page?.title}
                    </DialogTitle>
                    <DialogDescription>
                        {hasCopiedTheme
                            ? 'Las personalizaciones del tema se aplicarán a TODAS las páginas de la compañía.'
                            : 'Debes copiar la configuración del tema para personalizarla. Esto creará una copia para todas las páginas de la compañía.'}
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
                            Esto permitirá modificarlo sin afectar al tema base. Se creará una copia para TODAS las páginas de la compañía.
                        </p>
                        <Button onClick={handleCopyTheme} size="lg">
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Configuración del Tema para Todas las Páginas
                        </Button>
                    </div>
                ) : (
                    <>
                        <Tabs defaultValue="general" className="mt-4">
                            <TabsList className="grid grid-cols-4">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="buttons">Botones</TabsTrigger>
                                <TabsTrigger value="inputs">Inputs</TabsTrigger>
                                <TabsTrigger value="typography">Tipografía</TabsTrigger>
                            </TabsList>

                            <div className="max-h-[55vh] overflow-y-auto p-4">
                                {/* Tab General - Colores generales */}
                                <TabsContent value="general">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium mb-4 flex items-center gap-2">
                                                <Palette className="h-4 w-4" />
                                                Colores Generales
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <ColorPicker
                                                    label="Color de Fondo"
                                                    value={localSettings.background}
                                                    onChange={(value) => handleChange('background', value)}
                                                    placeholder="0 0% 100%"
                                                />
                                                <ColorPicker
                                                    label="Color de Títulos"
                                                    value={localSettings.heading}
                                                    onChange={(value) => handleChange('heading', value)}
                                                    placeholder="0 0% 3.9%"
                                                />
                                                <ColorPicker
                                                    label="Color de Texto"
                                                    value={localSettings.text}
                                                    onChange={(value) => handleChange('text', value)}
                                                    placeholder="0 0% 3.9%"
                                                />
                                                <ColorPicker
                                                    label="Color de Enlaces"
                                                    value={localSettings.links}
                                                    onChange={(value) => handleChange('links', value)}
                                                    placeholder="209 100% 50%"
                                                />
                                                <ColorPicker
                                                    label="Color de Enlaces (Hover)"
                                                    value={localSettings.hover_links}
                                                    onChange={(value) => handleChange('hover_links', value)}
                                                    placeholder="209 100% 40%"
                                                />
                                                <ColorPicker
                                                    label="Color de Bordes"
                                                    value={localSettings.borders}
                                                    onChange={(value) => handleChange('borders', value)}
                                                    placeholder="0 0% 96.1%"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-4">Sombras</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <Label>Sombras (HSL + Opacidad)</Label>
                                                    <Input
                                                        value={localSettings.shadows || ''}
                                                        onChange={(e) => handleChange('shadows', e.target.value)}
                                                        placeholder="0 0% 0% 0.1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Tab Botones */}
                                <TabsContent value="buttons">
                                    <div className="space-y-6">
                                        {/* Botón Primario */}
                                        <div>
                                            <h4 className="font-medium mb-4">Botón Primario</h4>
                                            <div className="space-y-4">
                                                <div className="pl-4 border-l-2 border-blue-200">
                                                    <h5 className="text-sm font-medium mb-2">Estado Normal</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo"
                                                            value={localSettings.primary_button_background}
                                                            onChange={(value) => handleChange('primary_button_background', value)}
                                                            placeholder="209 100% 92%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Texto"
                                                            value={localSettings.primary_button_text}
                                                            onChange={(value) => handleChange('primary_button_text', value)}
                                                            placeholder="0 0% 3.9%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde"
                                                            value={localSettings.primary_button_border}
                                                            onChange={(value) => handleChange('primary_button_border', value)}
                                                            placeholder="209 100% 92%"
                                                        />
                                                        <div>
                                                            <Label>Grosor de Borde</Label>
                                                            <Select
                                                                value={localSettings.primary_button_border_thickness || '1px'}
                                                                onValueChange={(value) => handleChange('primary_button_border_thickness', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0px">Sin borde</SelectItem>
                                                                    <SelectItem value="1px">1px</SelectItem>
                                                                    <SelectItem value="2px">2px</SelectItem>
                                                                    <SelectItem value="3px">3px</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Radio de Esquinas</Label>
                                                            <Input
                                                                value={localSettings.primary_button_corner_radius || '0.5rem'}
                                                                onChange={(e) => handleChange('primary_button_corner_radius', e.target.value)}
                                                                placeholder="0.5rem"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Transformación de Texto</Label>
                                                            <Select
                                                                value={localSettings.primary_button_text_case || 'default'}
                                                                onValueChange={(value) => handleChange('primary_button_text_case', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="default">Normal</SelectItem>
                                                                    <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                                                                    <SelectItem value="lowercase">minúsculas</SelectItem>
                                                                    <SelectItem value="capitalize">Capitalizar</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pl-4 border-l-2 border-blue-200">
                                                    <h5 className="text-sm font-medium mb-2">Estado Hover</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo (Hover)"
                                                            value={localSettings.primary_button_hover_background}
                                                            onChange={(value) => handleChange('primary_button_hover_background', value)}
                                                            placeholder="209 100% 84%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Texto (Hover)"
                                                            value={localSettings.primary_button_hover_text}
                                                            onChange={(value) => handleChange('primary_button_hover_text', value)}
                                                            placeholder="0 0% 3.9%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde (Hover)"
                                                            value={localSettings.primary_button_hover_border}
                                                            onChange={(value) => handleChange('primary_button_hover_border', value)}
                                                            placeholder="209 100% 84%"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botón Secundario */}
                                        <div>
                                            <h4 className="font-medium mb-4">Botón Secundario</h4>
                                            <div className="space-y-4">
                                                <div className="pl-4 border-l-2 border-gray-200">
                                                    <h5 className="text-sm font-medium mb-2">Estado Normal</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo"
                                                            value={localSettings.secondary_button_background}
                                                            onChange={(value) => handleChange('secondary_button_background', value)}
                                                            placeholder="0 0% 96.1%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Texto"
                                                            value={localSettings.secondary_button_text}
                                                            onChange={(value) => handleChange('secondary_button_text', value)}
                                                            placeholder="0 0% 3.9%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde"
                                                            value={localSettings.secondary_button_border}
                                                            onChange={(value) => handleChange('secondary_button_border', value)}
                                                            placeholder="0 0% 96.1%"
                                                        />
                                                        <div>
                                                            <Label>Grosor de Borde</Label>
                                                            <Select
                                                                value={localSettings.secondary_button_border_thickness || '1px'}
                                                                onValueChange={(value) => handleChange('secondary_button_border_thickness', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0px">Sin borde</SelectItem>
                                                                    <SelectItem value="1px">1px</SelectItem>
                                                                    <SelectItem value="2px">2px</SelectItem>
                                                                    <SelectItem value="3px">3px</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Radio de Esquinas</Label>
                                                            <Input
                                                                value={localSettings.secondary_button_corner_radius || '0.5rem'}
                                                                onChange={(e) => handleChange('secondary_button_corner_radius', e.target.value)}
                                                                placeholder="0.5rem"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Transformación de Texto</Label>
                                                            <Select
                                                                value={localSettings.secondary_button_text_case || 'default'}
                                                                onValueChange={(value) => handleChange('secondary_button_text_case', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="default">Normal</SelectItem>
                                                                    <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                                                                    <SelectItem value="lowercase">minúsculas</SelectItem>
                                                                    <SelectItem value="capitalize">Capitalizar</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pl-4 border-l-2 border-gray-200">
                                                    <h5 className="text-sm font-medium mb-2">Estado Hover</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo (Hover)"
                                                            value={localSettings.secondary_button_hover_background}
                                                            onChange={(value) => handleChange('secondary_button_hover_background', value)}
                                                            placeholder="0 0% 84.1%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Texto (Hover)"
                                                            value={localSettings.secondary_button_hover_text}
                                                            onChange={(value) => handleChange('secondary_button_hover_text', value)}
                                                            placeholder="0 0% 3.9%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde (Hover)"
                                                            value={localSettings.secondary_button_hover_border}
                                                            onChange={(value) => handleChange('secondary_button_hover_border', value)}
                                                            placeholder="0 0% 84.1%"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Tab Inputs */}
                                <TabsContent value="inputs">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium mb-4">Campos de Entrada (Inputs)</h4>
                                            <div className="space-y-4">
                                                <div className="pl-4 border-l-2 border-green-200">
                                                    <h5 className="text-sm font-medium mb-2">Estado Normal</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo"
                                                            value={localSettings.input_background}
                                                            onChange={(value) => handleChange('input_background', value)}
                                                            placeholder="0 0% 100%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Texto"
                                                            value={localSettings.input_text}
                                                            onChange={(value) => handleChange('input_text', value)}
                                                            placeholder="0 0% 3.9%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde"
                                                            value={localSettings.input_border}
                                                            onChange={(value) => handleChange('input_border', value)}
                                                            placeholder="0 0% 96.1%"
                                                        />
                                                        <div>
                                                            <Label>Grosor de Borde</Label>
                                                            <Select
                                                                value={localSettings.input_border_thickness || '1px'}
                                                                onValueChange={(value) => handleChange('input_border_thickness', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0px">Sin borde</SelectItem>
                                                                    <SelectItem value="1px">1px</SelectItem>
                                                                    <SelectItem value="2px">2px</SelectItem>
                                                                    <SelectItem value="3px">3px</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Radio de Esquinas</Label>
                                                            <Input
                                                                value={localSettings.input_corner_radius || '0.375rem'}
                                                                onChange={(e) => handleChange('input_corner_radius', e.target.value)}
                                                                placeholder="0.375rem"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pl-4 border-l-2 border-green-200">
                                                    <h5 className="text-sm font-medium mb-2">Estados Hover y Focus</h5>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <ColorPicker
                                                            label="Color de Fondo (Hover)"
                                                            value={localSettings.input_hover_background}
                                                            onChange={(value) => handleChange('input_hover_background', value)}
                                                            placeholder="0 0% 100%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Fondo (Focus)"
                                                            value={localSettings.input_focus_background}
                                                            onChange={(value) => handleChange('input_focus_background', value)}
                                                            placeholder="0 0% 100%"
                                                        />
                                                        <ColorPicker
                                                            label="Color de Borde (Focus)"
                                                            value={localSettings.input_focus_border}
                                                            onChange={(value) => handleChange('input_focus_border', value)}
                                                            placeholder="209 100% 92%"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Tab Tipografía */}
                                <TabsContent value="typography">
                                    <div className="space-y-6">
                                        {/* Fuentes Base */}
                                        <div>
                                            <h4 className="font-medium mb-4">Fuentes Base</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Fuente Body (Texto normal)</Label>
                                                    <Select
                                                        value={localSettings.body_font || "'Arial', 'Helvetica', sans-serif"}
                                                        onValueChange={(value) => handleChange('body_font', value)}
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
                                                <div>
                                                    <Label>Fuente Heading (Títulos)</Label>
                                                    <Select
                                                        value={localSettings.heading_font || "'Arial', 'Helvetica', sans-serif"}
                                                        onValueChange={(value) => handleChange('heading_font', value)}
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
                                                <div>
                                                    <Label>Fuente Subheading (Subtítulos)</Label>
                                                    <Select
                                                        value={localSettings.subheading_font || "'Arial', 'Helvetica', sans-serif"}
                                                        onValueChange={(value) => handleChange('subheading_font', value)}
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
                                                <div>
                                                    <Label>Fuente Accent (Acento/Decorativa)</Label>
                                                    <Select
                                                        value={localSettings.accent_font || "'Georgia', 'Times New Roman', serif"}
                                                        onValueChange={(value) => handleChange('accent_font', value)}
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
                                            </div>
                                        </div>

                                        {/* Configuración de párrafo */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium mb-4">Párrafo (Texto normal)</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Fuente del párrafo</Label>
                                                    <Select
                                                        value={localSettings.paragraph_font || 'body_font'}
                                                        onValueChange={(value) => handleChange('paragraph_font', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="body_font">Usar Body Font</SelectItem>
                                                            <SelectItem value="heading_font">Usar Heading Font</SelectItem>
                                                            <SelectItem value="subheading_font">Usar Subheading Font</SelectItem>
                                                            <SelectItem value="accent_font">Usar Accent Font</SelectItem>
                                                            <SelectItem value="custom">Personalizada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {localSettings.paragraph_font === 'custom' && (
                                                    <div>
                                                        <Label>Fuente personalizada</Label>
                                                        <Input
                                                            value={localSettings.paragraph_custom_font || ''}
                                                            onChange={(e) => handleChange('paragraph_custom_font', e.target.value)}
                                                            placeholder="'Roboto', sans-serif"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <Label>Tamaño de fuente</Label>
                                                    <Input
                                                        value={localSettings.paragraph_fontSize || '16px'}
                                                        onChange={(e) => handleChange('paragraph_fontSize', e.target.value)}
                                                        placeholder="16px"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Peso de fuente</Label>
                                                    <Select
                                                        value={localSettings.paragraph_fontWeight || 'normal'}
                                                        onValueChange={(value) => handleChange('paragraph_fontWeight', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="normal">Normal</SelectItem>
                                                            <SelectItem value="bold">Negrita</SelectItem>
                                                            <SelectItem value="300">Ligero</SelectItem>
                                                            <SelectItem value="500">Medio</SelectItem>
                                                            <SelectItem value="600">Seminegrita</SelectItem>
                                                            <SelectItem value="700">Negrita</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Altura de línea</Label>
                                                    <Input
                                                        value={localSettings.paragraph_lineHeight || '1.6'}
                                                        onChange={(e) => handleChange('paragraph_lineHeight', e.target.value)}
                                                        placeholder="1.6"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Transformación de texto</Label>
                                                    <Select
                                                        value={localSettings.paragraph_textTransform || 'none'}
                                                        onValueChange={(value) => handleChange('paragraph_textTransform', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">Normal</SelectItem>
                                                            <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                                                            <SelectItem value="lowercase">minúsculas</SelectItem>
                                                            <SelectItem value="capitalize">Capitalizar</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Configuración de headings */}
                                        {[1, 2, 3, 4, 5, 6].map(level => (
                                            <div key={level} className="border-t pt-4">
                                                <h4 className="font-medium mb-4">Heading {level} (h{level})</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Fuente del heading</Label>
                                                        <Select
                                                            value={localSettings[`heading${level}_font`] || 'heading_font'}
                                                            onValueChange={(value) => handleChange(`heading${level}_font`, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="body_font">Usar Body Font</SelectItem>
                                                                <SelectItem value="heading_font">Usar Heading Font</SelectItem>
                                                                <SelectItem value="subheading_font">Usar Subheading Font</SelectItem>
                                                                <SelectItem value="accent_font">Usar Accent Font</SelectItem>
                                                                <SelectItem value="custom">Personalizada</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {localSettings[`heading${level}_font`] === 'custom' && (
                                                        <div>
                                                            <Label>Fuente personalizada</Label>
                                                            <Input
                                                                value={localSettings[`heading${level}_custom_font`] || ''}
                                                                onChange={(e) => handleChange(`heading${level}_custom_font`, e.target.value)}
                                                                placeholder="'Montserrat', sans-serif"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Label>Tamaño de fuente</Label>
                                                        <Input
                                                            value={localSettings[`heading${level}_fontSize`] || (level === 1 ? '2.5rem' : 
                                                                    level === 2 ? '2rem' : 
                                                                    level === 3 ? '1.75rem' : 
                                                                    level === 4 ? '1.5rem' : 
                                                                    level === 5 ? '1.25rem' : '1rem')}
                                                            onChange={(e) => handleChange(`heading${level}_fontSize`, e.target.value)}
                                                            placeholder={level === 1 ? '2.5rem' : 
                                                                    level === 2 ? '2rem' : 
                                                                    level === 3 ? '1.75rem' : 
                                                                    level === 4 ? '1.5rem' : 
                                                                    level === 5 ? '1.25rem' : '1rem'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Peso de fuente</Label>
                                                        <Select
                                                            value={localSettings[`heading${level}_fontWeight`] || 'bold'}
                                                            onValueChange={(value) => handleChange(`heading${level}_fontWeight`, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="normal">Normal</SelectItem>
                                                                <SelectItem value="bold">Negrita</SelectItem>
                                                                <SelectItem value="300">Ligero</SelectItem>
                                                                <SelectItem value="500">Medio</SelectItem>
                                                                <SelectItem value="600">Seminegrita</SelectItem>
                                                                <SelectItem value="700">Negrita</SelectItem>
                                                                <SelectItem value="800">Extranegrita</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label>Altura de línea</Label>
                                                        <Input
                                                            value={localSettings[`heading${level}_lineHeight`] || (level <= 2 ? '1.2' : '1.4')}
                                                            onChange={(e) => handleChange(`heading${level}_lineHeight`, e.target.value)}
                                                            placeholder={level <= 2 ? '1.2' : '1.4'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Transformación de texto</Label>
                                                        <Select
                                                            value={localSettings[`heading${level}_textTransform`] || 'none'}
                                                            onValueChange={(value) => handleChange(`heading${level}_textTransform`, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Normal</SelectItem>
                                                                <SelectItem value="uppercase">MAYÚSCULAS</SelectItem>
                                                                <SelectItem value="lowercase">minúsculas</SelectItem>
                                                                <SelectItem value="capitalize">Capitalizar</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                
                                                {/* Vista previa del heading */}
                                                <div className="mt-2 p-3 bg-gray-50 rounded">
                                                    <div className="text-xs text-gray-500 mb-1">Vista previa:</div>
                                                    <div
                                                        style={{
                                                            fontFamily: getResolvedFont(`heading${level}_font`),
                                                            fontSize: localSettings[`heading${level}_fontSize`] || (level === 1 ? '2.5rem' : 
                                                                    level === 2 ? '2rem' : 
                                                                    level === 3 ? '1.75rem' : 
                                                                    level === 4 ? '1.5rem' : 
                                                                    level === 5 ? '1.25rem' : '1rem'),
                                                            fontWeight: localSettings[`heading${level}_fontWeight`] || 'bold',
                                                            lineHeight: localSettings[`heading${level}_lineHeight`] || (level <= 2 ? '1.2' : '1.4'),
                                                            textTransform: localSettings[`heading${level}_textTransform`] || 'none',
                                                            color: `hsl(${localSettings.heading || '0 0% 3.9%'})`
                                                        }}
                                                    >
                                                        Ejemplo Heading {level}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        

                        <DialogFooter className="gap-2 mt-4">
                            <Button variant="outline" onClick={handleReset}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Restablecer Todas las Páginas
                            </Button>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
                                Guardar en Todas las Páginas
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ThemeCustomizerDialog;