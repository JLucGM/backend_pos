// components/BuilderPages/Builder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, MeasuringStrategy } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { toast } from 'sonner';
import { X, Undo, Redo, Monitor, Tablet, ArrowLeftToLine, Eye, Save, Plus, GripVertical, Palette, Dot } from 'lucide-react';
import ComponentTree from '@/Components/BuilderPages/ComponentTree';
import Canvas from '@/Components/BuilderPages/Canvas';
import { addToHistory } from '@/utils/Builder/builderUtils';
import { ScrollArea } from '@/Components/ui/scroll-area';
import ApplyTemplate from '@/Components/ApplyTemplate';
import ThemeCustomizerDialog from './partials/ThemeCustomizerDialog';
import { Badge } from '@/Components/ui/badge';
import { getThemeWithDefaults, hslToCss } from '@/utils/themeUtils';

// Importar todos los diálogos
import TextEditDialog from './partials/TextEditDialog';
import ButtonEditDialog from './partials/ButtonEditDialog';
import HeadingEditDialog from './partials/HeadingEditDialog';
import ImageEditDialog from './partials/ImageEditDialog';
import VideoEditDialog from './partials/VideoEditDialog';
import LinkEditDialog from './partials/LinkEditDialog';
import ProductEditDialog from './partials/Product/ProductEditDialog';
import ProductListEditDialog from './partials/Product/ProductListEditDialog';
import CarouselEditDialog from './partials/Carousel/CarouselEditDialog';
import ContainerEditDialog from './partials/ContainerEditDialog';
import BannerEditDialog from './partials/Banner/BannerEditDialog';
import BannerTitleEditDialog from './partials/Banner/BannerTitleEditDialog';
import BannerTextEditDialog from './partials/Banner/BannerTextEditDialog';
import ProductTitleEditDialog from './partials/Product/ProductTitleEditDialog';
import ProductCardEditDialog from './partials/Product/ProductCardEditDialog';
import ProductImageEditDialog from './partials/Product/ProductImageEditDialog';
import ProductNameEditDialog from './partials/Product/ProductNameEditDialog';
import ProductPriceEditDialog from './partials/Product/ProductPriceEditDialog';
import ProductListPaginationEditDialog from './partials/Product/ProductListPaginationEditDialog';
import ProductListPriceFilterEditDialog from './partials/Product/ProductListPriceFilterEditDialog';
import ProductListSortSelectEditDialog from './partials/Product/ProductListSortSelectEditDialog';
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
import HeaderEditDialog from './partials/Header/HeaderEditDialog';
import HeaderLogoEditDialog from './partials/Header/HeaderLogoEditDialog';
import HeaderMenuEditDialog from './partials/Header/HeaderMenuEditDialog';
import FooterMenuEditDialog from './partials/Footer/FooterMenuEditDialog';
import FooterEditDialog from './partials/Footer/FooterEditDialog';
import ProductDetailImageEditDialog from './partials/ProductDetail/ProductDetailImageEditDialog';
import ProductDetailNameEditDialog from './partials/ProductDetail/ProductDetailNameEditDialog';
import ProductDetailPriceEditDialog from './partials/ProductDetail/ProductDetailPriceEditDialog';
import ProductDetailDescriptionEditDialog from './partials/ProductDetail/ProductDetailDescriptionEditDialog';
import ProductDetailEditDialog from './partials/ProductDetail/ProductDetailEditDialog';
import ProductDetailAttributesEditDialog from './partials/ProductDetail/ProductDetailAttributesEditDialog';
import ProductDetailStockEditDialog from './partials/ProductDetail/ProductDetailStockEditDialog';
import QuantitySelectorEditDialog from './partials/ProductDetail/QuantitySelectorEditDialog';
import CartEditDialog from './partials/Cart/CartEditDialog';
import CartItemsEditDialog from './partials/Cart/CartItemsEditDialog';
import CartSummaryEditDialog from './partials/Cart/CartSummaryEditDialog';
import CheckoutEditDialog from './partials/Checkout/CheckoutEditDialog';
import CheckoutSummaryEditDialog from './partials/Checkout/CheckoutSummaryEditDialog';
import CheckoutPaymentEditDialog from './partials/Checkout/CheckoutPaymentEditDialog';
import LoginEditDialog from './partials/Auth/LoginEditDialog';
import RegisterEditDialog from './partials/Auth/RegisterEditDialog';
import CheckoutDiscountGiftCardEditDialog from './partials/Checkout/CheckoutDiscountGiftCardEditDialog';
import ProfileEditDialog from './partials/Profile/ProfileEditDialog';
import OrdersEditDialog from './partials/Orders/OrdersEditDialog';
import SuccessEditDialog from './partials/Success/SuccessEditDialog';
import AnnouncementBarEditDialog from './partials/AnnouncementBar/AnnouncementBarEditDialog';
import AnnouncementEditDialog from './partials/AnnouncementBar/AnnouncementEditDialog';
import AddComponentDropdown from '@/Components/BuilderPages/AddComponentDropdown';

