// components/BuilderPages/Builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, MeasuringStrategy } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { X, Undo, Redo, Monitor, Tablet, ArrowLeftToLine, Eye, Save, Plus, GripVertical, Palette, Dot } from 'lucide-react';
import ComponentTree from '@/Components/BuilderPages/ComponentTree';
import Canvas from '@/Components/BuilderPages/Canvas';
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
import PageContentEditDialog from './partials/PageContentEditDialog';
import ApplyTemplate from '@/Components/ApplyTemplate';
import ThemeSelector from '@/Components/ThemeSelector';
import ThemeCustomizerDialog from './partials/ThemeCustomizerDialog';
import { Badge } from '@/Components/ui/badge';
import HeaderEditDialog from './partials/HeaderEditDialog';
import HeaderLogoEditDialog from './partials/HeaderLogoEditDialog';
import HeaderMenuEditDialog from './partials/HeaderMenuEditDialog';
import FooterMenuEditDialog from './partials/FooterMenuEditDialog';
import FooterEditDialog from './partials/FooterEditDialog';

export default function Builder({ page, products, availableTemplates, themes, pageThemeSettings, availableMenus }) {
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
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [dropPosition, setDropPosition] = useState(null);
    const [hoveredComponentId, setHoveredComponentId] = useState(null);
    const [templates] = useState(availableTemplates || []);
    const themeSettings = page.theme?.settings || {};
    const [currentThemeSettings, setCurrentThemeSettings] = useState(pageThemeSettings);
    const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
    const [hasCopiedTheme, setHasCopiedTheme] = useState(!!page.theme_settings);

    // Función para obtener el tema aplicado
    const getAppliedTheme = () => {
        // 1. Prioridad: Tema específico de la página
        if (page.theme_id && page.theme) {
            return page.theme;
        }

        // 2. Tema de la plantilla (si la página usa una plantilla)
        if (page.uses_template && page.template && page.template.theme) {
            return page.template.theme;
        }

        // 3. Tema global por defecto
        // Primero buscar si la empresa tiene tema por defecto
        if (page.company?.default_theme_id) {
            const companyDefaultTheme = themes?.find(t => t.id === page.company.default_theme_id);
            if (companyDefaultTheme) {
                return companyDefaultTheme;
            }
        }

        // 4. Tema global del sistema (tema-azul)
        const defaultTheme = themes?.find(t => t.slug === 'tema-azul') || themes?.[0];
        return defaultTheme || {
            name: 'Tema Por Defecto',
            settings: {
                primary: '209 100% 92%',
                background: '0 0% 100%',
                foreground: '0 0% 3.9%',
                secondary: '0 0% 96.1%',
                fontFamily: 'Arial, sans-serif',
                borderRadius: '0.5rem'
            }
        };
    };

    // Obtener el tema aplicado
    const appliedTheme = getAppliedTheme();

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

                        // Buscar en contenedores
                        if (component.type === 'container' && Array.isArray(component.content)) {
                            return {
                                ...component,
                                content: updateComponentInTree(component.content, targetId, newData)
                            };
                        }

                        // Buscar en banners, products, carousels, etc.
                        const typesWithChildren = [
                            'banner', 'product', 'productCard', 'carousel',
                            'carouselCard', 'bento', 'bentoFeature', 'header', 'footer'
                        ];

                        if (typesWithChildren.includes(component.type) &&
                            component.content &&
                            Array.isArray(component.content.children)) {
                            return {
                                ...component,
                                content: {
                                    ...component.content,
                                    children: updateComponentInTree(component.content.children, targetId, newData)
                                }
                            };
                        }

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
        // Primero buscar el componente para verificar su tipo
        const findComponentType = (items, targetId) => {
            for (const item of items) {
                if (item.id === targetId) {
                    return item.type;
                }
                if (item.type === 'container' && item.content) {
                    const found = findComponentType(item.content, targetId);
                    if (found) return found;
                }
                // Buscar en banners con hijos
                if (item.type === 'banner' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en product con hijos
                if (item.type === 'product' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en productCard con hijos
                if (item.type === 'productCard' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en carousel con hijos
                if (item.type === 'carousel' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en carouselCard con hijos
                if (item.type === 'carouselCard' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en bento con hijos
                if (item.type === 'bento' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en bentoFeature con hijos
                if (item.type === 'bentoFeature' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        const componentType = findComponentType(components, id);

        // Verificar si es pageContent y evitar eliminarlo
        if (componentType === 'pageContent') {
            toast.error("El contenido de página no puede ser eliminado");
            return;
        }

        const removeFromTree = (items, targetId) => {
            return items.filter(item => {
                if (item.id === targetId) {
                    return false;
                }

                // Contenedores normales
                if (item.type === 'container' && Array.isArray(item.content)) {
                    item.content = removeFromTree(item.content, targetId);
                }

                // Componentes con estructura children
                const typesWithChildren = [
                    'banner', 'product', 'productCard', 'carousel',
                    'carouselCard', 'bento', 'bentoFeature', 'header', 'footer'
                ];

                if (typesWithChildren.includes(item.type) &&
                    item.content &&
                    Array.isArray(item.content.children)) {
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
        // console.log('Saving layout...', components);
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
            // Busca la parte donde se crea el header en handleAddComponent
            // y reemplaza el menú estático:

            if (selectedType === 'header') {
                const headerId = Date.now();
                const logoId = headerId + 1;
                const menuId = headerId + 2;

                // Usar el primer menú disponible si existe
                const defaultMenu = availableMenus && availableMenus.length > 0 ? availableMenus[0] : null;

                content = {
                    // Configuración del header
                    logoPosition: 'left',
                    sticky: false,
                    fullWidth: true,
                    height: '70px',
                    // Configuración de botones con iconos Lucide
                    buttons: {
                        showSearch: true,
                        buttonsGap: '10px',
                        cart: {
                            count: '0',
                            styles: {
                                iconColor: '#ffffff',
                                backgroundColor: '#000000',
                                borderWidth: '0px',
                                borderStyle: 'solid',
                                borderColor: '#000000',
                                borderOpacity: '1',
                                borderRadius: '50%',
                                backgroundOpacity: '1',
                                width: '36px',
                                height: '36px',
                                padding: '8px',
                                fontSize: '16px'
                            }
                        },
                        search: {
                            styles: {
                                iconColor: '#000000',
                                backgroundColor: 'transparent',
                                borderWidth: '0px',
                                borderStyle: 'solid',
                                borderColor: '#000000',
                                borderOpacity: '1',
                                borderRadius: '50%',
                                backgroundOpacity: '1',
                                width: '36px',
                                height: '36px',
                                padding: '8px',
                                fontSize: '16px'
                            }
                        },
                        profile: {
                            styles: {
                                iconColor: '#000000',
                                backgroundColor: '#f0f0f0',
                                borderWidth: '0px',
                                borderStyle: 'solid',
                                borderColor: '#000000',
                                borderOpacity: '1',
                                borderRadius: '50%',
                                backgroundOpacity: '1',
                                width: '36px',
                                height: '36px',
                                padding: '8px',
                                fontSize: '16px'
                            }
                        }
                    },
                    // Los hijos como componentes independientes
                    children: [
                        {
                            id: logoId,
                            type: 'headerLogo',
                            content: 'Logo',
                            styles: {
                                layout: 'fit',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                backgroundColor: 'none',
                                paddingTop: '0px',
                                paddingRight: '0px',
                                paddingBottom: '0px',
                                paddingLeft: '0px'
                            }
                        },
                        {
                            id: menuId,
                            type: 'headerMenu',
                            content: {
                                // NUEVA ESTRUCTURA: Objeto con menuId y items
                                menuId: availableMenus && availableMenus.length > 0 ? availableMenus[0].id : null,
                                // items: availableMenus && availableMenus.length > 0 ? availableMenus[0].items : []
                            },
                            styles: {
                                layout: 'fit',
                                display: 'flex',
                                gap: '20px',
                                fontSize: '16px',
                                fontWeight: 'normal',
                                textTransform: 'none',
                                lineHeight: 'normal',
                                fontType: 'default',
                                color: '#000000',
                                buttonBackgroundColor: 'transparent',
                                borderWidth: '0px',
                                borderColor: '#000000',
                                borderRadius: '0px',
                                paddingTop: '5px',
                                paddingRight: '10px',
                                paddingBottom: '5px',
                                paddingLeft: '10px'
                            }
                        }
                    ]
                };

                const newItem = {
                    id: headerId,
                    type: selectedType,
                    content,
                    styles: {
                        paddingTop: '20px',
                        paddingRight: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '20px',
                        backgroundColor: '#ffffff',
                        borderBottom: '1px solid #e5e7eb'
                    }
                };

                setComponents((prev) => {
                    const newComponents = [...prev, newItem];
                    addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                    setHasUnsavedChanges(true);
                    return newComponents;
                });
                setIsAddDialogOpen(false);
                setSelectedType('');
                return;
            }
            // En la función handleAddComponent de Builder.jsx, busca la parte de 'footer' y actualízala:
            if (selectedType === 'footer') {
                const footerId = Date.now();
                const column1Id = footerId + 1;
                const column2Id = footerId + 2;
                const column3Id = footerId + 3;
                const footerMenuId = footerId + 4;

                content = {
                    // Configuración del footer
                    showCopyright: true,
                    copyrightText: '© 2023 Mi Empresa. Todos los derechos reservados.',
                    columns: 3,
                    layout: 'grid', // 'grid' o 'flex'
                    showLogo: false,
                    logoPosition: 'left',
                    socialMedia: {
                        show: false,
                        facebook: '',
                        twitter: '',
                        instagram: '',
                        linkedin: ''
                    },

                    // Los hijos como componentes independientes
                    children: [
                        {
                            id: column1Id,
                            type: 'footerText',
                            content: 'Información de la empresa o texto descriptivo.',
                            styles: {
                                layout: 'fit',
                                color: '#666666',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }
                        },
                        {
                            id: column2Id,
                            type: 'footerMenu',
                            content: {  // ← NUEVA ESTRUCTURA: objeto con menuId
                                menuId: availableMenus && availableMenus.length > 0 ? availableMenus[0].id : null,
                            },
                            styles: {
                                layout: 'fit',
                                display: 'column',
                                gap: '8px',
                                color: '#666666',
                                fontSize: '14px',
                                textTransform: 'none'
                            }
                        },
                        {
                            id: column3Id,
                            type: 'footerText',
                            content: 'Dirección: Calle Principal 123\nTeléfono: (123) 456-7890\nEmail: info@empresa.com',
                            styles: {
                                layout: 'fit',
                                color: '#666666',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }
                        }
                    ]
                };
                // ... resto del código
            }
            if (selectedType === 'container') {
                content = []; // Inicializar como array vacío
                // Agregar estilos por defecto
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content: content,
                    styles: {
                        backgroundColor: '#ffffff',
                        paddingTop: '20px',
                        paddingRight: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '20px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        direction: 'column',
                        gap: '10px',
                        alignment: 'left'
                    }
                };

                setComponents((prev) => {
                    const newComponents = [...prev, newItem];
                    addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                    setHasUnsavedChanges(true);
                    return newComponents;
                });
                setIsAddDialogOpen(false);
                setSelectedType('');
                return;
            }
            // En Builder.jsx, en handleAddComponent, buscar la parte donde se crea un botón:
            if (selectedType === 'button') {
                content = 'Botón';
                // Agregar estilos iniciales con tipo por defecto
                const initialStyles = {
                    buttonType: 'primary',
                    layout: 'fit',
                    paddingTop: '10px',
                    paddingRight: '10px',
                    paddingBottom: '10px',
                    paddingLeft: '10px',
                    borderRadius: '4px',
                    backgroundColor: '#007bff',
                    color: '#ffffff'
                };

                // Crear el nuevo item con estilos iniciales
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: initialStyles
                };

                setComponents((prev) => {
                    const newComponents = [...prev, newItem];
                    addToHistory(newComponents, history, setHistory, historyIndex, setHistoryIndex);
                    setHasUnsavedChanges(true);
                    return newComponents;
                });
                setIsAddDialogOpen(false);
                setSelectedType('');
                return;
            }
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

            if (selectedType === 'pageContent') {
                content = null; // No almacenamos el contenido, se tomará directamente de la página
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

        if (over?.id !== overId) {
            setOverId(over?.id || null);
        }

        if (!over) {
            setDropPosition(null);
            return;
        }

        requestAnimationFrame(() => {
            if (over.id === 'root-area') {
                setDropPosition({ id: 'root-area', position: 'inside' });
                return;
            }

            // DETECCIÓN DIRECTA: ¿Es un contenedor?
            const findComponent = (items, targetId) => {
                for (const item of items) {
                    if (item.id === targetId) {
                        return item;
                    }
                    if (item.type === 'container' && Array.isArray(item.content)) {
                        const found = findComponent(item.content, targetId);
                        if (found) return found;
                    }
                    if (item.content?.children) {
                        const found = findComponent(item.content.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };

            const targetComponent = findComponent(components, over.id);
            const isContainer = [
                'container', 'banner', 'product', 'carousel',
                'bento', 'productCard', 'carouselCard', 'bentoFeature'
            ].includes(targetComponent.type);

            // Lógica normal para no contenedores
            const overElement = document.getElementById(`component-${over.id}`);
            if (overElement) {
                const rect = overElement.getBoundingClientRect();
                const cursorY = event.activatorEvent.clientY;

                const overTop = rect.top;
                const overHeight = rect.height;
                const relativeY = cursorY - overTop;

                const threshold = Math.max(overHeight / 4, 10);

                let position;
                if (relativeY < threshold) {
                    position = 'top';
                } else if (relativeY > overHeight - threshold) {
                    position = 'bottom';
                } else {
                    position = 'inside';
                }

                setDropPosition({ id: over.id, position });
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

        if (!over) {
            console.log('Drag ended without valid drop target');
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) {
            console.log('Dragging over same component, ignoring');
            return;
        }

        // Manejar drop en el área raíz
        if (overId === 'root-area') {
            console.log('Dropping to root area');
            setComponents((prev) => {
                const newComponents = JSON.parse(JSON.stringify(prev));

                const removeComponent = (items, targetId) => {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].id === targetId) {
                            const [removed] = items.splice(i, 1);
                            return removed;
                        }

                        // Buscar recursivamente en todos los tipos de componentes anidados
                        let childArray = null;

                        // Contenedores normales
                        if (items[i].type === 'container' && items[i].content) {
                            childArray = items[i].content;
                        }
                        // Componentes con estructura children
                        else if (
                            ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature'].includes(items[i].type) &&
                            items[i].content?.children
                        ) {
                            childArray = items[i].content.children;
                        }

                        if (childArray) {
                            const removed = removeComponent(childArray, targetId);
                            if (removed) return removed;
                        }
                    }
                    return null;
                };

                const removedComponent = removeComponent(newComponents, activeId);
                if (removedComponent) {
                    newComponents.push(removedComponent);
                    handleComponentsUpdate(newComponents);
                    toast.success("Componente movido al nivel raíz");
                } else {
                    console.error('No se pudo encontrar el componente a mover');
                }
                return newComponents;
            });
            return;
        }

        // Función mejorada para buscar componentes
        const findComponentInfo = (items, targetId, parent = null, path = []) => {
            const targetIdNum = typeof targetId === 'string' ? parseInt(targetId) : targetId;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.id === targetIdNum) {
                    return {
                        component: item,
                        index: i,
                        parent,
                        parentArray: items,
                        path: [...path, i]
                    };
                }

                // Buscar en contenedores normales
                if (item.type === 'container' && Array.isArray(item.content)) {
                    const found = findComponentInfo(item.content, targetIdNum, item, [...path, i]);
                    if (found) return found;
                }

                // Buscar en componentes con estructura children
                if (
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature'].includes(item.type) &&
                    item.content &&
                    Array.isArray(item.content.children)
                ) {
                    const found = findComponentInfo(item.content.children, targetIdNum, item, [...path, i]);
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

        console.log('Drag info:', {
            active: activeInfo.component.type,
            over: overInfo.component.type,
            activeIndex: activeInfo.index,
            overIndex: overInfo.index,
            dropPosition: dropPosition?.position,
            activeParentLength: activeInfo.parentArray.length,
            overParentLength: overInfo.parentArray.length
        });

        // Crear nueva copia de los componentes
        const newComponents = JSON.parse(JSON.stringify(components));

        // Re-encontrar la información en la nueva copia
        const findInNewComponents = (items, targetId) => {
            const targetIdNum = typeof targetId === 'string' ? parseInt(targetId) : targetId;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id === targetIdNum) {
                    return {
                        component: item,
                        index: i,
                        parentArray: items
                    };
                }

                let childArray = null;

                // Contenedores normales
                if (item.type === 'container' && Array.isArray(item.content)) {
                    childArray = item.content;
                }
                // Componentes con estructura children
                else if (
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature'].includes(item.type) &&
                    item.content &&
                    Array.isArray(item.content.children)
                ) {
                    childArray = item.content.children;
                }

                if (childArray) {
                    const found = findInNewComponents(childArray, targetIdNum);
                    if (found) return found;
                }
            }
            return null;
        };

        const newActiveInfo = findInNewComponents(newComponents, activeId);
        const newOverInfo = findInNewComponents(newComponents, overId);

        if (!newActiveInfo || !newOverInfo) {
            console.error('No se pudo encontrar componentes en la nueva estructura');
            return;
        }

        // Obtener arrays padre e índices
        const activeParentArray = newActiveInfo.parentArray;
        const overParentArray = newOverInfo.parentArray;
        const activeIndex = newActiveInfo.index;
        const overIndex = newOverInfo.index;

        // Validar índices
        if (activeIndex < 0 || activeIndex >= activeParentArray.length) {
            console.error('Índice activo fuera de rango');
            return;
        }

        if (overIndex < 0 || overIndex >= overParentArray.length) {
            console.error('Índice destino fuera de rango');
            return;
        }

        // Remover componente activo
        const [movedComponent] = activeParentArray.splice(activeIndex, 1);

        // Obtener información del drop
        const dropInfo = dropPosition || { position: 'bottom' };

        // Determinar si el destino es un contenedor o componente que puede tener hijos
        const overComponent = newOverInfo.component;
        const isContainerType = [
            'container', 'banner', 'product', 'productCard',
            'carousel', 'carouselCard', 'bento', 'bentoFeature'
        ].includes(overComponent.type);

        console.log('Inserting info:', {
            isContainerType,
            dropPosition: dropInfo.position,
            movedComponentType: movedComponent.type,
            overComponentType: overComponent.type,
            movedComponentId: movedComponent.id,
            overComponentId: overComponent.id
        });

        // Lógica de inserción
        if (isContainerType && dropInfo.position === 'inside') {
            let targetArray;

            if (overComponent.type === 'container') {
                // Para contenedores normales - content es un array directo
                overComponent.content = overComponent.content || [];
                targetArray = overComponent.content;
            } else {
                // Para otros componentes - content es un objeto con children array
                overComponent.content = overComponent.content || {};
                overComponent.content.children = overComponent.content.children || [];
                targetArray = overComponent.content.children;
            }

            // Evitar mover un componente dentro de sí mismo
            if (movedComponent.id !== overComponent.id) {
                targetArray.push(movedComponent);
                console.log('Componente insertado en contenedor:', {
                    contenedor: overComponent.type,
                    hijo: movedComponent.type,
                    targetArrayLength: targetArray.length
                });
            } else {
                toast.error("No puedes mover un componente dentro de sí mismo");
                return;
            }
        } else {
            // CORRECCIÓN CRÍTICA: Lógica simplificada y corregida para mover entre elementos
            let targetIndex = overIndex;

            // Solo ajustar si estamos en el mismo array padre
            const isSameParent = activeParentArray === overParentArray;

            if (isSameParent) {
                if (activeIndex < overIndex) {
                    targetIndex = overIndex - 1;
                }
            }

            // Aplicar posición del drop
            if (dropInfo.position === 'bottom') {
                targetIndex += 1;
            } else if (dropInfo.position === 'top') {
                // Si es top, insertamos en la posición actual
                targetIndex = overIndex;
            }

            // CORRECCIÓN: Validación más estricta del índice
            const maxValidIndex = overParentArray.length; // length es válido para insertar al final
            targetIndex = Math.max(0, Math.min(targetIndex, maxValidIndex));

            console.log('Insertando en posición:', targetIndex, 'de array con longitud:', overParentArray.length);

            // Insertar en la posición calculada
            if (targetIndex >= 0 && targetIndex <= overParentArray.length) {
                overParentArray.splice(targetIndex, 0, movedComponent);
            } else {
                console.error('Índice de destino inválido después de validación:', targetIndex);
                return;
            }
        }

        handleComponentsUpdate(newComponents);
        toast.success("Componente movido correctamente");

        // Debug: mostrar estructura actualizada
        console.log('Estructura actualizada:', JSON.stringify(newComponents, null, 2));
    };

    const handleDragCancel = () => {
        setActiveId(null);
        setOverId(null);
        setDropPosition(null);
    };

    const findActiveComponent = (id) => {
        const targetIdNum = typeof id === 'string' ? parseInt(id) : id;

        const findComponent = (items, targetId) => {
            for (const item of items) {
                if (item.id === targetId) {
                    return item;
                }

                // Buscar en contenedores normales
                if (item.type === 'container' && Array.isArray(item.content)) {
                    const found = findComponent(item.content, targetId);
                    if (found) return found;
                }

                // Buscar en componentes con estructura children
                if (
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature'].includes(item.type) &&
                    item.content &&
                    Array.isArray(item.content.children)
                ) {
                    const found = findComponent(item.content.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        return findComponent(components, targetIdNum);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 2, // Más sensible
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeComponent = activeId ? findActiveComponent(activeId) : null;

    // En Builder.jsx - agregar estas funciones
    const copyThemeSettings = () => {
        router.post(route('pages.copyThemeSettings', page), {}, {
            onSuccess: () => {
                toast.success("Configuración del tema copiada para personalización");
                setHasCopiedTheme(true);
                // Recargar para obtener las nuevas configuraciones
                router.reload();
            },
            onError: (errors) => {
                toast.error("Error al copiar configuración del tema");
            }
        });
    };

    const updateThemeSettings = (settings) => {
        router.post(route('pages.updateThemeSettings', page), {
            theme_settings: settings
        }, {
            onSuccess: () => {
                toast.success("Configuraciones del tema actualizadas");
                setIsThemeDialogOpen(false);
                setCurrentThemeSettings(settings);
                // Recargar para aplicar cambios visuales inmediatos
                router.reload();
            },
            onError: (errors) => {
                if (errors.needs_copy) {
                    toast.error("Debes copiar la configuración del tema primero");
                    setHasCopiedTheme(false);
                } else {
                    toast.error("Error al guardar configuraciones");
                }
            }
        });
    };

    const resetThemeSettings = () => {
        router.post(route('pages.resetThemeSettings', page.id), {}, {
            onSuccess: () => {
                toast.success("Configuraciones del tema restablecidas");
                setIsThemeDialogOpen(false);
                setHasCopiedTheme(false);
                router.reload();
            }
        });
    };

    // Actualizar el useEffect para detectar si ya se copió el tema
    useEffect(() => {
        setHasCopiedTheme(!!page.theme_settings);
        setCurrentThemeSettings(pageThemeSettings);
    }, [page.theme_settings, pageThemeSettings]);

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
                    <div style={{
                        backgroundColor: themeSettings?.background ? `hsl(${themeSettings.background})` : '#fff',
                        fontFamily: themeSettings?.fontFamily || 'inherit',
                    }}>
                        <Canvas
                            components={components}
                            onEditComponent={() => { }}
                            onDeleteComponent={() => { }}
                            themeSettings={themeSettings}
                            appliedTheme={appliedTheme}
                            products={products}
                            setComponents={setComponents}
                            canvasWidth={canvasWidth}
                            hoveredComponentId={null}
                            setHoveredComponentId={() => { }}
                            isPreview={true}
                            pageContent={page.content}
                            availableMenus={availableMenus || []} // Asegurar valor por defecto
                        />
                    </div>
                </div>
            ) : (
                <>
                    {/* Layout de builder */}
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <Badge className="bg-green-500">
                                            {page.theme?.name || page.template?.theme?.name || 'Tema por defecto'}
                                        </Badge>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>Tema actual</TooltipContent>
                            </Tooltip>
                            <div className="mx-auto">
                                <Button variant="ghost" disabled size="icon">
                                    {page.title}
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => setIsThemeDialogOpen(true)}
                                            variant="ghost"
                                            size="icon"
                                            className={hasCopiedTheme ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50" : ""}
                                        >
                                            <Palette size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {hasCopiedTheme ? "Editar tema personalizado" : "Personalizar tema"}
                                    </TooltipContent>
                                </Tooltip>
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

                    <div className="flex gap-2 p-4">
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
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'button' && (
                                            <ButtonEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'heading' && (
                                            <HeadingEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}  // ¡Agrega esta línea!
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
                                        {editingComponent?.type === 'header' && (
                                            <HeaderEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'headerMenu' && (
                                            <HeaderMenuEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
                                                availableMenus={availableMenus}
                                            />
                                        )}
                                        {editingComponent?.type === 'footer' && (
                                            <FooterEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                            />
                                        )}
                                        {editingComponent?.type === 'footerMenu' && (
                                            <FooterMenuEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
                                                availableMenus={availableMenus}
                                            />
                                        )}
                                        {editingComponent?.type === 'headerLogo' && (
                                            <HeaderLogoEditDialog
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
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'carouselPrice' && (
                                            <CarouselPriceEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'bannerText' && (
                                            <BannerTextEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'productTitle' && (
                                            <ProductTitleEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
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
                                        {editingComponent?.type === 'pageContent' && (
                                            <PageContentEditDialog
                                                editContent={editContent}
                                            />
                                        )}
                                        {editingComponent?.type === 'productName' && (
                                            <ProductNameEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'productPrice' && (
                                            <ProductPriceEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}
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
                                                themeSettings={themeSettings}
                                            />
                                        )}
                                        {editingComponent?.type === 'bentoFeatureText' && (
                                            <BentoFeatureTextEditDialog
                                                editContent={editContent}
                                                setEditContent={setEditContent}
                                                editStyles={editStyles}
                                                setEditStyles={setEditStyles}
                                                themeSettings={themeSettings}
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
                                    {!isPreviewMode && (
                                        <>
                                            <ThemeSelector page={page} themes={themes} />
                                            <ApplyTemplate
                                                page={page}
                                                templates={availableTemplates}
                                                onTemplateApplied={() => router.reload()}
                                            />
                                        </>
                                    )}

                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDragEnd={handleDragEnd}
                                        onDragCancel={handleDragCancel}
                                        modifiers={[]}
                                        autoScroll={false}
                                        measuring={{
                                            droppable: {
                                                strategy: MeasuringStrategy.Always,
                                            },
                                        }}
                                    >
                                        {/* <ComponentTree
                                            components={components}
                                            onEditComponent={handleEditComponent}
                                            onDeleteComponent={deleteComponent}
                                            activeId={activeId}
                                            overId={overId}
                                            dropPosition={dropPosition}
                                            hoveredComponentId={hoveredComponentId}
                                            setHoveredComponentId={setHoveredComponentId}
                                        /> */}
                                        <ComponentTree
    components={components}
    onEditComponent={handleEditComponent}
    onDeleteComponent={deleteComponent}
    hoveredComponentId={hoveredComponentId}
    setHoveredComponentId={setHoveredComponentId}
    onTreeChange={handleComponentsUpdate}
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
                                themeSettings={pageThemeSettings}
                                appliedTheme={appliedTheme}
                                products={products}
                                setComponents={setComponents}
                                canvasWidth={canvasWidth}
                                hoveredComponentId={hoveredComponentId}
                                setHoveredComponentId={setHoveredComponentId}
                                pageContent={page.content}
                                availableMenus={availableMenus || []} // Asegurar valor por defecto
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
                                <SelectItem value="header">Header</SelectItem>
                                <SelectItem value="footer">Footer</SelectItem>
                                <SelectItem value="bento">Bento</SelectItem>
                                <SelectItem value="marquee">Texto en Movimiento</SelectItem>
                                <SelectItem value="banner">Banner</SelectItem>
                                <SelectItem value="product">Productos</SelectItem>
                                <SelectItem value="heading">Encabezado</SelectItem>
                                <SelectItem value="text">Texto</SelectItem>
                                <SelectItem value="image">Imagen</SelectItem>
                                <SelectItem value="pageContent">Contenido de Página</SelectItem>
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

            <ThemeCustomizerDialog
                open={isThemeDialogOpen}
                onOpenChange={setIsThemeDialogOpen}
                page={page}
                themeSettings={currentThemeSettings}
                hasCopiedTheme={hasCopiedTheme}
                onCopyTheme={copyThemeSettings}
                onSave={updateThemeSettings}
                onReset={resetThemeSettings}
            />
        </div>
    );
}