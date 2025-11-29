// components/BuilderPages/Builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { X, Undo, Redo, Monitor, Tablet, ArrowLeftToLine, Eye, Save, Plus, GripVertical } from 'lucide-react';
import ComponentTree from '@/Components/BuilderPages/ComponentTree';
import Canvas from '@/Components/BuilderPages/Canvas';
import CanvasItem from '@/Components/BuilderPages/CanvasItem';
import { addToHistory } from '@/utils/Builder/builderUtils';
import { ScrollArea } from '@/Components/ui/scroll-area';
import TextEditDialog from './partials/TextEditDialog';
import ButtonEditDialog from './partials/ButtonEditDialog';
import HeadingEditDialog from './partials/HeadingEditDialog';
import ImageEditDialog from './partials/ImageEditDialog';
import VideoEditDialog from './partials/VideoEditDialog';
import LinkEditDialog from './partials/LinkEditDialog';
import ProductEditDialog from './partials/ProductEditDialog';
import CarouselEditDialog from './partials/CarouselEditDialog';
import ContainerEditDialog from './partials/ContainerEditDialog';
import BannerEditDialog from './partials/BannerEditDialog';
import BannerTitleEditDialog from './partials/BannerTitleEditDialog';
import BannerTextEditDialog from './partials/BannerTextEditDialog';
import ProductTitleEditDialog from './partials/ProductTitleEditDialog';
import ProductCardEditDialog from './partials/ProductCardEditDialog';
import ProductImageEditDialog from './partials/ProductImageEditDialog';
import ProductNameEditDialog from './partials/ProductNameEditDialog';
import ProductPriceEditDialog from './partials/ProductPriceEditDialog';
import CarouselTitleEditDialog from './partials/Carousel/CarouselTitleEditDialog';
import CarouselCardEditDialog from './partials/Carousel/CarouselCardEditDialog';
import CarouselImageEditDialog from './partials/Carousel/CarouselImageEditDialog';
import CarouselNameEditDialog from './partials/Carousel/CarouselNameEditDialog';
import CarouselPriceEditDialog from './partials/Carousel/CarouselPriceEditDialog';
import BentoEditDialog from './partials/Bento/BentoEditDialog';
import BentoTitleEditDialog from './partials/Bento/BentoTitleEditDialog';
import BentoFeatureEditDialog from './partials/Bento/BentoFeatureEditDialog';
import BentoFeatureTitleEditDialog from './partials/Bento/BentoFeatureTitleEditDialog';
import BentoFeatureTextEditDialog from './partials/Bento/BentoFeatureTextEditDialog';
import MarqueeEditDialog from './partials/Marquee/MarqueeEditDialog';
import DividerEditDialog from './partials/Divider/DividerEditDialog';