// Mapeo de tipos de componente a sus diálogos correspondientes
const componentDialogMap = {
    text: TextEditDialog,
    button: ButtonEditDialog,
    heading: HeadingEditDialog,
    image: ImageEditDialog,
    video: VideoEditDialog,
    link: LinkEditDialog,
    product: ProductEditDialog,
    productList: ProductListEditDialog,
    header: HeaderEditDialog,
    headerMenu: HeaderMenuEditDialog,
    footer: FooterEditDialog,
    footerMenu: FooterMenuEditDialog,
    headerLogo: HeaderLogoEditDialog,
    carousel: CarouselEditDialog,
    carouselTitle: CarouselTitleEditDialog,
    carouselCard: CarouselCardEditDialog,
    marquee: MarqueeEditDialog,
    divider: DividerEditDialog,
    carouselImage: CarouselImageEditDialog,
    carouselName: CarouselNameEditDialog,
    carouselPrice: CarouselPriceEditDialog,
    container: ContainerEditDialog,
    banner: BannerEditDialog,
    bannerTitle: BannerTitleEditDialog,
    bannerText: BannerTextEditDialog,
    productTitle: ProductTitleEditDialog,
    productCard: ProductCardEditDialog,
    productImage: ProductImageEditDialog,
    productListPagination: ProductListPaginationEditDialog,
    productListPriceFilter: ProductListPriceFilterEditDialog,
    productListSortSelect: ProductListSortSelectEditDialog,
    pageContent: PageContentEditDialog,
    productName: ProductNameEditDialog,
    productPrice: ProductPriceEditDialog,
    bento: BentoEditDialog,
    bentoTitle: BentoTitleEditDialog,
    bentoFeature: BentoFeatureEditDialog,
    bentoFeatureTitle: BentoFeatureTitleEditDialog,
    bentoFeatureText: BentoFeatureTextEditDialog,
    productDetail: ProductDetailEditDialog,
    productDetailImage: ProductDetailImageEditDialog,
    productDetailName: ProductDetailNameEditDialog,
    productDetailPrice: ProductDetailPriceEditDialog,
    productDetailDescription: ProductDetailDescriptionEditDialog,
    productDetailAttributes: ProductDetailAttributesEditDialog,
    productDetailStock: ProductDetailStockEditDialog,
    quantitySelector: QuantitySelectorEditDialog,
    cart: CartEditDialog,
    cartItems: CartItemsEditDialog,
    cartSummary: CartSummaryEditDialog,
    checkout: CheckoutEditDialog,
    checkoutSummary: CheckoutSummaryEditDialog,
    checkoutPayment: CheckoutPaymentEditDialog,
    checkoutDiscountGiftCard: CheckoutDiscountGiftCardEditDialog,
    login: LoginEditDialog,
    register: RegisterEditDialog,
    profile: ProfileEditDialog,
    orders: OrdersEditDialog,
    success: SuccessEditDialog,
    announcementBar: AnnouncementBarEditDialog,
    announcement: AnnouncementEditDialog,
};

// Componente para renderizar el diálogo apropiado
const EditDialogRenderer = ({
    editingComponent,
    editContent,
    setEditContent,
    editStyles,
    setEditStyles,
    themeSettings,
    availableMenus,
    products,
    dynamicPages, // Agregar esto
}) => {
    if (!editingComponent?.type) return null;

    const DialogComponent = componentDialogMap[editingComponent.type];

    if (!DialogComponent) {
        console.warn(`No se encontró diálogo para el tipo: ${editingComponent.type}`);
        return null;
    }

    // Props base para todos los diálogos
    const baseProps = {
        editContent,
        setEditContent,
        editStyles,
        setEditStyles,
        themeSettings,
        isLiveEdit: true,
    };

    // Props específicas para ciertos diálogos
    const additionalProps = {};

    if (editingComponent.type === 'headerMenu' ||
        editingComponent.type === 'footerMenu') {
        additionalProps.availableMenus = availableMenus;
    }

    if (editingComponent.type === 'image') {
        additionalProps.products = products;
        additionalProps.dynamicPages = dynamicPages; // ¡Agregar esta línea!
    }

    if (editingComponent.type === 'button') {
        additionalProps.dynamicPages = dynamicPages;
        additionalProps.products = products;
    }

    if (editingComponent.type === 'announcement') {
        additionalProps.dynamicPages = dynamicPages;
        additionalProps.products = products;
    }

    return <DialogComponent {...baseProps} {...additionalProps} />;
};

