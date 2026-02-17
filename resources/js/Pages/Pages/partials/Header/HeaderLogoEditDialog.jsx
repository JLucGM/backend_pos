import React, { useEffect, useCallback } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { useDebounce } from '@/hooks/Builder/useDebounce';
import { resolveStyleValue } from '@/utils/themeUtils';

const HeaderLogoEditDialog = ({
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    appliedTheme,
    isLiveEdit = true,
    companyLogo
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

    const updateStyle = useCallback((key, value) => {
        setEditStyles(prev => ({ ...prev, [key]: value }));
    }, [setEditStyles]);

    const objectFitOptions = [
        { value: 'contain', label: 'Contener (mantener proporción)' },
        { value: 'cover', label: 'Cubrir (rellena el contenedor)' },
        { value: 'fill', label: 'Llenar (distorsiona proporción)' },
        { value: 'none', label: 'Ninguno (tamaño original)' },
        { value: 'scale-down', label: 'Reducir escala' },
    ];

    const handleUseCompanyLogoChange = useCallback((useCompany) => {
        if (useCompany) {
            setEditContent(null); // null indica usar logo de compañía
        } else {
            setEditContent('Logo'); // Valor por defecto
        }
    }, [setEditContent]);

    const isUsingCompanyLogo = editContent === null || editContent === 'Logo';

    return (
        <div className="space-y-6">
            {/* Sección: Tipo de Logo */}
            {companyLogo && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium">Logo de la compañía</h4>
                            <p className="text-sm text-gray-500">Usa el logo configurado en los ajustes</p>
                        </div>
                        <Switch
                            checked={isUsingCompanyLogo}
                            onCheckedChange={handleUseCompanyLogoChange}
                        />
                    </div>

                    {isUsingCompanyLogo && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <img
                                src={companyLogo}
                                alt="Logo de la compañía"
                                className="max-h-24 mx-auto"
                            />
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Este logo se mostrará automáticamente
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Sección: Dimensiones del Logo */}
            <div className="space-y-4">
                <h4 className="font-medium mb-3">Dimensiones del Logo</h4>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="width">Ancho</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="width"
                                type="number"
                                value={parseInt(editStyles.width) || ''}
                                onChange={(e) => updateStyle('width', e.target.value)}
                                placeholder="Auto"
                            />
                            <Select
                                value={editStyles.widthUnit || 'px'}
                                onValueChange={(value) => updateStyle('widthUnit', value)}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="px">px</SelectItem>
                                    <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Dejar vacío para automático</p>
                    </div>

                    <div>
                        <Label htmlFor="height">Alto</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="height"
                                type="number"
                                value={parseInt(editStyles.height) || ''}
                                onChange={(e) => updateStyle('height', e.target.value)}
                                placeholder="Auto"
                            />
                            <Select
                                value={editStyles.heightUnit || 'px'}
                                onValueChange={(value) => updateStyle('heightUnit', value)}
                            >
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="px">px</SelectItem>
                                    <SelectItem value="%">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Dejar vacío para automático</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="maxWidth">Ancho máximo</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="maxWidth"
                                type="number"
                                value={parseInt(editStyles.maxWidth) || ''}
                                onChange={(e) => updateStyle('maxWidth', e.target.value)}
                                placeholder="Sin límite"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="maxHeight">Alto máximo</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="maxHeight"
                                type="number"
                                value={parseInt(editStyles.maxHeight) || ''}
                                onChange={(e) => updateStyle('maxHeight', e.target.value)}
                                placeholder="Sin límite"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="objectFit">Ajuste de imagen</Label>
                    <Select
                        value={editStyles.objectFit || 'contain'}
                        onValueChange={(value) => updateStyle('objectFit', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ajuste" />
                        </SelectTrigger>
                        <SelectContent>
                            {objectFitOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        Controla cómo se ajusta la imagen dentro del contenedor
                    </p>
                </div>
            </div>

            {/* Sección: Padding */}
            <div className="space-y-4">
                <h4 className="font-medium mb-3">Padding del Logo</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="paddingTop"
                                type="number"
                                value={parseInt(editStyles.paddingTop) || 0}
                                onChange={(e) => updateStyle('paddingTop', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="paddingRight"
                                type="number"
                                value={parseInt(editStyles.paddingRight) || 0}
                                onChange={(e) => updateStyle('paddingRight', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="paddingBottom"
                                type="number"
                                value={parseInt(editStyles.paddingBottom) || 0}
                                onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="paddingLeft"
                                type="number"
                                value={parseInt(editStyles.paddingLeft) || 0}
                                onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(HeaderLogoEditDialog);