// components/BuilderPages/AddComponentDropdown.jsx
import React, { useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Type, Image, Layout, PanelTop, PanelBottom, DivideIcon, Megaphone, Package, Grid, ShoppingCart, CreditCard, User, Users, CheckCircle, FileText, Link as LinkIcon, Video, TrendingUp, Grid3x3, Layers, Bell, PlusCircle } from 'lucide-react';
import { ScrollArea } from "@/Components/ui/scroll-area";

// Definir todos los componentes organizados por categorías
const ALL_COMPONENTS = [
  // Estructura
  {
    type: 'header',
    label: 'Header',
    category: 'structure',
    icon: <PanelTop className="h-4 w-4" />,
    description: 'Encabezado de la página'
  },
  {
    type: 'footer',
    label: 'Footer',
    category: 'structure',
    icon: <PanelBottom className="h-4 w-4" />,
    description: 'Pie de página'
  },
  {
    type: 'container',
    label: 'Contenedor',
    category: 'structure',
    icon: <Layers className="h-4 w-4" />,
    description: 'Contenedor para organizar elementos'
  },
  {
    type: 'divider',
    label: 'Divider (Línea)',
    category: 'structure',
    icon: <DivideIcon className="h-4 w-4" />,
    description: 'Línea divisoria'
  },
  {
    type: 'announcementBar',
    label: 'Barra de Anuncios',
    category: 'structure',
    icon: <Bell className="h-4 w-4" />,
    description: 'Barra para anuncios o promociones'
  },
  {
    type: 'pageContent',
    label: 'Contenido de Página',
    category: 'structure',
    icon: <FileText className="h-4 w-4" />,
    description: 'Contenido dinámico de la página'
  },

  // Contenido
  {
    type: 'text',
    label: 'Texto',
    category: 'content',
    icon: <Type className="h-4 w-4" />,
    description: 'Bloque de texto'
  },
  {
    type: 'heading',
    label: 'Encabezado',
    category: 'content',
    icon: <Type className="h-4 w-4" />,
    description: 'Título o subtítulo'
  },
  {
    type: 'image',
    label: 'Imagen',
    category: 'content',
    icon: <Image className="h-4 w-4" />,
    description: 'Imagen o gráfico'
  },
  {
    type: 'button',
    label: 'Botón',
    category: 'content',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Botón interactivo'
  },
  {
    type: 'link',
    label: 'Enlace',
    category: 'content',
    icon: <LinkIcon className="h-4 w-4" />,
    description: 'Enlace de navegación'
  },
  {
    type: 'marquee',
    label: 'Texto en Movimiento',
    category: 'content',
    icon: <Type className="h-4 w-4" />,
    description: 'Texto que se desplaza'
  },
  {
    type: 'video',
    label: 'Video',
    category: 'content',
    icon: <Video className="h-4 w-4" />,
    description: 'Reproductor de video'
  },

  // Productos
  {
    type: 'product',
    label: 'Productos',
    category: 'products',
    icon: <Grid className="h-4 w-4" />,
    description: 'Grid de productos'
  },
  {
    type: 'productList',
    label: 'Lista de Productos',
    category: 'products',
    icon: <Grid3x3 className="h-4 w-4" />,
    description: 'Lista de productos con paginación y filtros'
  },
  {
    type: 'productDetail',
    label: 'Detalle de Producto',
    category: 'products',
    icon: <Package className="h-4 w-4" />,
    description: 'Página individual de producto'
  },
  {
    type: 'carousel',
    label: 'Carrusel',
    category: 'products',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Carrusel de productos'
  },
  {
    type: 'cart',
    label: 'Carrito',
    category: 'products',
    icon: <ShoppingCart className="h-4 w-4" />,
    description: 'Carrito de compras'
  },
  {
    type: 'checkout',
    label: 'Checkout',
    category: 'products',
    icon: <CreditCard className="h-4 w-4" />,
    description: 'Finalización de compra'
  },

  // Layouts
  {
    type: 'banner',
    label: 'Banner',
    category: 'layouts',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Banner promocional'
  },
  {
    type: 'bento',
    label: 'Bento',
    category: 'layouts',
    icon: <Grid3x3 className="h-4 w-4" />,
    description: 'Layout Bento'
  },

  // Autenticación
  {
    type: 'login',
    label: 'Login',
    category: 'auth',
    icon: <User className="h-4 w-4" />,
    description: 'Formulario de inicio de sesión'
  },
  {
    type: 'register',
    label: 'Registro',
    category: 'auth',
    icon: <Users className="h-4 w-4" />,
    description: 'Formulario de registro'
  },
  {
    type: 'profile',
    label: 'Perfil',
    category: 'auth',
    icon: <User className="h-4 w-4" />,
    description: 'Perfil de usuario'
  },
  {
    type: 'orders',
    label: 'Pedidos',
    category: 'auth',
    icon: <ShoppingCart className="h-4 w-4" />,
    description: 'Historial de pedidos'
  },
  {
    type: 'success',
    label: 'Página de Éxito',
    category: 'auth',
    icon: <CheckCircle className="h-4 w-4" />,
    description: 'Confirmación de éxito'
  },
];