export default function Builder({ page, products, availableTemplates, themes, pageThemeSettings, availableMenus, companyLogo, dynamicPages, countries, states, cities }) {
    const [components, setComponents] = useState([]);
    const toolbarRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 64px)');
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
    const [expandedItems, setExpandedItems] = useState(new Set());

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

    const cancelEdit = () => {
        setEditingComponent(null);
        setEditContent('');
        setEditStyles({});
    };

    const deleteComponent = (id) => {
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
                // Buscar en product y productList con hijos
                if ((item.type === 'product' || item.type === 'productList') && item.content && item.content.children) {
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
                if (item.type === 'productDetail' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                if (item.type === 'checkout' && item.content && item.content.children) {
                    const found = findComponentType(item.content.children, targetId);
                    if (found) return found;
                }
                // Buscar en announcementBar con hijos
                if (item.type === 'announcementBar' && item.content && item.content.children) {
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
                    'banner', 'product', 'productList', 'productCard', 'carousel',
                    'carouselCard', 'bento', 'bentoFeature', 'header', 'footer',
                    'productDetail', 'checkout', 'cart', 'announcementBar'
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

    useEffect(() => {
        if (editingComponent) {
                    // console.log('Builder syncing edits for', editingComponent.id, { editStyles, editContent });

            // Actualizar el componente en el estado mientras se edita
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
                            'banner', 'product', 'productList', 'productCard', 'carousel',
                            'carouselCard', 'bento', 'bentoFeature', 'header', 'footer',
                            'productDetail', 'cart', 'checkout', 'login', 'register', 'announcementBar'
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

                return updateComponentInTree(prev, editingComponent.id, newData);
            });
        }
    }, [editContent, editStyles, editingComponent]);

    const handleAddComponent = (selectedType) => {
        if (!selectedType) {
            toast.error("Por favor selecciona un tipo de componente");
            return;
        }

        // Obtener configuración del tema con valores por defecto
        const themeWithDefaults = getThemeWithDefaults(currentThemeSettings);

        if (selectedType) {
            let content = 'Nuevo ' + selectedType;
            if (selectedType === 'video') content = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            if (selectedType === 'link') content = 'https://example.com';
            if (selectedType === 'image') {
                content = {
                    src: 'https://picsum.photos/400/300',
                    alt: 'Imagen de ejemplo'
                };

                const initialStyles = {
                    aspectRatio: 'square',
                    layout: 'fit',
                    borderRadius: themeWithDefaults.image_borderRadius || '0px',
                    borderWidth: themeWithDefaults.image_borderWidth || '0px',
                    borderStyle: 'solid',
                    borderColor: themeWithDefaults.image_borderColor || hslToCss(themeWithDefaults.borders),
                    marginTop: '0px',
                    marginRight: '0px',
                    marginBottom: '0px',
                    marginLeft: '0px',
                    paddingTop: '0px',
                    paddingRight: '0px',
                    paddingBottom: '0px',
                    paddingLeft: '0px',
                    objectFit: themeWithDefaults.image_objectFit || 'cover'
                };

                const newItem = {
                    id: Date.now(),
                    type: 'image',
                    content: content,
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
            if (selectedType === 'header') {
                const headerId = Date.now();
                const logoId = headerId + 1;
                const menuId = headerId + 2;

                const defaultMenu = availableMenus && availableMenus.length > 0 ? availableMenus[0] : null;

                content = {
                    logoPosition: 'left',
                    sticky: false,
                    fullWidth: true,
                    height: '70px',
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
                    children: [
                        {
                            id: logoId,
                            type: 'headerLogo',
                            content: 'Logo',
                            styles: {
                                layout: 'fit',
                                fontSize: themeWithDefaults.header_logoSize || '24px',
                                fontWeight: 'bold',
                                color: themeWithDefaults.header_logoColor || hslToCss(themeWithDefaults.heading),
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
                                menuId: availableMenus && availableMenus.length > 0 ? availableMenus[0].id : null,
                            },
                            styles: {
                                layout: 'fit',
                                display: 'flex',
                                gap: '20px',
                                fontSize: themeWithDefaults.header_menuSize || '16px',
                                fontWeight: 'normal',
                                textTransform: 'none',
                                lineHeight: 'normal',
                                fontType: 'default',
                                color: themeWithDefaults.header_menuColor || hslToCss(themeWithDefaults.text),
                                buttonBackgroundColor: 'transparent',
                                backgroundColor: 'transparent',
                                borderWidth: '0px',
                                borderColor: hslToCss(themeWithDefaults.borders),
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
                        backgroundColor: themeWithDefaults.header_backgroundColor || hslToCss(themeWithDefaults.background),
                        borderBottom: `1px solid ${hslToCss(themeWithDefaults.borders)}`
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

            if (selectedType === 'productList') {
                const listId = Date.now();
                const titleId = listId + 1;
                const cardId = listId + 2;
                const imageId = listId + 3;
                const nameId = listId + 4;
                const priceId = listId + 5;
                const paginationId = listId + 6;
                const priceFilterId = listId + 7;
                const sortSelectId = listId + 8;

                content = {
                    columns: 3,
                    gapX: themeWithDefaults.carousel_gapX,
                    gapY: themeWithDefaults.carousel_gapY,
                    backgroundColor: themeWithDefaults.background,
                    limit: 8,
                    children: [
                        {
                            id: titleId,
                            type: 'productTitle',
                            content: 'Lista de Productos',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: hslToCss(themeWithDefaults.heading),
                                fontSize: themeWithDefaults.heading2_fontSize || '24px',
                                fontWeight: themeWithDefaults.heading2_fontWeight || 'bold'
                            }
                        },
                        {
                            id: cardId,
                            type: 'productCard',
                            content: {
                                cardBorder: 'none',
                                cardBorderThickness: '1px',
                                cardBorderOpacity: '1',
                                cardBorderRadius: '0px',
                                cardPaddingTop: '0px',
                                cardPaddingRight: '0px',
                                cardPaddingBottom: '0px',
                                cardPaddingLeft: '0px',
                                children: [
                                    {
                                        id: imageId,
                                        type: 'productImage',
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
                                        type: 'productName',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: hslToCss(themeWithDefaults.text),
                                            fontSize: themeWithDefaults.paragraph_fontSize || '16px',
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
                                            color: hslToCss(themeWithDefaults.text),
                                            fontSize: '14px',
                                            fontWeight: 'normal'
                                        }
                                    }
                                ]
                            },
                            styles: {}
                        },
                        {
                            id: priceFilterId,
                            type: 'productListPriceFilter',
                            content: {},
                            styles: {
                                borderRadius: '4px',
                                borderColor: '#ccc',
                                borderThickness: '1px',
                                background: '#fff'
                            }
                        },
                        {
                            id: sortSelectId,
                            type: 'productListSortSelect',
                            content: {},
                            styles: {
                                borderRadius: '4px',
                                borderColor: '#ccc',
                                borderThickness: '1px',
                                background: '#fff'
                            }
                        },
                        {
                            id: paginationId,
                            type: 'productListPagination',
                            content: {},
                            styles: {
                                borderRadius: '4px',
                                borderColor: '#000',
                                borderThickness: '1px',
                                background: '#fff'
                            }
                        }
                    ]
                };

                const newItem = {
                    id: listId,
                    type: 'productList',
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.background,
                        paddingTop: '20px',
                        paddingRight: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '20px'
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

            if (selectedType === 'footer') {
                const footerId = Date.now();
                const column1Id = footerId + 1;
                const column2Id = footerId + 2;

                content = {
                    showCopyright: true,
                    copyrightText: '© 2023 Mi Empresa. Todos los derechos reservados.',
                    columns: 3,
                    layout: 'grid',
                    showLogo: false,
                    logoPosition: 'left',
                    socialMedia: {
                        show: false,
                        facebook: '',
                        twitter: '',
                        instagram: '',
                        linkedin: ''
                    },
                    children: [
                        {
                            id: column1Id,
                            type: 'text',
                            content: 'Dirección: Calle Principal 123\nTeléfono: (123) 456-7890\nEmail: info@empresa.com',
                            styles: {
                                layout: 'fit',
                                color: themeWithDefaults.footer_textColor || hslToCss(themeWithDefaults.text),
                                fontSize: themeWithDefaults.paragraph_fontSize || '14px',
                                lineHeight: themeWithDefaults.paragraph_lineHeight || '1.6'
                            }
                        },
                        {
                            id: column2Id,
                            type: 'footerMenu',
                            content: {
                                menuId: availableMenus && availableMenus.length > 0 ? availableMenus[0].id : null,
                            },
                            styles: {
                                layout: 'fit',
                                display: 'column',
                                gap: '8px',
                                color: themeWithDefaults.footer_linkColor || hslToCss(themeWithDefaults.text),
                                fontSize: '14px',
                                textTransform: 'none'
                            }
                        },
                    ]
                };

                const newItem = {
                    id: footerId,
                    type: selectedType,
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.footer_backgroundColor || hslToCss(themeWithDefaults.background),
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px'
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

            if (selectedType === 'container') {
                const containerId = Date.now();
                const textId = Date.now() + 1;

                content = [
                    {
                        id: textId,
                        type: 'text',
                        content: { text: 'Nuevo texto' },
                        styles: {
                            color: hslToCss(themeWithDefaults.text),
                            fontSize: themeWithDefaults.paragraph_fontSize || '16px',
                            fontWeight: themeWithDefaults.paragraph_fontWeight || 'normal',
                            lineHeight: themeWithDefaults.paragraph_lineHeight || '1.6'
                        }
                    }
                ];

                const newItem = {
                    id: containerId,
                    type: 'container',
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.container_backgroundColor || 'transparent',
                        borderRadius: themeWithDefaults.container_borderRadius || '0px',
                        gap: themeWithDefaults.container_gap || '0px',
                        paddingTop: '20px',
                        paddingRight: '20px',
                        paddingBottom: '20px',
                        paddingLeft: '20px'
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

            if (selectedType === 'heading') {
                const newItem = {
                    id: Date.now(),
                    type: 'heading',
                    content: 'Nuevo encabezado',
                    styles: {
                        textStyle: 'heading2',
                        layout: 'fit',
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px',
                        backgroundColor: 'transparent',
                        borderRadius: '0px',
                        color: hslToCss(themeWithDefaults.heading)
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

            if (selectedType === 'button') {
                content = 'Botón';
                const initialStyles = {
                    buttonType: 'primary',
                    layout: 'fit',
                    paddingTop: '10px',
                    paddingRight: '10px',
                    paddingBottom: '10px',
                    paddingLeft: '10px',
                    borderRadius: themeWithDefaults.primary_button_corner_radius,
                    backgroundColor: hslToCss(themeWithDefaults.primary_button_background),
                    color: hslToCss(themeWithDefaults.primary_button_text)
                };

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
                content = '';
                
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: {
                        paddingTop: themeWithDefaults.divider_paddingTop,
                        paddingBottom: themeWithDefaults.divider_paddingBottom,
                        lineWidth: themeWithDefaults.divider_lineWidth,
                        lineLength: themeWithDefaults.divider_lineLength,
                        lineColor: themeWithDefaults.divider_lineColor,
                        opacity: themeWithDefaults.divider_opacity,
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

            if (selectedType === 'marquee') {
                content = '¡Texto en movimiento! Personaliza este texto.';
                
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: {
                        paddingTop: themeWithDefaults.marquee_paddingTop,
                        paddingBottom: themeWithDefaults.marquee_paddingBottom,
                        fontSize: themeWithDefaults.marquee_fontSize,
                        fontWeight: themeWithDefaults.marquee_fontWeight,
                        color: themeWithDefaults.marquee_color,
                        backgroundColor: themeWithDefaults.marquee_backgroundColor,
                        borderRadius: themeWithDefaults.marquee_borderRadius,
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

            if (selectedType === 'announcementBar') {
                const announcementBarId = Date.now();
                const announcement1Id = announcementBarId + 1;

                content = {
                    autoplayTime: 5, // 5 segundos por defecto
                    children: [
                        {
                            id: announcement1Id,
                            type: 'announcement',
                            content: {
                                text: 'Nuevo anuncio - Haz clic para editar',
                                navigationUrl: ''
                            },
                            styles: {
                                fontSize: '14px',
                                fontWeight: 'normal',
                                color: '#ffffff',
                                textTransform: 'none',
                                fontType: 'default'
                            }
                        }
                    ]
                };

                const newItem = {
                    id: announcementBarId,
                    type: selectedType,
                    content,
                    styles: {
                        backgroundColor: hslToCss(themeWithDefaults.background),
                        paddingTop: '15px',
                        paddingBottom: '15px'
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

            if (selectedType === 'carousel') {
                const carouselId = Date.now();
                const titleId = carouselId + 1;
                const cardId = carouselId + 2;
                const imageId = carouselId + 3;
                const nameId = carouselId + 4;
                const priceId = carouselId + 5;

                content = {
                    limit: 5,
                    slidesToShow: 3,
                    gapX: themeWithDefaults.carousel_gapX,
                    gapY: themeWithDefaults.carousel_gapY,
                    backgroundColor: themeWithDefaults.carousel_backgroundColor,
                    children: [
                        {
                            id: titleId,
                            type: 'carouselTitle',
                            content: 'Productos en Carrusel',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: hslToCss(themeWithDefaults.heading),
                                fontSize: themeWithDefaults.heading2_fontSize || '24px',
                                fontWeight: themeWithDefaults.heading2_fontWeight || 'bold'
                            }
                        },
                        {
                            id: cardId,
                            type: 'carouselCard',
                            content: {
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
                                            color: hslToCss(themeWithDefaults.text),
                                            fontSize: themeWithDefaults.paragraph_fontSize || '16px',
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
                                            color: hslToCss(themeWithDefaults.text),
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

            if (selectedType === 'product') {
                const productId = Date.now();
                const titleId = productId + 1;
                const cardId = productId + 2;
                const imageId = productId + 3;
                const nameId = productId + 4;
                const priceId = productId + 5;

                content = {
                    columns: 3,
                    gapX: themeWithDefaults.carousel_gapX,
                    gapY: themeWithDefaults.carousel_gapY,
                    backgroundColor: themeWithDefaults.background,
                    limit: 8,
                    children: [
                        {
                            id: titleId,
                            type: 'productTitle',
                            content: 'Productos Destacados',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: hslToCss(themeWithDefaults.heading),
                                fontSize: themeWithDefaults.heading2_fontSize || '24px',
                                fontWeight: themeWithDefaults.heading2_fontWeight || 'bold',
                                background: 'none',
                            }
                        },
                        {
                            id: cardId,
                            type: 'productCard',
                            content: {
                                cardBorder: 'none',
                                cardBorderThickness: '1px',
                                cardBorderOpacity: '1',
                                cardBorderRadius: '0px',
                                cardPaddingTop: '0px',
                                cardPaddingRight: '0px',
                                cardPaddingBottom: '0px',
                                cardPaddingLeft: '0px',
                                children: [
                                    {
                                        id: imageId,
                                        type: 'productImage',
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
                                        type: 'productName',
                                        content: '',
                                        styles: {
                                            layout: 'fit',
                                            alignment: 'left',
                                            color: hslToCss(themeWithDefaults.text),
                                            fontSize: themeWithDefaults.paragraph_fontSize || '16px',
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
                                            color: hslToCss(themeWithDefaults.text),
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

            if (selectedType === 'banner') {
                const bannerId = Date.now();
                const titleId = bannerId + 1;
                const textId = bannerId + 2;

                content = {
                    containerHeight: themeWithDefaults.banner_containerHeight,
                    containerWidth: '100%',
                    marginTop: '0px',
                    marginRight: '0px',
                    marginBottom: '0px',
                    marginLeft: '0px',
                    paddingTop: themeWithDefaults.banner_paddingTop,
                    paddingRight: themeWithDefaults.banner_paddingRight,
                    paddingBottom: themeWithDefaults.banner_paddingBottom,
                    paddingLeft: themeWithDefaults.banner_paddingLeft,
                    backgroundColor: themeWithDefaults.banner_backgroundColor,
                    backgroundImage: null,
                    backgroundVideo: null,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    containerVerticalPosition: 'center',
                    containerHorizontalPosition: 'center',
                    contentDirection: 'vertical',
                    // NUEVAS PROPIEDADES: Contenedor interno
                    innerContainerShow: true,
                    innerContainerHasBackground: true,
                    innerContainerBackgroundColor: themeWithDefaults.banner_innerContainerBackgroundColor,
                    innerContainerBackgroundOpacity: themeWithDefaults.banner_innerContainerBackgroundOpacity,
                    innerContainerPaddingTop: themeWithDefaults.banner_innerContainerPaddingTop,
                    innerContainerPaddingRight: themeWithDefaults.banner_innerContainerPaddingRight,
                    innerContainerPaddingBottom: themeWithDefaults.banner_innerContainerPaddingBottom,
                    innerContainerPaddingLeft: themeWithDefaults.banner_innerContainerPaddingLeft,
                    innerContainerBorderRadius: themeWithDefaults.banner_innerContainerBorderRadius,
                    innerContainerWidth: 'auto',
                    innerContainerMaxWidth: '800px',
                    children: [
                        {
                            id: titleId,
                            type: 'heading',
                            content: 'Título del Banner',
                            styles: {
                                textStyle: 'heading2',
                                layout: 'fit',
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                backgroundColor: 'transparent',
                                borderRadius: '0px',
                                color: hslToCss(themeWithDefaults.heading)
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
                                color: hslToCss(themeWithDefaults.text),
                                fontSize: themeWithDefaults.paragraph_fontSize,
                                fontWeight: themeWithDefaults.paragraph_fontWeight
                            }
                        }
                    ]
                };

                const newItem = {
                    id: bannerId,
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
                return;
            }

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
                    gridColumns: 2,
                    gridGap: themeWithDefaults.bento_gridGap,
                    backgroundColor: themeWithDefaults.bento_backgroundColor,
                    containerBorderRadius: themeWithDefaults.bento_containerBorderRadius,
                    containerBorder: 'none',
                    containerBorderThickness: '1px',
                    containerBorderColor: hslToCss(themeWithDefaults.borders),
                    children: [
                        {
                            id: titleId,
                            type: 'bentoTitle',
                            content: 'Características Principales',
                            styles: {
                                layout: 'fit',
                                alignment: 'center',
                                color: hslToCss(themeWithDefaults.heading),
                                fontSize: themeWithDefaults.heading1_fontSize || '2.5rem',
                                fontWeight: themeWithDefaults.heading1_fontWeight || 'bold'
                            }
                        },
                        {
                            id: feature1Id,
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

            if (selectedType === 'productDetail') {
                const productDetailId = Date.now();
                const imageId = productDetailId + 1;
                const nameId = productDetailId + 2;
                const priceId = productDetailId + 3;
                const descriptionId = productDetailId + 4;
                const buttonId = productDetailId + 5;
                const attributesId = productDetailId + 6;
                const stockId = productDetailId + 7;
                const quantityId = productDetailId + 8;

                content = {
                    children: [
                        {
                            id: imageId,
                            type: 'productDetailImage',
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
                            type: 'productDetailName',
                            content: '',
                            styles: {
                                layout: 'fit',
                                alignment: 'left',
                                color: themeWithDefaults.productDetail_titleColor || hslToCss(themeWithDefaults.heading),
                                fontSize: themeWithDefaults.productDetail_titleSize || '32px',
                                fontWeight: 'bold'
                            }
                        },
                        {
                            id: priceId,
                            type: 'productDetailPrice',
                            content: '',
                            styles: {
                                layout: 'fit',
                                alignment: 'left',
                                color: themeWithDefaults.productDetail_priceColor || hslToCss(themeWithDefaults.text),
                                fontSize: themeWithDefaults.productDetail_priceSize || '24px',
                                fontWeight: 'normal'
                            }
                        },
                        {
                            id: descriptionId,
                            type: 'productDetailDescription',
                            content: '',
                            styles: {
                                layout: 'fit',
                                alignment: 'left',
                                color: themeWithDefaults.productDetail_descriptionColor || hslToCss(themeWithDefaults.text),
                                fontSize: themeWithDefaults.productDetail_descriptionSize || '16px',
                                fontWeight: 'normal'
                            }
                        },
                        {
                            id: buttonId,
                            type: 'button',
                            content: 'Agregar al carrito',
                            styles: {
                                buttonType: 'primary',
                                layout: 'fit',
                                paddingTop: '10px',
                                paddingRight: '10px',
                                paddingBottom: '10px',
                                paddingLeft: '10px',
                                borderRadius: themeWithDefaults.primary_button_corner_radius || '4px',
                                backgroundColor: hslToCss(themeWithDefaults.primary_button_background),
                                color: hslToCss(themeWithDefaults.primary_button_text)
                            }
                        },
                        {
                            id: attributesId,
                            type: 'productDetailAttributes',
                            content: {
                                title: 'Opciones del Producto',
                            },
                            styles: {
                                titleColor: '#000000',
                                titleSize: '18px',
                                labelColor: '#666666',
                                labelSize: '14px',
                            }
                        },
                        {
                            id: stockId,
                            type: 'productDetailStock',
                            content: {
                                inStockText: 'En stock',
                                lowStockText: 'Pocas unidades',
                                outOfStockText: 'Agotado',
                                showSku: true,
                            },
                            styles: {
                                padding: '12px 16px',
                                borderRadius: '8px',
                                borderWidth: '1px',
                                inStockBgColor: '#dcfce7',
                                inStockColor: '#166534',
                                outOfStockBgColor: '#fee2e2',
                                outOfStockColor: '#991b1b',
                            }
                        },
                        {
                            id: quantityId,
                            type: 'quantitySelector',
                            content: {
                                label: 'Cantidad:',
                                showMax: true,
                            },
                            styles: {
                                labelColor: '#666666',
                                borderColor: '#d1d5db',
                                borderRadius: '6px',
                                buttonColor: '#374151',
                                inputColor: '#000000',
                            }
                        }
                    ]
                };

                const newItem = {
                    id: productDetailId,
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
                return;
            }

            if (selectedType === 'cart') {
                const cartId = Date.now();
                const itemsId = cartId + 1;
                const summaryId = cartId + 2;
                const couponId = cartId + 3;

                content = {
                    children: [
                        {
                            id: itemsId,
                            type: 'cartItems',
                            content: {
                                title: 'Tu carrito',
                                emptyMessage: 'Tu carrito está vacío',
                                showImage: true,
                                showCombination: true,
                                showStock: true,
                            },
                            styles: {
                                backgroundColor: themeWithDefaults.cart_backgroundColor || '#ffffff',
                                padding: '20px',
                                borderRadius: themeWithDefaults.cart_borderRadius || '12px',
                                titleSize: themeWithDefaults.cart_titleSize || '24px',
                                titleColor: themeWithDefaults.cart_titleColor || hslToCss(themeWithDefaults.heading),
                                imageSize: '80px',
                                rowPadding: '16px',
                                rowBorder: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
                                buttonColor: '#dc2626',
                            }
                        },

                        {
                            id: summaryId,
                            type: 'cartSummary',
                            content: {
                                title: 'Resumen del pedido',
                                showSubtotal: true,
                                showShipping: true,
                                showTax: true,
                                showDiscount: true,
                                shippingText: 'Envío',
                                taxText: 'Impuestos',
                                checkoutButtonText: 'Proceder al pago',
                            },
                            styles: {
                                backgroundColor: themeWithDefaults.checkout_backgroundColor || '#f9fafb',
                                padding: '24px',
                                borderRadius: themeWithDefaults.checkout_borderRadius || '12px',
                                borderColor: hslToCss(themeWithDefaults.borders),
                                titleSize: '20px',
                                totalFontSize: '24px',
                            }
                        },
                    ]
                };

                const newItem = {
                    id: cartId,
                    type: selectedType,
                    content,
                    styles: {
                        layoutType: 'grid',
                        maxWidth: '1200px',
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px',
                        backgroundColor: themeWithDefaults.cart_backgroundColor || '#ffffff',
                        gap: '40px',
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
            if (selectedType === 'checkout') {
                const checkoutId = Date.now();
                const discountGiftCardId = checkoutId + 1;
                const customerInfoId = checkoutId + 2;
                const summaryId = checkoutId + 3;
                const paymentId = checkoutId + 4;

                content = {
                    showAuthSection: true,
                    showDiscountSection: true,
                    children: [
                        {
                            id: discountGiftCardId,
                            type: 'checkoutDiscountGiftCard',
                            content: {
                                title: 'Descuentos y Gift Cards',
                            },
                            styles: {
                                backgroundColor: '#f8f9fa',
                                padding: '16px',
                                borderRadius: '8px'
                            }
                        },
                        {
                            id: customerInfoId,
                            type: 'customerInfo',
                            content: {
                                title: 'Información del Cliente',
                                showAddressSelector: true,
                                showShippingMethods: true,
                                showPaymentMethodsPreview: true
                            },
                            styles: {
                                backgroundColor: themeWithDefaults.checkout_backgroundColor || '#ffffff',
                                padding: '24px',
                                borderRadius: themeWithDefaults.checkout_borderRadius || '12px',
                                titleSize: '20px',
                                titleColor: themeWithDefaults.checkout_titleColor || hslToCss(themeWithDefaults.heading),
                            }
                        },
                        {
                            id: summaryId,
                            type: 'checkoutSummary',
                            content: {
                                title: 'Resumen del Pedido',
                                showSubtotal: true,
                                showShipping: true,
                                showTax: true,
                                showDiscount: true,
                                showOrderTotal: true,
                                shippingText: 'Envío',
                                taxText: 'Impuestos',
                                totalText: 'Total'
                            },
                            styles: {
                                backgroundColor: '#f9fafb',
                                padding: '24px',
                                borderRadius: '12px',
                                borderColor: '#e5e7eb',
                                titleSize: '20px',
                                totalFontSize: '24px',
                            }
                        },
                        {
                            id: paymentId,
                            type: 'checkoutPayment',
                            content: {
                                title: 'Método de Pago',
                                paymentMethods: [
                                    { id: 'cash', name: 'Efectivo', description: 'Paga al recibir' },
                                    { id: 'card', name: 'Tarjeta de Crédito/Débito', description: 'Pago seguro en línea' },
                                    { id: 'transfer', name: 'Transferencia Bancaria', description: 'Depósito bancario' }
                                ],
                                showTerms: true,
                                termsText: 'Acepto los términos y condiciones',
                                buttonText: 'Realizar Pedido'
                            },
                            styles: {
                                backgroundColor: '#ffffff',
                                padding: '24px',
                                borderRadius: '12px',
                                titleSize: '20px',
                                buttonBackgroundColor: '#3b82f6',
                                buttonColor: '#ffffff',
                                buttonBorderRadius: '8px'
                            }
                        }
                    ]
                };

                const newItem = {
                    id: checkoutId,
                    type: selectedType,
                    content,
                    styles: {
                        layoutType: 'compact', // Layout optimizado por defecto
                        maxWidth: '1200px',
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px',
                        backgroundColor: '#ffffff',
                        gap: '40px',
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
            if (selectedType === 'login') {
                const loginId = Date.now();

                content = {
                    title: 'Iniciar Sesión',
                    subtitle: 'Ingresa a tu cuenta',
                    showEmail: true,
                    showPassword: true,
                    showRemember: false,
                    rememberText: 'Recordarme',
                    buttonText: 'Iniciar Sesión',
                    showForgotPassword: true,
                    forgotPasswordText: '¿Olvidaste tu contraseña?',
                    showRegisterLink: true,
                    registerText: '¿No tienes una cuenta?',
                    registerUrl: '/registrarse'
                };

                const newItem = {
                    id: loginId,
                    type: selectedType,
                    content,
                    styles: {
                        layout: 'vertical',
                        backgroundColor: themeWithDefaults.auth_backgroundColor || '#ffffff',
                        padding: '32px',
                        borderRadius: '12px',
                        titleColor: themeWithDefaults.auth_titleColor || hslToCss(themeWithDefaults.heading),
                        titleSize: '28px',
                        subtitleColor: themeWithDefaults.auth_subtitleColor || hslToCss(themeWithDefaults.text),
                        subtitleSize: '16px',
                        buttonBackgroundColor: hslToCss(themeWithDefaults.primary_button_background),
                        buttonColor: hslToCss(themeWithDefaults.primary_button_text),
                        buttonBorderRadius: themeWithDefaults.primary_button_corner_radius || '8px',
                        maxWidth: '400px',
                        margin: '0 auto'
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

            if (selectedType === 'register') {
                const registerId = Date.now();

                content = {
                    title: 'Crear Cuenta',
                    subtitle: 'Regístrate para empezar a comprar',
                    showName: true,
                    showEmail: true,
                    showPhone: false,
                    showPassword: true,
                    showConfirmPassword: true,
                    showTerms: true,
                    termsText: 'Acepto los términos y condiciones',
                    buttonText: 'Crear Cuenta',
                    showLoginLink: true,
                    loginText: '¿Ya tienes una cuenta?',
                    loginUrl: '/iniciar-sesion'
                };

                const newItem = {
                    id: registerId,
                    type: selectedType,
                    content,
                    styles: {
                        layout: 'vertical',
                        backgroundColor: themeWithDefaults.auth_backgroundColor || '#ffffff',
                        padding: '32px',
                        borderRadius: '12px',
                        titleColor: themeWithDefaults.auth_titleColor || hslToCss(themeWithDefaults.heading),
                        titleSize: '28px',
                        subtitleColor: themeWithDefaults.auth_subtitleColor || hslToCss(themeWithDefaults.text),
                        subtitleSize: '16px',
                        buttonBackgroundColor: hslToCss(themeWithDefaults.secondary_button_background),
                        buttonColor: hslToCss(themeWithDefaults.secondary_button_text),
                        buttonBorderRadius: themeWithDefaults.secondary_button_corner_radius || '8px',
                        maxWidth: '400px',
                        margin: '0 auto'
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

            if (selectedType === 'orders') {
                const ordersId = Date.now();

                content = {
                    title: 'Mis Pedidos',
                    subtitle: '',
                    emptyTitle: 'No tienes pedidos aún',
                    emptyMessage: 'Cuando realices tu primer pedido, aparecerá aquí.',
                    shopButtonText: 'Ir a la tienda',
                    ordersPerPage: 10,
                    sortOrder: 'desc',
                    showOrderStatus: true,
                    showOrderDate: true,
                    showOrderTotal: true,
                    showItemCount: true,
                    allowExpandDetails: true
                };

                const newItem = {
                    id: ordersId,
                    type: selectedType,
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.profile_backgroundColor || '#ffffff',
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px',
                        maxWidth: '1000px',
                        borderRadius: '0px'
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

            if (selectedType === 'profile') {
                const profileId = Date.now();

                content = {
                    title: 'Mi Perfil',
                    personalInfoTitle: 'Información Personal',
                    addressesTitle: 'Direcciones de Envío',
                    giftCardsTitle: 'Mis Gift Cards',
                    loginRequiredTitle: 'Inicia sesión para ver tu perfil',
                    loginRequiredMessage: 'Necesitas iniciar sesión para acceder a tu perfil y gestionar tus datos.',
                    loginButtonText: 'Iniciar Sesión',
                    layoutType: 'tabs'
                };

                const newItem = {
                    id: profileId,
                    type: selectedType,
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.profile_backgroundColor || '#ffffff',
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px',
                        maxWidth: '1200px',
                        borderRadius: '0px',
                        titleColor: themeWithDefaults.profile_titleColor || hslToCss(themeWithDefaults.heading),
                        titleSize: '32px',
                        titleWeight: 'bold',
                        titleAlignment: 'left',
                        cardBackgroundColor: themeWithDefaults.profile_cardBackgroundColor || '#ffffff',
                        cardBorderRadius: themeWithDefaults.profile_cardBorderRadius || '12px',
                        cardBorder: `1px solid ${hslToCss(themeWithDefaults.borders)}`,
                        cardPadding: '24px'
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

            if (selectedType === 'success') {
                const successId = Date.now();

                content = {
                    title: '¡Orden Exitosa!',
                    subtitle: 'Tu orden ha sido procesada correctamente',
                    iconColor: '#10b981',
                    titleColor: hslToCss(themeWithDefaults.heading),
                    titleSize: '32px',
                    titleWeight: 'bold',
                    subtitleColor: hslToCss(themeWithDefaults.text),
                    subtitleSize: '18px',
                    showContinueShoppingButton: true,
                    continueButtonText: 'Continuar Comprando',
                    continueButtonBg: 'transparent',
                    continueButtonColor: hslToCss(themeWithDefaults.text),
                    continueButtonBorder: hslToCss(themeWithDefaults.borders),
                    showOrdersButton: true,
                    ordersButtonText: 'Ver Mis Pedidos',
                    ordersButtonBg: hslToCss(themeWithDefaults.primary_button_background),
                    ordersButtonColor: hslToCss(themeWithDefaults.primary_button_text),
                    additionalMessage: '',
                    messageBackgroundColor: hslToCss(themeWithDefaults.background),
                    messageTextColor: hslToCss(themeWithDefaults.text)
                };

                const newItem = {
                    id: successId,
                    type: selectedType,
                    content,
                    styles: {
                        backgroundColor: themeWithDefaults.background ? hslToCss(themeWithDefaults.background) : '#ffffff',
                        paddingTop: '40px',
                        paddingRight: '20px',
                        paddingBottom: '40px',
                        paddingLeft: '20px',
                        maxWidth: '1200px',
                        borderRadius: '0px'
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

            if (selectedType === 'text') {
                content = 'Nuevo texto';
                
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: {
                        color: hslToCss(themeWithDefaults.text),
                        fontSize: themeWithDefaults.paragraph_fontSize || '16px',
                        fontWeight: themeWithDefaults.paragraph_fontWeight || 'normal',
                        lineHeight: themeWithDefaults.paragraph_lineHeight || '1.6',
                        textTransform: themeWithDefaults.paragraph_textTransform || 'none',
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px',
                        backgroundColor: 'transparent'
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

            if (selectedType === 'link') {
                content = 'Nuevo enlace';
                
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: {
                        color: hslToCss(themeWithDefaults.links),
                        fontSize: themeWithDefaults.paragraph_fontSize || '16px',
                        fontWeight: themeWithDefaults.paragraph_fontWeight || 'normal',
                        textDecoration: 'underline',
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px',
                        backgroundColor: 'transparent'
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

            if (selectedType === 'video') {
                content = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                
                const newItem = {
                    id: Date.now(),
                    type: selectedType,
                    content,
                    styles: {
                        aspectRatio: '16/9',
                        borderRadius: themeWithDefaults.video_borderRadius || '0px',
                        borderWidth: themeWithDefaults.video_borderWidth || '0px',
                        borderColor: themeWithDefaults.video_borderColor || hslToCss(themeWithDefaults.borders),
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px'
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

            if (selectedType === 'pageContent') {
                content = null;
            }

            const newItem = {
                id: selectedType === 'banner' || selectedType === 'product' ? Date.now() : Date.now(),
                type: selectedType,
                content,
                styles: {
                    // Aplicar estilos por defecto del tema según el tipo de componente
                    color: selectedType === 'text' ? hslToCss(themeWithDefaults.text) : undefined,
                    fontSize: selectedType === 'text' ? themeWithDefaults.paragraph_fontSize : undefined,
                    fontWeight: selectedType === 'text' ? themeWithDefaults.paragraph_fontWeight : undefined,
                    lineHeight: selectedType === 'text' ? themeWithDefaults.paragraph_lineHeight : undefined,
                    paddingTop: '10px',
                    paddingRight: '10px',
                    paddingBottom: '10px',
                    paddingLeft: '10px',
                    backgroundColor: 'transparent'
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
                'bento', 'productCard', 'carouselCard', 'bentoFeature', 'checkout'
            ].includes(targetComponent?.type);

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
                            ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'checkout'].includes(items[i].type) &&
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
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'checkout'].includes(item.type) &&
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
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'checkout'].includes(item.type) &&
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
            'carousel', 'carouselCard', 'bento', 'bentoFeature', 'checkout'
        ].includes(overComponent?.type);

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
                targetIndex = overIndex;
            }

            // CORRECCIÓN: Validación más estricta del índice
            const maxValidIndex = overParentArray.length;
            targetIndex = Math.max(0, Math.min(targetIndex, maxValidIndex));

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
                    ['banner', 'product', 'productCard', 'carousel', 'carouselCard', 'bento', 'bentoFeature', 'checkout'].includes(item.type) &&
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
                distance: 2,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeComponent = activeId ? findActiveComponent(activeId) : null;

    const copyThemeSettings = () => {
        router.post(route('pages.copyThemeSettings', page), {}, {
            onSuccess: () => {
                toast.success("Configuración del tema copiada para personalización");
                setHasCopiedTheme(true);
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

    // Al montar el builder, evitar scroll del body y medir la altura disponible
    useEffect(() => {
        const calc = () => {
            const toolbarH = toolbarRef.current ? toolbarRef.current.offsetHeight : 64;
            setContentHeight(`${window.innerHeight - toolbarH}px`);
        };

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        calc();
        window.addEventListener('resize', calc);

        return () => {
            window.removeEventListener('resize', calc);
            document.body.style.overflow = prevOverflow || '';
        };
    }, []);

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
                            availableMenus={availableMenus || []}
                            companyLogo={companyLogo}
                            countries={countries}
                            states={states}
                            cities={cities}
                        />
                    </div>
                </div>
            ) : (
                <>
                    {/* Layout de builder */}
                    <TooltipProvider >
                        <div ref={toolbarRef} className="flex justify-between items-center px-4 py-2 border-b bg-white shadow-sm">
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

                    <div className="flex gap-2 p-2" style={{ height: contentHeight, overflow: 'hidden' }}>
                        <div className="w-80 h-full sticky top-0 bg-white p-4 rounded-lg shadow-md">
                            {editingComponent ? (
                                // MODO EDICIÓN - Mostrar formularios de edición
                                <ScrollArea className="h-full flex flex-col">
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

                                    <ScrollArea className="flex-1 px-4">
                                        <EditDialogRenderer
                                            editingComponent={editingComponent}
                                            editContent={editContent}
                                            setEditContent={setEditContent}
                                            editStyles={editStyles}
                                            setEditStyles={setEditStyles}
                                            themeSettings={themeSettings}
                                            availableMenus={availableMenus}
                                            products={products}
                                            dynamicPages={dynamicPages}
                                        />
                                    </ScrollArea>
                                </ScrollArea>
                            ) : (
                                // MODO NORMAL - Mostrar árbol de componentes
                                <>
                                    {!isPreviewMode && (
                                        <>
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
                                        <ComponentTree
                                            components={components}
                                            onEditComponent={handleEditComponent}
                                            onDeleteComponent={deleteComponent}
                                            hoveredComponentId={hoveredComponentId}
                                            setHoveredComponentId={setHoveredComponentId}
                                            onTreeChange={handleComponentsUpdate}
                                            expandedItems={expandedItems}
                                            setExpandedItems={setExpandedItems}
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
                                    <AddComponentDropdown
                                        onSelect={(selectedType) => {
                                            handleAddComponent(selectedType);
                                        }}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex-1" style={{ height: '100%', overflow: 'hidden' }}>
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
                                availableMenus={availableMenus || []}
                                companyLogo={companyLogo}
                                countries={countries}
                                states={states}
                                cities={cities}
                            />
                        </div>
                    </div>
                </>
            )}

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