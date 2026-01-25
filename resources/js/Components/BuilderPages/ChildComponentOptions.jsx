import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { DivideCircleIcon, ImageIcon, LinkIcon, TextIcon, VideoIcon, PlusCircleIcon } from 'lucide-react';
import { ChatBubbleBottomCenterIcon, CubeIcon } from '@heroicons/react/24/outline';

// Definir todas las opciones posibles con sus propiedades
const ALL_COMPONENT_OPTIONS = [
    {
        type: 'text',
        label: 'Texto',
        icon: <TextIcon className="size-4" />,
        description: 'Agregar un bloque de texto'
    },
    {
        type: 'heading',
        label: 'Encabezado',
        icon: <TextIcon className="size-4" />,
        description: 'Agregar un título'
    },
    {
        type: 'image',
        label: 'Imagen',
        icon: <ImageIcon className="size-4" />,
        description: 'Agregar una imagen'
    },
    {
        type: 'button',
        label: 'Botón',
        icon: <ChatBubbleBottomCenterIcon className="size-4" />,
        description: 'Agregar un botón'
    },
    // {
    //     type: 'video',
    //     label: 'Video',
    //     icon: <VideoIcon className="size-4" />,
    //     description: 'Agregar un video'
    // },
    {
        type: 'link',
        label: 'Enlace',
        icon: <LinkIcon className="size-4" />,
        description: 'Agregar un enlace'
    },
    {
        type: 'marquee',
        label: 'Texto en Movimiento',
        icon: <TextIcon className="size-4" />,
        description: 'Agregar texto animado'
    },
    {
        type: 'divider',
        label: 'Divider (Línea)',
        icon: <DivideCircleIcon className="size-4" />,
        description: 'Agregar una línea divisoria'
    },
    {
        type: 'bentoFeature',
        label: 'Característica Bento',
        icon: <CubeIcon className="size-4" />,
        description: 'Agregar una nueva característica al bento'
    },
    {
        type: 'footerMenu',
        label: 'Menú Footer',
        icon: <CubeIcon className="size-4" />,
        description: 'Agregar un menú al footer'
    },
    {
        type: 'announcement',
        label: 'Anuncio',
        icon: <TextIcon className="size-4" />,
        description: 'Agregar un anuncio individual'
    }
];

// Definir qué componentes pueden tener qué tipos de hijos
const ALLOWED_CHILD_TYPES = {
    // Contenedor: permite casi todos los componentes
    container: ['text', 'heading', 'button', 'image', 'video', 'link', 'marquee', 'divider'],
    
    // Producto: permite componentes básicos pero no video
    product: ['text', 'heading', 'button', 'link'],
    
    // Carrusel: permite componentes básicos pero no video
    carousel: ['text', 'heading', 'button', 'link'],
    
    // Banner: permite componentes básicos incluyendo video
    banner: ['text', 'heading', 'button', 'link', 'image', 'marquee'],
    
    // Bento: solo permite bentoFeature
    bento: ['bentoFeature','text'],

    // AnnouncementBar: solo permite announcement
    announcementBar: ['announcement'],

    cart: ['cartItems', 'cartSummary', ],
    
    // Header y Footer: no permiten agregar hijos desde este menú
    header: [],
    footer: ['text', 'footerMenu'],

    image: ['link', 'button', 'text'],
    
    // ProductCard, CarouselCard, BentoFeature: no permiten agregar hijos
    productCard: [],
    carouselCard: [],
    bentoFeature: [],
    
    // Por defecto (si no está en la lista): permite todos los básicos
    default: ['text', 'heading', 'button', 'image', 'link', 'video', 'marquee', 'divider']
};

export default function ChildComponentOptions({ 
    parentId, 
    parentType,
    onAddChild,
    isExpanded 
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddChild = (type) => {
        onAddChild(parentId, type);
        setIsOpen(false);
    };

    if (!isExpanded) return null;

    // Obtener los tipos permitidos para este padre
    const allowedTypes = ALLOWED_CHILD_TYPES[parentType] || ALLOWED_CHILD_TYPES.default;
    
    // Filtrar las opciones basadas en los tipos permitidos
    const filteredOptions = ALL_COMPONENT_OPTIONS.filter(option => 
        allowedTypes.includes(option.type)
    );

    // Si no hay opciones permitidas, no mostrar el botón
    if (filteredOptions.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 mb-3 pl-2">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    >
                        <span className="flex items-center gap-2">
                            <PlusCircleIcon className="size-4" />
                            <span>Agregar bloque</span>
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                    className="w-64 max-h-80 overflow-y-auto"
                    align="start"
                >
                    {filteredOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.type}
                            onClick={() => handleAddChild(option.type)}
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                            <div className="text-gray-500">
                                {option.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                    {option.label}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {option.description}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}