// Categorías para agrupar
const CATEGORIES = [
  { id: 'structure', label: 'Estructura', icon: <Layout className="h-4 w-4" /> },
  { id: 'content', label: 'Contenido', icon: <Type className="h-4 w-4" /> },
  { id: 'products', label: 'Productos', icon: <Package className="h-4 w-4" /> },
  { id: 'layouts', label: 'Layouts', icon: <Grid3x3 className="h-4 w-4" /> },
  { id: 'auth', label: 'Autenticación', icon: <User className="h-4 w-4" /> },
];

const AddComponentDropdown = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar componentes basado en la búsqueda
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) {
      // Si no hay búsqueda, agrupar por categoría
      return CATEGORIES.map(category => ({
        ...category,
        components: ALL_COMPONENTS.filter(comp => comp.category === category.id)
      })).filter(category => category.components.length > 0);
    }

    const query = searchQuery.toLowerCase();
    const filtered = ALL_COMPONENTS.filter(comp =>
      comp.label.toLowerCase().includes(query) ||
      comp.type.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query)
    );

    // Agrupar resultados filtrados por categoría
    const grouped = CATEGORIES.map(category => ({
      ...category,
      components: filtered.filter(comp => comp.category === category.id)
    })).filter(category => category.components.length > 0);

    return grouped;
  }, [searchQuery]);

  const handleSelect = (type) => {
    onSelect(type);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" variant="outline">
          <PlusCircle size={16} className="mr-2" />
          Agregar Componente
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar componentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="h-[350px]">
          <div className="p-2">
            {filteredComponents.length > 0 ? (
              filteredComponents.map((category, index) => (
                <React.Fragment key={category.id}>
                  <DropdownMenuLabel className="flex items-center gap-2 p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category.icon}
                    <span>{category.label}</span>
                  </DropdownMenuLabel>
                  {category.components.map((component) => (
                    <DropdownMenuItem
                      key={component.type}
                      onClick={() => handleSelect(component.type)}
                      className="flex items-center gap-3 p-2 cursor-pointer"
                    >
                      <div className="text-muted-foreground">
                        {component.icon}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="font-medium text-sm">
                          {component.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {component.description}
                        </span>
                      </div>
                      {/* <span className="text-xs text-muted-foreground capitalize">
                        {component.type}
                      </span> */}
                    </DropdownMenuItem>
                  ))}
                  {index < filteredComponents.length - 1 && (
                    <DropdownMenuSeparator />
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No se encontraron componentes
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* <div className="p-3 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground text-center">
            {filteredComponents.flatMap(c => c.components).length} componentes disponibles
          </div>
        </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddComponentDropdown;