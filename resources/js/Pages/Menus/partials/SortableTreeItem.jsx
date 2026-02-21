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
    dynamicPages = [],
    products = [],
    collections = [],
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

    const lineThickness = '2px';
    const lineColor = '#D1D5DB'; // gray-300

    // 1. Lógica de renderizado: determinamos el valor interno para el Select
    const getInternalValue = (url) => {
        if (!url) return '';
        if (url.includes('detalles-del-producto?product=')) {
            const slug = url.split('product=')[1];
            return `product:${slug}`;
        }
        // Para colecciones, usamos el patrón /tienda/slug
        // Pero primero verificamos si NO es simplemente la página de la tienda
        if (url.startsWith('/tienda/') && url !== '/tienda/') {
            const slug = url.replace('/tienda/', '');
            return `collection:${slug}`;
        }

        // Por defecto lo tratamos como página
        const slug = url.startsWith(PAGE_PREFIX) ? url.replace(PAGE_PREFIX, '') : url;
        // Verificamos si este slug existe en dynamicPages para estar seguros, si no, devolvemos tal cual
        return `page:${slug}`;
    };

    const currentValue = getInternalValue(item.url);

    // 2. Maneja la selección en el SELECT
    const handleValueChange = (combinedValue) => {
        const [type, slug] = combinedValue.split(':');

        let newUrl = '';
        if (type === 'product') {
            newUrl = `/detalles-del-producto?product=${slug}`;
        } else if (type === 'collection') {
            newUrl = `/tienda/${slug}`;
        } else {
            // type === 'page'
            newUrl = PAGE_PREFIX + slug;
        }

        // Preparamos objeto de cambios
        const changes = { url: newUrl };

        // Si el título está vacío, podemos sugerir el título del recurso seleccionado
        if (!item.title) {
            let suggestedTitle = '';
            if (type === 'product') {
                suggestedTitle = products.find(p => p.slug === slug)?.product_name || '';
            } else if (type === 'collection') {
                suggestedTitle = collections.find(c => c.slug === slug)?.title || '';
            } else {
                suggestedTitle = dynamicPages.find(p => p.slug === slug)?.title || '';
            }
            if (suggestedTitle) {
                changes.title = suggestedTitle;
            }
        }

        // Llamada única para actualizar múltiples campos y evitar race conditions
        onUpdate(id, changes);
    };

    // 3. El componente de URL (SELECT AGRUPADO)
    const UrlSelect = (
        <Select
            value={currentValue}
            onValueChange={handleValueChange}
            disabled={isOverlay}
            required
        >
            <SelectTrigger className="h-9">
                <SelectValue placeholder="Seleccionar destino (Obligatorio)" />
            </SelectTrigger>
            <SelectContent>
                {dynamicPages.length > 0 && (
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Páginas</div>
                )}
                {dynamicPages.map((page) => (
                    <SelectItem key={`page-${page.slug}`} value={`page:${page.slug}`}>
                        {page.title} (/{page.slug})
                    </SelectItem>
                ))}

                {products.length > 0 && (
                    <div className="mt-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase border-t pt-2">Productos</div>
                )}
                {products.map((product) => (
                    <SelectItem key={`prod-${product.slug}`} value={`product:${product.slug}`}>
                        {product.product_name}
                    </SelectItem>
                ))}

                {collections.length > 0 && (
                    <div className="mt-2 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase border-t pt-2">Colecciones</div>
                )}
                {collections.map((collection) => (
                    <SelectItem key={`coll-${collection.slug}`} value={`collection:${collection.slug}`}>
                        {collection.title}
                    </SelectItem>
                ))}

                {dynamicPages.length === 0 && products.length === 0 && collections.length === 0 && (
                    <div className="p-2 text-sm text-red-500">
                        No hay destinos disponibles.
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