// components/Builder/dialogs/ButtonEditDialog.jsx
import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

const ButtonEditDialog = ({ editContent, setEditContent, editStyles, setEditStyles }) => (
    <div className="space-y-4">
        {/* Selector de tipo de botón */}
        <Label htmlFor="buttonType">Tipo de Botón</Label>
        <Select 
            value={editStyles.buttonType || 'primary'} 
            onValueChange={(value) => setEditStyles({ ...editStyles, buttonType: value })}
        >
            <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de botón" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="primary">Primario (Usa estilos del tema)</SelectItem>
                <SelectItem value="secondary">Secundario (Usa estilos del tema)</SelectItem>
                <SelectItem value="custom">Personalizado (Ignora estilos del tema)</SelectItem>
            </SelectContent>
        </Select>

        <Label htmlFor="content">Contenido</Label>
        <textarea
            id="content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-20 p-2 border rounded"
        />

        {/* Solo mostrar opciones de personalización si el tipo es "custom" */}
        {editStyles.buttonType === 'custom' && (
            <>
                {/* Layout */}
                <Label htmlFor="layout">Layout</Label>
                <Select value={editStyles.layout || 'fit'} onValueChange={(value) => setEditStyles({ ...editStyles, layout: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fit">Fit (Ancho natural)</SelectItem>
                        <SelectItem value="fill">Fill (Ancho completo)</SelectItem>
                    </SelectContent>
                </Select>

                {/* Padding Individual */}
                <Label>Padding (px)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="paddingTop">Arriba</Label>
                        <Input
                            id="paddingTop"
                            type="number"
                            value={parseInt(editStyles.paddingTop) || 10}
                            onChange={(e) => setEditStyles({ ...editStyles, paddingTop: `${e.target.value}px` })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingRight">Derecha</Label>
                        <Input
                            id="paddingRight"
                            type="number"
                            value={parseInt(editStyles.paddingRight) || 10}
                            onChange={(e) => setEditStyles({ ...editStyles, paddingRight: `${e.target.value}px` })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingBottom">Abajo</Label>
                        <Input
                            id="paddingBottom"
                            type="number"
                            value={parseInt(editStyles.paddingBottom) || 10}
                            onChange={(e) => setEditStyles({ ...editStyles, paddingBottom: `${e.target.value}px` })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="paddingLeft">Izquierda</Label>
                        <Input
                            id="paddingLeft"
                            type="number"
                            value={parseInt(editStyles.paddingLeft) || 10}
                            onChange={(e) => setEditStyles({ ...editStyles, paddingLeft: `${e.target.value}px` })}
                        />
                    </div>
                </div>

                {/* Border-Radius */}
                <Label htmlFor="borderRadius">Radio de Borde (px)</Label>
                <Input
                    id="borderRadius"
                    type="number"
                    value={parseInt(editStyles.borderRadius) || 4}
                    onChange={(e) => setEditStyles({ ...editStyles, borderRadius: `${e.target.value}px` })}
                />

                {/* Color de Texto */}
                <Label htmlFor="color">Color de Texto</Label>
                <Input
                    id="color"
                    type="color"
                    value={editStyles.color || '#ffffff'}
                    onChange={(e) => setEditStyles({ ...editStyles, color: e.target.value })}
                />

                {/* Color de Fondo */}
                <Label htmlFor="bgColor">Color de Fondo</Label>
                <Input
                    id="bgColor"
                    type="color"
                    value={editStyles.backgroundColor || '#007bff'}
                    onChange={(e) => setEditStyles({ ...editStyles, backgroundColor: e.target.value })}
                />

                {/* FontSize */}
                <Label htmlFor="fontSize">Tamaño de fuente</Label>
                <Select value={editStyles.fontSize || '16px'} onValueChange={(value) => setEditStyles({ ...editStyles, fontSize: value })}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="20px">20px</SelectItem>
                        <SelectItem value="24px">24px</SelectItem>
                    </SelectContent>
                </Select>

                {/* Text Transform */}
                <Label htmlFor="textTransform">Transformación de Texto</Label>
                <Select 
                    value={editStyles.textTransform || 'none'} 
                    onValueChange={(value) => setEditStyles({ ...editStyles, textTransform: value })}
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
            </>
        )}
        
        {/* Si es primary o secondary, mostrar solo las opciones que pueden sobrescribir */}
        {(editStyles.buttonType === 'primary' || editStyles.buttonType === 'secondary') && (
            <div className="space-y-4">                
                {/* Opciones de sobrescritura específicas */}
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="customBorderRadius">Radio de Borde Personalizado</Label>
                        <Input
                            id="customBorderRadius"
                            placeholder="Ej: 8px"
                            value={editStyles.customBorderRadius || ''}
                            onChange={(e) => setEditStyles({ ...editStyles, customBorderRadius: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="customFontSize">Tamaño de Fuente Personalizado</Label>
                        <Input
                            id="customFontSize"
                            placeholder="Ej: 18px"
                            value={editStyles.customFontSize || ''}
                            onChange={(e) => setEditStyles({ ...editStyles, customFontSize: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default ButtonEditDialog;