// components/BuilderPages/ThemeCustomizerDialog.jsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { toast } from 'sonner';
import { Palette, RefreshCw, Copy } from 'lucide-react';

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
                                <TabsTrigger value="buttons">Botones</TabsTrigger>
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
                                    <div className="space-y-6">
                                        {/* Fuentes Base */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Fuentes Base</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Fuente Body (Texto normal)</Label>
                                                    <Select
                                                        value={localSettings.body_font || "'Inter', sans-serif"}
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
                                                        value={localSettings.heading_font || "'Inter', sans-serif"}
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
                                                        value={localSettings.subheading_font || "'Inter', sans-serif"}
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
                                                        value={localSettings.accent_font || "'Inter', sans-serif"}
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
                                        <div className="space-y-4 border-t pt-4">
                                            <h4 className="font-medium">Párrafo (Texto normal)</h4>
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
                                                    <Select
                                                        value={localSettings.paragraph_lineHeight || '1.6'}
                                                        onValueChange={(value) => handleChange('paragraph_lineHeight', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="tight">Tight (1.2)</SelectItem>
                                                            <SelectItem value="normal">Normal (1.4)</SelectItem>
                                                            <SelectItem value="loose">Loose (1.6)</SelectItem>
                                                            <SelectItem value="custom">Personalizada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {localSettings.paragraph_lineHeight === 'custom' && (
                                                    <div>
                                                        <Label>Altura personalizada</Label>
                                                        <Input
                                                            value={localSettings.paragraph_lineHeight_custom || ''}
                                                            onChange={(e) => handleChange('paragraph_lineHeight_custom', e.target.value)}
                                                            placeholder="1.5"
                                                        />
                                                    </div>
                                                )}
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
                                            <div key={level} className="space-y-4 border-t pt-4">
                                                <h4 className="font-medium">Heading {level} (h{level})</h4>
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
                                                            value={localSettings[`heading${level}_fontSize`] || `${3.5 - (level * 0.25)}rem`}
                                                            onChange={(e) => handleChange(`heading${level}_fontSize`, e.target.value)}
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
                                                        <Select
                                                            value={localSettings[`heading${level}_lineHeight`] || 'tight'}
                                                            onValueChange={(value) => handleChange(`heading${level}_lineHeight`, value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="tight">Tight</SelectItem>
                                                                <SelectItem value="normal">Normal</SelectItem>
                                                                <SelectItem value="loose">Loose</SelectItem>
                                                                <SelectItem value="custom">Personalizada</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {localSettings[`heading${level}_lineHeight`] === 'custom' && (
                                                        <div>
                                                            <Label>Altura personalizada</Label>
                                                            <Input
                                                                value={localSettings[`heading${level}_lineHeight_custom`] || ''}
                                                                onChange={(e) => handleChange(`heading${level}_lineHeight_custom`, e.target.value)}
                                                                placeholder="1.2"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Label>Transformación de texto</Label>
                                                        <Select
                                                            value={localSettings[`heading${level}_textTransform`] || 'default'}
                                                            onValueChange={(value) => handleChange(`heading${level}_textTransform`, value)}
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
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="buttons">
                                    <div className="space-y-6">
                                        {/* Botón Primario */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Botón Primario</h4>

                                            {/* Estado Normal */}
                                            <div className="pl-4 border-l-2 border-gray-200">
                                                <h5 className="text-sm font-medium mb-2">Estado Normal</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Color de Fondo</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.primary_button_background || ''}
                                                                onChange={(e) => handleChange('primary_button_background', e.target.value)}
                                                                placeholder="HSL: 209 100% 92%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.primary_button_background
                                                                        ? `hsl(${localSettings.primary_button_background})`
                                                                        : '#e1f0fe'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Texto</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.primary_button_text || ''}
                                                                onChange={(e) => handleChange('primary_button_text', e.target.value)}
                                                                placeholder="HSL: 0 0% 3.9%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.primary_button_text
                                                                        ? `hsl(${localSettings.primary_button_text})`
                                                                        : '#0a0a0a'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Borde</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.primary_button_border || ''}
                                                                onChange={(e) => handleChange('primary_button_border', e.target.value)}
                                                                placeholder="HSL: 209 100% 92%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.primary_button_border
                                                                        ? `hsl(${localSettings.primary_button_border})`
                                                                        : '#e1f0fe'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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

                                            {/* Estado Hover */}
                                            <div className="pl-4 border-l-2 border-gray-200">
                                                <h5 className="text-sm font-medium mb-2">Estado Hover</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Color de Fondo (Hover)</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.primary_button_hover_background || ''}
                                                                onChange={(e) => handleChange('primary_button_hover_background', e.target.value)}
                                                                placeholder="HSL: 209 100% 84%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.primary_button_hover_background
                                                                        ? `hsl(${localSettings.primary_button_hover_background})`
                                                                        : '#b3d7ff'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Texto (Hover)</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.primary_button_hover_text || ''}
                                                                onChange={(e) => handleChange('primary_button_hover_text', e.target.value)}
                                                                placeholder="HSL: 0 0% 3.9%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.primary_button_hover_text
                                                                        ? `hsl(${localSettings.primary_button_hover_text})`
                                                                        : '#0a0a0a'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botón Secundario */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Botón Secundario</h4>

                                            {/* Estado Normal */}
                                            <div className="pl-4 border-l-2 border-gray-200">
                                                <h5 className="text-sm font-medium mb-2">Estado Normal</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Color de Fondo</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.secondary_button_background || ''}
                                                                onChange={(e) => handleChange('secondary_button_background', e.target.value)}
                                                                placeholder="HSL: 0 0% 96.1%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.secondary_button_background
                                                                        ? `hsl(${localSettings.secondary_button_background})`
                                                                        : '#f5f5f5'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Texto</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.secondary_button_text || ''}
                                                                onChange={(e) => handleChange('secondary_button_text', e.target.value)}
                                                                placeholder="HSL: 0 0% 3.9%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.secondary_button_text
                                                                        ? `hsl(${localSettings.secondary_button_text})`
                                                                        : '#0a0a0a'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Borde</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.secondary_button_border || ''}
                                                                onChange={(e) => handleChange('secondary_button_border', e.target.value)}
                                                                placeholder="HSL: 0 0% 96.1%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.secondary_button_border
                                                                        ? `hsl(${localSettings.secondary_button_border})`
                                                                        : '#f5f5f5'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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

                                            {/* Estado Hover */}
                                            <div className="pl-4 border-l-2 border-gray-200">
                                                <h5 className="text-sm font-medium mb-2">Estado Hover</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Color de Fondo (Hover)</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.secondary_button_hover_background || ''}
                                                                onChange={(e) => handleChange('secondary_button_hover_background', e.target.value)}
                                                                placeholder="HSL: 0 0% 84.1%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.secondary_button_hover_background
                                                                        ? `hsl(${localSettings.secondary_button_hover_background})`
                                                                        : '#d6d6d6'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label>Color de Texto (Hover)</Label>
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                value={localSettings.secondary_button_hover_text || ''}
                                                                onChange={(e) => handleChange('secondary_button_hover_text', e.target.value)}
                                                                placeholder="HSL: 0 0% 3.9%"
                                                            />
                                                            <div
                                                                className="w-10 h-10 rounded border"
                                                                style={{
                                                                    backgroundColor: localSettings.secondary_button_hover_text
                                                                        ? `hsl(${localSettings.secondary_button_hover_text})`
                                                                        : '#0a0a0a'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
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