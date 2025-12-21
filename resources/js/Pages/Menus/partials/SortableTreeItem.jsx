import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline'; 
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import InputError from '@/Components/InputError';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

// Prefijo que usamos para identificar las URLs (será el único formato permitido)
const PAGE_PREFIX = '/'; 

export default function SortableTreeItem({
    id,
    item,
    depth,
    indentationWidth,
    onUpdate,
    onRemove,
    dynamicPages = [], // Asegúrate de que esto se reciba lleno desde el controlador
    itemErrors,
    isOverlay,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        marginLeft: !isOverlay ? `${depth * indentationWidth}px` : undefined, 
    };
    
    // Variables de estilo para las líneas conectoras (solución al ReferenceError)
    const lineThickness = '2px'; 
    const lineColor = '#D1D5DB'; // gray-300

    // 1. Lógica de renderizado: determinamos el slug actual
    const isInternalPage = item.url.startsWith(PAGE_PREFIX);
    const currentSlug = isInternalPage 
        ? item.url.replace(PAGE_PREFIX, '') 
        : '';
    
    // 2. Maneja la selección en el SELECT
    const handleSelectChange = (newSlug) => {
        // Al seleccionar, se guarda la URL con el prefijo
        onUpdate(id, 'url', PAGE_PREFIX + newSlug);
    };
    
    // 3. El componente de URL (SOLO SELECT)
    const UrlSelect = (
        <Select 
            // Si la URL actual no es válida (no tiene /page/ o está vacía), 
            // el valor del Select será nulo o el currentSlug (si existe una página con ese slug)
            value={currentSlug || ''} 
            onValueChange={handleSelectChange}
            disabled={isOverlay || dynamicPages.length === 0} // Deshabilitar si no hay páginas
            required // Añadir requerido si no se puede dejar vacío
        >
            <SelectTrigger className="h-9">
                {/* <DocumentTextIcon className='size-4 mr-2 text-blue-500'/>  */}
                <SelectValue placeholder="Seleccionar página dinámica (Obligatorio)" /> 
            </SelectTrigger>
            <SelectContent>
                {/* Mostramos las opciones de las páginas dinámicas */}
                {dynamicPages.length > 0 ? (
                    dynamicPages.map((page) => (
                        <SelectItem key={page.slug} value={page.slug}>
                            {page.title} (/{page.slug})
                        </SelectItem>
                    ))
                ) : (
                    // Mensaje si no hay páginas dinámicas
                    <div className="p-2 text-sm text-red-500">
                        No hay páginas dinámicas disponibles.
                    </div>
                )}
            </SelectContent>
        </Select>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative flex items-center mb-2 ${isDragging ? 'opacity-30' : 'opacity-100'} ${isOverlay ? 'shadow-xl rounded-md bg-white/90 dark:bg-gray-800/90 border-2 border-blue-500' : ''}`}
        >
             {/* Líneas Conectoras */}
            {!isOverlay && depth > 0 && (
                <>
                    <div 
                        className="absolute h-full border-l-2 dark:border-gray-600"
                        style={{ 
                            left: `-${indentationWidth / 2}px`, 
                            top: '-50%',
                            height: 'calc(100% + 8px)',
                            borderLeftColor: lineColor,
                        }} 
                    />
                    <div 
                        className="absolute w-[20px] h-0 border-t-2 dark:border-gray-600"
                        style={{ 
                            left: `-${indentationWidth / 2}px`, 
                            top: '50%',
                            marginTop: `-${lineThickness}`,
                            borderTopColor: lineColor,
                        }} 
                    />
                </>
            )}

            <div className={`flex-1 flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2 ${isOverlay ? 'cursor-grabbing' : ''}`}>
                
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-700 dark:text-gray-400">
                    <Bars3Icon className="size-5" />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Título */}
                    <div className='flex flex-col'>
                        <Input
                            className="h-9"
                            placeholder="Título"
                            value={item.title}
                            onPointerDown={(e) => e.stopPropagation()} 
                            onChange={(e) => onUpdate(id, 'title', e.target.value)}
                            disabled={isOverlay}
                            required
                        />
                         {itemErrors && itemErrors.title && <InputError message={itemErrors.title} className="text-xs" />}
                    </div>
                    {/* URL (SOLO SELECT) */}
                    <div className='flex flex-col relative'>
                         {UrlSelect} 
                         {itemErrors && itemErrors.url && <InputError message={itemErrors.url} className="text-xs" />}
                    </div>
                </div>

                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    disabled={isOverlay}
                >
                    <XMarkIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}