export default function Builder({ page, products }) {
    const [components, setComponents] = useState([]);
    const [editingComponent, setEditingComponent] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editStyles, setEditStyles] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [canvasWidth, setCanvasWidth] = useState('100%');
    const autoSaveRef = useRef(null);
    const hasLoaded = useRef(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('');

    // Estados para el drag & drop visual
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [dropPosition, setDropPosition] = useState(null);

    // Estado para el hover sincronizado
    const [hoveredComponentId, setHoveredComponentId] = useState(null);

    const themeSettings = page.theme?.settings || {};

    // Efectos
    useEffect(() => {
        if (page.layout && !hasLoaded.current) {
            try {
                const initialComponents = JSON.parse(page.layout);
                setComponents(initialComponents);
                addToHistory(initialComponents, history, setHistory, historyIndex, setHistoryIndex);
            } catch (error) {
                console.error('Error parsing layout:', error);
            }
            hasLoaded.current = true;
        } else if (!page.layout && !hasLoaded.current) {
            hasLoaded.current = true;
        }
    }, [page.layout]);

    useEffect(() => {
        if (hasUnsavedChanges) {
            autoSaveRef.current = setTimeout(() => {
                saveLayout(true);
            }, 30000);
        }
        return () => clearTimeout(autoSaveRef.current);
    }, [components, hasUnsavedChanges]);

    // Funciones principales
    const handleEditComponent = (comp) => {
        setEditingComponent(comp);
        setEditContent(comp.content);
        setEditStyles(comp.styles || {});
    };

    const saveEdit = () => {
        if (editingComponent) {
            setComponents((prev) => {
                const updateComponentInTree = (components, targetId, newData) => {
                    return components.map(component => {
                        if (component.id === targetId) {
                            return {
                                ...component,
                                content: newData.content,
                                styles: newData.styles
                            };
                        }

                        if (component.type === 'container' && component.content) {
                            return {
                                ...component,
                                content: updateComponentInTree(component.content, targetId, newData)
                            };
                        }

                        // Buscar en divider (aunque no tiene hijos, por consistencia)
if (component.type === 'divider') {
    // No necesita procesamiento especial ya que no tiene hijos
    return component;
}

                        // Actualizar para banners con hijos
                        if (component.type === 'carousel' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Actualizar para productCard con hijos
                        if (component.type === 'carouselCard' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Actualizar para banners con hijos
                        if (component.type === 'banner' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Actualizar para product con hijos
                        if (component.type === 'product' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Actualizar para productCard con hijos
                        if (component.type === 'productCard' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Buscar en bento con hijos
                        if (component.type === 'bento' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Buscar en bentoFeature con hijos
                        if (component.type === 'bentoFeature' && component.content && component.content.children) {
                            const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updatedChildren
                                }
                            };
                        }

                        // Buscar en bentoFeatureTitle con hijos
                        // if (component.type === 'bentoFeatureTitle' && component.content && component.content.children) {
                        //     const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                        //     return {
                        //         ...component,
                        //         content: {
                        //             ...component.content,
                        //             children: updatedChildren
                        //         }
                        //     };
                        // }

                        // // Buscar en bentoFeatureText con hijos
                        // if (component.type === 'bentoFeatureText' && component.content && component.content.children) {
                        //     const updatedChildren = updateComponentInTree(component.content.children, targetId, newData);
                        //     return {
                        //         ...component,
                        //         content: {
                        //             ...component.content,
                        //             children: updatedChildren
                        //         }
                        //     };
                        // }

                        return component;
                    });
                };

                const newData = {
                    content: editContent,
                    styles: editStyles
                };

                const newComponents = updateComponentInTree(prev, editingComponent.id, newData);
                addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                setHasUnsavedChanges(true);
                return newComponents;
            });

            setEditingComponent(null);
            setEditContent('');
            setEditStyles({});

            toast.success("Cambios guardados correctamente");
        }
    };

    const cancelEdit = () => {
        setEditingComponent(null);
        setEditContent('');
        setEditStyles({});
    };

    const deleteComponent = (id) => {
        const removeFromTree = (items, targetId) => {
            return items.filter(item => {
                if (item.id === targetId) {
                    return false;
                }
                if (item.type === 'container' && item.content) {
                    item.content = removeFromTree(item.content, targetId);
                }
                // Eliminar de banners con hijos
                if (item.type === 'banner' && item.content && item.content.children) {
                    item.content.children = removeFromTree(item.content.children, targetId);
                }
                // Eliminar de product con hijos
                if (item.type === 'product' && item.content && item.content.children) {
                    item.content.children = removeFromTree(item.content.children, targetId);
                }
                // Eliminar de productCard con hijos
                if (item.type === 'productCard' && item.content && item.content.children) {
                    item.content.children = removeFromTree(item.content.children, targetId);
                }
                // Eliminar de bento con hijos
                if (item.type === 'bento' && item.content && item.content.children) {
                    item.content.children = removeFromTree(item.content.children, targetId);
                }

                // Eliminar de bentoFeature con hijos
                if (item.type === 'bentoFeature' && item.content && item.content.children) {
                    item.content.children = removeFromTree(item.content.children, targetId);
                }
                return true;
            });
        };

        setComponents((prev) => {
            const newComponents = removeFromTree(prev, id);
            addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
            setHasUnsavedChanges(true);
            return newComponents;
        });
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setComponents(history[historyIndex - 1]);
            setHasUnsavedChanges(true);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setComponents(history[historyIndex + 1]);
            setHasUnsavedChanges(true);
        }
    };

    const saveLayout = (isAuto = false) => {
        router.post(route('pages.updateLayout', page), {
            layout: JSON.stringify(components),
        }, {
            onSuccess: () => {
                setHasUnsavedChanges(false);
                setHistory([JSON.parse(JSON.stringify(components))]);
                setHistoryIndex(0);
                if (!isAuto) {
                    toast("Layout actualizado con éxito.");
                } else {
                    toast("Layout guardado automáticamente.");
                }
            },
            onError: (errors) => {
                console.error('Error saving layout:', errors);
                toast.error("Error al actualizar el layout.");
            }
        });
    };

    const handleAddComponent = () => {
        if (selectedType) {
            let content = 'Nuevo ' + selectedType;
            if (selectedType === 'video') content = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            if (selectedType === 'link') content = 'https://example.com';
            if (selectedType === 'image') content = 'https://picsum.photos/150';
            if (selectedType === 'container') content = [];
            if (selectedType === 'divider') {
    content = ''; // El divider no necesita contenido de texto
}
            if (selectedType === 'marquee') {
    content = '¡Texto en movimiento! Personaliza este texto.';
}
            if (selectedType === 'carousel') {
                const carouselId = Date.now();
                const titleId = carouselId + 1;
                const cardId = carouselId + 2;
                const imageId = carouselId + 3;
                const nameId = carouselId + 4;
                const priceId = carouselId + 5;

                content = {
                    // Configuración del carrusel
                    limit: 5,
                    slidesToShow: 3,
                    gapX: '10px',
                    gapY: '10px',
                    backgroundColor: '#ffffff',

                    // Los hijos como componentes independientes - AQUÍ ESTÁ LA CLAVE
                    children: [
                        {
                            id: titleId,
                            type: 'carouselTitle',
                            content: 'Productos en Carrusel',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: '#000000',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            id: cardId,
                            type: 'carouselCard',
                            content: { // Asegúrate de que content es un objeto
                                // Configuración de la carta
                                cardBorder: 'none',
                                cardBorderThickness: '1px',
                                cardBorderOpacity: '1',
                                cardBorderRadius: '0px',
                                cardPaddingTop: '10px',
                                cardPaddingRight: '10px',
                                cardPaddingBottom: '10px',
                                cardPaddingLeft: '10px',
                                imageBorder: 'none',
                                imageBorderThickness: '1px',
                                imageBorderOpacity: '1',
                                imageBorderRadius: '0px',
                                // Los hijos de la carta
                                children: [
                                    {
                                        id: imageId,
                                        type: 'carouselImage',
                                        content: '',
                                        styles: {
                                            aspectRatio: 'square',
                                            imageBorder: 'none',
                                            imageBorderThickness: '1px',
                                            imageBorderOpacity: '1',
                                            imageBorderRadius: '0px'
                                        }
                                    },
                                    {
                                        id: nameId,
                                        type: 'carouselName',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#000000',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: priceId,
                                        type: 'carouselPrice',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#666666',
                                            fontSize: '14px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        }
                    ]
                };
            }

            // NUEVA ESTRUCTURA PARA PRODUCT
            // En la función handleAddComponent de Builder.jsx, en la parte de product
            if (selectedType === 'product') {
                const productId = Date.now();
                const titleId = productId + 1;
                const cardId = productId + 2;
                const imageId = productId + 3;
                const nameId = productId + 4;
                const priceId = productId + 5;

                content = {
                    // Configuración del grid
                    columns: 3,
                    gapX: '10px',
                    gapY: '10px',
                    backgroundColor: '#ffffff',
                    limit: 8,

                    // Los hijos como componentes independientes
                    children: [
                        {
                            id: titleId,
                            type: 'productTitle',
                            content: 'Productos Destacados',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: '#000000',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            id: cardId,
                            type: 'productCard',
                            content: {
                                // Configuración de la carta
                                cardBorder: 'none',
                                cardBorderThickness: '1px',
                                cardBorderOpacity: '1',
                                cardBorderRadius: '0px',
                                cardPaddingTop: '0px',
                                cardPaddingRight: '0px',
                                cardPaddingBottom: '0px',
                                cardPaddingLeft: '0px',
                                // Los hijos de la carta
                                children: [
                                    {
                                        id: imageId,
                                        type: 'productImage',
                                        content: '',
                                        styles: {
                                            aspectRatio: 'square', // Agregar aspect ratio por defecto
                                            imageBorder: 'none',
                                            imageBorderThickness: '1px',
                                            imageBorderOpacity: '1',
                                            imageBorderRadius: '0px'
                                        }
                                    },
                                    {
                                        id: nameId,
                                        type: 'productName',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#000000',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: priceId,
                                        type: 'productPrice',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#666666',
                                            fontSize: '14px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        }
                    ]
                };
            }

            // NUEVA ESTRUCTURA PARA BANNER
            if (selectedType === 'banner') {
                const bannerId = Date.now();
                const titleId = bannerId + 1;
                const textId = bannerId + 2;

                content = {
                    // Configuración del contenedor principal
                    containerHeight: '400px',
                    containerWidth: '100%',
                    marginTop: '0px',
                    marginRight: '0px',
                    marginBottom: '0px',
                    marginLeft: '0px',
                    paddingTop: '20px',
                    paddingRight: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '20px',
                    backgroundColor: '#ffffff',
                    backgroundImage: null,
                    backgroundVideo: null,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    containerVerticalPosition: 'center',
                    containerHorizontalPosition: 'center',
                    contentDirection: 'vertical',

                    // Los hijos se almacenan como componentes independientes
                    children: [
                        {
                            id: titleId,
                            type: 'bannerTitle',
                            content: 'Título del Banner',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                background: 'transparent',
                                backgroundOpacity: '1',
                                borderRadius: '0px',
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                color: '#000000',
                                fontSize: '32px',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            id: textId,
                            type: 'bannerText',
                            content: 'Texto descriptivo del banner',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                background: 'transparent',
                                backgroundOpacity: '1',
                                borderRadius: '0px',
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                color: '#000000',
                                fontSize: '16px',
                                fontWeight: 'normal'
                            }
                        }
                    ]
                };
            }

            // NUEVA ESTRUCTURA PARA BENTO
            if (selectedType === 'bento') {
                const bentoId = Date.now();
                const titleId = bentoId + 1;
                const feature1Id = bentoId + 2;
                const feature1TitleId = bentoId + 3;
                const feature1TextId = bentoId + 4;
                const feature2Id = bentoId + 5;
                const feature2TitleId = bentoId + 6;
                const feature2TextId = bentoId + 7;
                const feature3Id = bentoId + 8;
                const feature3TitleId = bentoId + 9;
                const feature3TextId = bentoId + 10;
                const feature4Id = bentoId + 11;
                const feature4TitleId = bentoId + 12;
                const feature4TextId = bentoId + 13;

                content = {
                    // Configuración del contenedor principal
                    gridColumns: 2,
                    gridGap: '20px',
                    backgroundColor: '#ffffff',
                    containerBorderRadius: '0px',
                    containerBorder: 'none',
                    containerBorderThickness: '1px',
                    containerBorderColor: '#e5e7eb',

                    // Los hijos como componentes independientes
                    children: [
                        {
                            id: titleId,
                            type: 'bentoTitle',
                            content: 'Características Principales',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: '#000000',
                                fontSize: '32px',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            id: feature1Id,
                            type: 'bentoFeature',
                            content: {
                                // Configuración de la carta de característica
                                backgroundColor: '#f8fafc',
                                backgroundImage: null,
                                border: 'none',
                                borderThickness: '1px',
                                borderColor: '#e5e7eb',
                                borderRadius: '12px',
                                padding: '24px',
                                opacity: 1,
                                // Los hijos de la característica
                                children: [
                                    {
                                        id: feature1TitleId,
                                        type: 'bentoFeatureTitle',
                                        content: 'Característica 1',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#1f2937',
                                            fontSize: '20px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: feature1TextId,
                                        type: 'bentoFeatureText',
                                        content: 'Descripción de la característica 1.',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#6b7280',
                                            fontSize: '16px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        },
                        {
                            id: feature2Id,
                            type: 'bentoFeature',
                            content: {
                                backgroundColor: '#f8fafc',
                                backgroundImage: null,
                                border: 'none',
                                borderThickness: '1px',
                                borderColor: '#e5e7eb',
                                borderRadius: '12px',
                                padding: '24px',
                                opacity: 1,
                                children: [
                                    {
                                        id: feature2TitleId,
                                        type: 'bentoFeatureTitle',
                                        content: 'Característica 2',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#1f2937',
                                            fontSize: '20px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: feature2TextId,
                                        type: 'bentoFeatureText',
                                        content: 'Descripción de la característica 2.',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#6b7280',
                                            fontSize: '16px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        },
                        {
                            id: feature3Id,
                            type: 'bentoFeature',
                            content: {
                                backgroundColor: '#f8fafc',
                                backgroundImage: null,
                                border: 'none',
                                borderThickness: '1px',
                                borderColor: '#e5e7eb',
                                borderRadius: '12px',
                                padding: '24px',
                                opacity: 1,
                                children: [
                                    {
                                        id: feature3TitleId,
                                        type: 'bentoFeatureTitle',
                                        content: 'Característica 3',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#1f2937',
                                            fontSize: '20px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: feature3TextId,
                                        type: 'bentoFeatureText',
                                        content: 'Descripción de la característica 3.',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#6b7280',
                                            fontSize: '16px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        },
                        {
                            id: feature4Id,
                            type: 'bentoFeature',
                            content: {
                                backgroundColor: '#f8fafc',
                                backgroundImage: null,
                                border: 'none',
                                borderThickness: '1px',
                                borderColor: '#e5e7eb',
                                borderRadius: '12px',
                                padding: '24px',
                                opacity: 1,
                                children: [
                                    {
                                        id: feature4TitleId,
                                        type: 'bentoFeatureTitle',
                                        content: 'Característica 4',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#1f2937',
                                            fontSize: '20px',
                                            fontWeight: '600'
                                        }
                                    },
                                    {
                                        id: feature4TextId,
                                        type: 'bentoFeatureText',
                                        content: 'Descripción de la característica 4.',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: '#6b7280',
                                            fontSize: '16px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        }
                    ]
                };
            }

            const newItem = {
                id: selectedType === 'banner' || selectedType === 'product' ? Date.now() : Date.now(),
                type: selectedType,
                content,
                styles: {}
            };

            setComponents((prev) => {
                const newComponents = [...prev, newItem];
                addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                setHasUnsavedChanges(true);
                return newComponents;
            });
            setIsAddDialogOpen(false);
            setSelectedType('');
        }
    };

    // Función para actualizar componentes desde el árbol
    const handleComponentsUpdate = (newComponents) => {
        setComponents(newComponents);
        addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
        setHasUnsavedChanges(true);
    };

    // Funciones para drag & drop (mantener igual)
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        setHoveredComponentId(null);
        setDropPosition(null);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        setOverId(over?.id || null);

        if (!over) {
            setDropPosition(null);
            return;
        }

        requestAnimationFrame(() => {
            if (over.id === 'root-area') {
                setDropPosition({ id: 'root-area', position: 'inside' });
                return;
            }

            const overElement = document.getElementById(`component-${over.id}`);
            if (overElement) {
                const rect = overElement.getBoundingClientRect();
                const cursorY = event.activatorEvent.clientY;

                const overTop = rect.top;
                const overHeight = rect.height;

                const relativeY = cursorY - overTop;
                const threshold = overHeight / 3;

                let position;
                if (relativeY < threshold) {
                    position = 'top';
                } else if (relativeY > overHeight - threshold) {
                    position = 'bottom';
                } else {
                    position = 'inside';
                }

                setDropPosition(prev => {
                    if (prev && prev.id === over.id && prev.position === position) {
                        return prev;
                    }
                    return { id: over.id, position };
                });
            } else {
                setDropPosition(null);
            }
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveId(null);
        setOverId(null);
        setDropPosition(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (overId === 'root-area') {
            setComponents((prev) => {
                const removeComponent = (items, targetId) => {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].id === targetId) {
                            const [removed] = items.splice(i, 1);
                            return removed;
                        }
                        if (items[i].type === 'container' && items[i].content) {
                            const removed = removeComponent(items[i].content, targetId);
                            if (removed) {
                                return removed;
                            }
                        }
                        // Buscar en banners con hijos
                        if (items[i].type === 'banner' && items[i].content && items[i].content.children) {
                            const removed = removeComponent(items[i].content.children, targetId);
                            if (removed) {
                                return removed;
                            }
                        }
                        // Buscar en product con hijos
                        if (items[i].type === 'product' && items[i].content && items[i].content.children) {
                            const removed = removeComponent(items[i].content.children, targetId);
                            if (removed) {
                                return removed;
                            }
                        }
                        // Buscar en productCard con hijos
                        if (items[i].type === 'productCard' && items[i].content && items[i].content.children) {
                            const removed = removeComponent(items[i].content.children, targetId);
                            if (removed) {
                                return removed;
                            }
                        }
                        // Buscar en bento con hijos
                        if (items[i].type === 'bento' && items[i].content && items[i].content.children) {
                            const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
                            if (found) return found;
                        }

                        // Buscar en bentoFeature con hijos
                        if (items[i].type === 'bentoFeature' && items[i].content && items[i].content.children) {
                            const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const newComponents = JSON.parse(JSON.stringify(prev));
                const removedComponent = removeComponent(newComponents, activeId);
                if (removedComponent) {
                    newComponents.push(removedComponent);
                }
                handleComponentsUpdate(newComponents);
                return newComponents;
            });
            return;
        }

        const findComponentInfo = (items, id, parent = null, path = []) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return {
                        component: items[i],
                        index: i,
                        parent,
                        parentArray: items,
                        path: [...path, i]
                    };
                }
                if (items[i].type === 'container' && items[i].content) {
                    const found = findComponentInfo(items[i].content, id, items[i], [...path, i]);
                    if (found) return found;
                }
                // Buscar en banners con hijos
                if (items[i].type === 'banner' && items[i].content && items[i].content.children) {
                    const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
                    if (found) return found;
                }
                // Buscar en product con hijos
                if (items[i].type === 'product' && items[i].content && items[i].content.children) {
                    const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
                    if (found) return found;
                }
                // Buscar en productCard con hijos
                if (items[i].type === 'productCard' && items[i].content && items[i].content.children) {
                    const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
                    if (found) return found;
                }
                // Buscar en bento con hijos
if (items[i].type === 'bento' && items[i].content && items[i].content.children) {
    const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
    if (found) return found;
}

// Buscar en bentoFeature con hijos
if (items[i].type === 'bentoFeature' && items[i].content && items[i].content.children) {
    const found = findComponentInfo(items[i].content.children, id, items[i], [...path, i]);
    if (found) return found;
}
            }
            return null;
        };

        const activeInfo = findComponentInfo(components, activeId);
        const overInfo = findComponentInfo(components, overId);

        if (!activeInfo || !overInfo) {
            console.error('No se encontró información del componente activo o destino');
            return;
        }

        const isDroppingInSelfOrChildren = (containerId, targetId) => {
            if (containerId === targetId) return true;

            const container = findComponentInfo(components, containerId);
            if (container && container.component.type === 'container' && container.component.content) {
                for (const child of container.component.content) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            // Verificar banners con hijos
            if (container && container.component.type === 'banner' && container.component.content && container.component.content.children) {
                for (const child of container.component.content.children) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            // Verificar product con hijos
            if (container && container.component.type === 'product' && container.component.content && container.component.content.children) {
                for (const child of container.component.content.children) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            // Verificar productCard con hijos
            if (container && container.component.type === 'productCard' && container.component.content && container.component.content.children) {
                for (const child of container.component.content.children) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            // Verificar bento con hijos
            if (container && container.component.type === 'bento' && container.component.content && container.component.content.children) {
                for (const child of container.component.content.children) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            // Verificar bentoFeature con hijos
            if (container && container.component.type === 'bentoFeature' && container.component.content && container.component.content.children) {
                for (const child of container.component.content.children) {
                    if (child.id === targetId || isDroppingInSelfOrChildren(child.id, targetId)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (activeInfo.component.type === 'container' &&
            isDroppingInSelfOrChildren(activeId, overId)) {
            console.log("No puedes soltar un contenedor dentro de sí mismo o sus hijos");
            toast.error("No puedes soltar un contenedor dentro de sí mismo");
            return;
        }

        const newComponents = JSON.parse(JSON.stringify(components));

        const findParentArrayByPath = (items, path) => {
            let current = items;
            for (let i = 0; i < path.length - 1; i++) {
                const index = path[i];
                if (current[index] && current[index].type === 'container' && current[index].content) {
                    current = current[index].content;
                } else if (current[index] && current[index].type === 'banner' && current[index].content && current[index].content.children) {
                    current = current[index].content.children;
                } else if (current[index] && current[index].type === 'product' && current[index].content && current[index].content.children) {
                    current = current[index].content.children;
                } else if (current[index] && current[index].type === 'productCard' && current[index].content && current[index].content.children) {
                    current = current[index].content.children;
                } else {
                    return null;
                }
            }
            return current;
        };

        const activePath = activeInfo.path;
        const overPath = overInfo.path;

        const activeParentArray = findParentArrayByPath(newComponents, activePath);
        const overParentArray = findParentArrayByPath(newComponents, overPath);

        if (!activeParentArray || !overParentArray) {
            console.error('No se pudo encontrar los arrays padre');
            return;
        }

        const activeIndex = activePath[activePath.length - 1];
        const overIndex = overPath[overPath.length - 1];

        if (activeIndex < 0 || activeIndex >= activeParentArray.length ||
            overIndex < 0 || overIndex >= overParentArray.length) {
            console.error('Índices fuera de rango:', { activeIndex, overIndex });
            return;
        }

        const [movedComponent] = activeParentArray.splice(activeIndex, 1);

        const overComponent = overParentArray[overIndex];
        if (!overComponent) {
            console.error('Componente destino no encontrado');
            return;
        }

        const isOverContainer = overComponent.type === 'container';
        const isOverBanner = overComponent.type === 'banner';
        const isOverProduct = overComponent.type === 'product';
        const isOverProductCard = overComponent.type === 'productCard';

        const dropInfo = dropPosition || { position: 'bottom' };

        if ((isOverContainer || isOverBanner || isOverProduct || isOverProductCard) && dropInfo.position === 'inside') {
            let targetArray;
            if (isOverContainer) {
                overComponent.content = overComponent.content || [];
                targetArray = overComponent.content;
            } else if (isOverBanner) {
                overComponent.content = overComponent.content || {};
                overComponent.content.children = overComponent.content.children || [];
                targetArray = overComponent.content.children;
            } else if (isOverProduct) {
                overComponent.content = overComponent.content || {};
                overComponent.content.children = overComponent.content.children || [];
                targetArray = overComponent.content.children;
            } else if (isOverProductCard) {
                overComponent.content = overComponent.content || {};
                overComponent.content.children = overComponent.content.children || [];
                targetArray = overComponent.content.children;
            }

            if (movedComponent.id !== overComponent.id) {
                targetArray.push(movedComponent);
            } else {
                console.log("No puedes mover un componente dentro de sí mismo");
                return;
            }
        } else {
            let adjustedIndex = overIndex;

            if (activeParentArray === overParentArray) {
                if (activeIndex < overIndex) {
                    adjustedIndex = overIndex - 1;
                }
            }

            if (dropInfo.position === 'bottom') {
                adjustedIndex += 1;
            }

            adjustedIndex = Math.max(0, Math.min(adjustedIndex, overParentArray.length));

            overParentArray.splice(adjustedIndex, 0, movedComponent);
        }

        handleComponentsUpdate(newComponents);
        toast.success("Componente movido correctamente");
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverId(null);
        setDropPosition(null);
    };

    const findActiveComponent = (id) => {
        const findComponent = (items, targetId) => {
            for (const item of items) {
                if (item.id === targetId) {
                    return item;
                }
                if (item.type === 'container' && item.content) {
                    const found = findComponent(item.content, targetId);
                    if (found) return found;
                }
                // Buscar en banners con hijos
                if (item.type === 'banner' && item.content && item.content.children) {
                    const found = findComponent(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en product con hijos
                if (item.type === 'product' && item.content && item.content.children) {
                    const found = findComponent(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en productCard con hijos
                if (item.type === 'productCard' && item.content && item.content.children) {
                    const found = findComponent(item.content.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        return findComponent(components, id);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeComponent = activeId ? findActiveComponent(activeId) : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`${page.title}`} />
            {isPreviewMode ? (
                <div>
                    <Button
                        className="fixed top-10 right-10 z-50"
                        variant="destructive"
                        size="icon"
                        onClick={() => setIsPreviewMode(false)}
                    >
                        <X size={16} />
                    </Button>
                    <h1>{page.title}</h1>
                    <div style={{
                        backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : '#fff',
                        fontFamily: themeSettings?.fontFamily || 'inherit',
                    }}>
                        <Canvas
                            components={components}
                            onEditComponent={() => { }}
                            onDeleteComponent={() => { }}
                            themeSettings={themeSettings}
                            products={products}
                            setComponents={setComponents}
                            canvasWidth={canvasWidth}
                            hoveredComponentId={null}
                            setHoveredComponentId={() => { }}
                            isPreview={true}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <TooltipProvider >
                        <div className="flex justify-between items-center px-4 py-2 border-b bg-white shadow-sm">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => router.visit(route('pages.index'))}>
                                        <ArrowLeftToLine size={16} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Volver a páginas</TooltipContent>
                            </Tooltip>
                            <div className="mx-auto">
                                <Button variant="ghost" disabled size="icon">
                                    {page.title}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setCanvasWidth('100%')} variant={canvasWidth === '100%' ? 'outline' : 'ghost'} size="icon">
                                            <Monitor size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver en escritorio</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setCanvasWidth('640px')} variant={canvasWidth === '640px' ? 'outline' : 'ghost'} size="icon">
                                            <Tablet size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver en tablet</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => setIsPreviewMode(true)} variant="ghost" size="icon">
                                            <Eye size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Modo preview</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={undo} disabled={historyIndex <= 0} variant="outline" size="icon">
                                            <Undo size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Deshacer</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={redo} disabled={historyIndex >= history.length - 1} variant="outline" size="icon">
                                            <Redo size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Rehacer</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => saveLayout(false)} size="icon">
                                            <Save size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Guardar</TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </TooltipProvider>

                    <div className="flex gap-6 p-4">
                        <div className="w-80 h-full sticky top-0 bg-white p-4 rounded-lg shadow-md">
                            {editingComponent ? (
                                // MODO EDICIÓN - Mostrar formularios de edición
                                <ScrollArea className="h-[80vh] flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold">
                                            Editando {editingComponent.type}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={cancelEdit}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>

                                    <ScrollArea className="flex-1">
                                        {editingComponent?.type === 'text' && (
                                            <TextEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'button' && (
                                            <ButtonEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'heading' && (
                                            <HeadingEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'image' && (
                                            <ImageEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                            />
                                        )}
                                        {editingComponent?.type === 'video' && (
                                            <VideoEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                            />
                                        )}
                                        {editingComponent?.type === 'link' && (
                                            <LinkEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'product' && (
                                            <ProductEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'carousel' && (
                                            <CarouselEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'carouselTitle' && (
                                            <CarouselTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'carouselCard' && (
                                            <CarouselCardEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'marquee' && (
    <MarqueeEditDialog
        editContent={editContent}
        setEditContent={setEditContent}
        editStyles={editStyles}
        setEditStyles={setEditStyles}
    />
)}
{editingComponent?.type === 'divider' && (
    <DividerEditDialog
        editStyles={editStyles}
        setEditStyles={setEditStyles}
    />
)}
                                        {editingComponent?.type === 'carouselImage' && (
                                            <CarouselImageEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'carouselName' && (
                                            <CarouselNameEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'carouselPrice' && (
                                            <CarouselPriceEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'container' && (
                                            <ContainerEditDialog
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'banner' && (
                                            <BannerEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bannerTitle' && (
                                            <BannerTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bannerText' && (
                                            <BannerTextEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'productTitle' && (
                                            <ProductTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'productCard' && (
                                            <ProductCardEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'productImage' && (
                                            <ProductImageEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'productName' && (
                                            <ProductNameEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'productPrice' && (
                                            <ProductPriceEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bento' && (
                                            <BentoEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bentoTitle' && (
                                            <BentoTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bentoFeature' && (
                                            <BentoFeatureEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bentoFeatureTitle' && (
                                            <BentoFeatureTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'bentoFeatureText' && (
                                            <BentoFeatureTextEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                    </ScrollArea>

                                    <div className="flex gap-2 pt-4 border-t mt-4">
                                        <Button
                                            variant="outline"
                                            onClick={cancelEdit}
                                            className="flex-1"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={saveEdit}
                                            className="flex-1"
                                        >
                                            Guardar
                                        </Button>
                                    </div>
                                </ScrollArea>
                            ) : (
                                // MODO NORMAL - Mostrar árbol de componentes
                                <>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDragEnd={handleDragEnd}
                                        onDragCancel={handleDragCancel}
                                        modifiers={[]}
                                    >
                                        <ComponentTree
                                            components={components}
                                            onEditComponent={handleEditComponent}
                                            onDeleteComponent={deleteComponent}
                                            activeId={activeId}
                                            overId={overId}
                                            dropPosition={dropPosition}
                                            hoveredComponentId={hoveredComponentId}
                                            setHoveredComponentId={setHoveredComponentId}
                                        />
                                        <DragOverlay dropAnimation={null}>
                                            {activeComponent ? (
                                                <div className="flex items-center gap-1 p-2 border-2 border-blue-500 rounded bg-blue-50 shadow-lg opacity-90">
                                                    <div className="cursor-grab p-1">
                                                        <GripVertical size={14} />
                                                    </div>
                                                    <span className="flex-1 text-sm font-medium">
                                                        {activeComponent.type.charAt(0).toUpperCase() + activeComponent.type.slice(1)}
                                                    </span>
                                                </div>
                                            ) : null}
                                        </DragOverlay>
                                    </DndContext>
                                    <Button onClick={() => setIsAddDialogOpen(true)} className="w-full mt-4" variant="outline">
                                        <Plus size={16} className="mr-2" />
                                        Agregar Componente
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex-1">
                            <Canvas
                                components={components}
                                onEditComponent={handleEditComponent}
                                onDeleteComponent={deleteComponent}
                                themeSettings={themeSettings}
                                products={products}
                                setComponents={setComponents}
                                canvasWidth={canvasWidth}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                            />
                        </div>
                    </div>
                </>
            )}

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Componente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label htmlFor="type">Tipo de Componente</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bento">Bento</SelectItem>
                                <SelectItem value="marquee">Texto en Movimiento</SelectItem>
                                <SelectItem value="banner">Banner</SelectItem>
                                <SelectItem value="product">Productos</SelectItem>
                                <SelectItem value="heading">Encabezado</SelectItem>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="image">Imagen</SelectItem>
                                <SelectItem value="button">Botón</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="link">Enlace</SelectItem>
                                <SelectItem value="carousel">Carrusel de Productos</SelectItem>
                                <SelectItem value="container">Contenedor</SelectItem>
                                <SelectItem value="divider">Divider (Línea)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAddComponent} disabled={!selectedType}>Agregar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}