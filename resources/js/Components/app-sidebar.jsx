// resources/js/Components/app-sidebar.jsx
import * as React from "react"
import ApplicationLogo from "@/Components/ApplicationLogo"
import {
  AudioWaveform,
  BadgePercent,
  Bot,
  ChartColumnBigIcon,
  Cog,
  Command,
  CreditCard,
  Crown,
  ExternalLink,
  Eye,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  MapPinned,
  PieChart,
  ShoppingBag,
  ShoppingBagIcon,
  ShoppingBasket,
  Wallpaper,
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/Components/ui/sidebar"
import { usePage, Link } from "@inertiajs/react"
import { NavSingle } from "./nav-single"
import { NavMain } from "@/Components/nav-main"
import { usePermission } from "@/hooks/usePermission"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { ChevronUp } from "lucide-react"

export function AppSidebar({ ...props }) {
  const { user, isSuperAdmin, can } = usePermission()
  const { url, props: pageProps } = usePage(); // Obtener la URL actual y props de Inertia
  const company = pageProps.company
  const env = pageProps.env || {};

  const baseDomain = env?.SESSION_DOMAIN
    ? env.SESSION_DOMAIN.replace(/^\./, '')
    : window.location.hostname.replace(/^[^.]+\./, '');

  let frontendUrl = '#'
  if (company) {
    if (company.domain) {
      frontendUrl = `https://${company.domain}`
    } else if (company.subdomain) {
      frontendUrl = `https://${company.subdomain}.${baseDomain}`
    }
  }

  // Datos de navegación con subítems
  const navData = {
    navMain: [
      {
        title: "Productos",
        url: "#",
        icon: ShoppingBag,
        items: [
          { title: "Productos", url: "products.index", permission: "admin.products.index" },
          { title: "Colecciones", url: "collections.index", permission: "admin.collections.index" },
          { title: "Inventarios", url: "stocks.index", permission: "admin.products.index" },
          { title: "Transferencias", url: "inventory-transfers.index", permission: "admin.inventory-transfers.index" },
          { title: "Gift Cards", url: "giftCards.index", permission: "admin.giftCards.index" },
        ],
      },
      {
        title: "Contenido",
        url: "",
        icon: Wallpaper,
        items: [
          { title: "Menus", url: "menus.index", permission: "admin.menus.index" },
          { title: "Paginas", url: "pages.index", permission: "admin.pages.index" },
          { title: "Librería Media", url: "media.index", permission: "admin.media.index" },
        ],
      },
      {
        title: "Suscripciones",
        url: "#",
        icon: CreditCard,
        items: [
          { title: "Facturación", url: "subscriptions.management" },
          { title: "Planes", url: "subscriptions.index" },
          { title: "Historial de Pagos", url: "subscriptions.payments" },
        ],
      },
      // ✅ SECCIÓN EXCLUSIVA DE SUPER ADMIN
      {
        title: "Administración",
        url: "#",
        icon: Crown,
        onlySuperAdmin: true,
        items: [
          { title: "Dashboard Suscripciones", url: "admin.subscriptions.index" },
          { title: "Crear Suscripción", url: "admin.subscriptions.create" },
          { title: "Analytics", url: "admin.subscriptions.analytics" },
          { title: "Planes de suscripción", url: "admin.subscriptionPlan.index" },
        ],
      },
      // ✅ SECCIÓN EXCLUSIVA DE SUPER ADMIN
      {
        title: "Locaciones",
        url: "#",
        icon: MapPinned,
        onlySuperAdmin: true,
        items: [
          { title: "Paises", url: "countries.index" },
          { title: "Estados", url: "states.index" },
          { title: "Ciudades", url: "cities.index" },
        ],
      },
    ],
  }

  const settingsData = {
    title: "Settings",
    icon: Cog,
    items: [
      { title: "Configuración", url: "setting.index", permission: "admin.setting.index" },
      { title: "Políticas", url: "policy.index", permission: "admin.pages.index" },
      { title: "Tiendas", url: "stores.index", permission: "admin.stores.index" },
      { title: "Metodo de pago", url: "paymentmethod.index", permission: "admin.paymentmethod.index" },
      { title: "Impuestos", url: "tax.index", permission: "admin.tax.index" },
      { title: "Tarifa de envio", url: "shippingrate.index", permission: "admin.shippingRate.index" },
    ],
  }

  const singleData = [
    { title: "Inicio", url: "dashboard", icon: HomeIcon },
    { title: "Pedidos", url: "orders.index", icon: ShoppingBasket, permission: "admin.orders.index" },
    { title: "Clientes", url: "client.index", icon: Bot, permission: "admin.client.index" },
    { title: "Descuentos", url: "discounts.index", icon: BadgePercent, permission: "admin.discount.index" },
    { title: "Reportes", url: "reports.index", icon: ChartColumnBigIcon, permission: "admin.reports.index" },
    {
      title: "Tienda online",
      url: "pages.themes",
      icon: ShoppingBagIcon,
      permission: "admin.pages.index",
      action: (
        <a
          href={frontendUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="h-4 w-4" />
        </a>
      ),
    },
  ]

  // Lógica de filtrado y detección de estado activo
  const filteredNavMain = navData.navMain.map(category => {
    // 1. Si es solo para Super Admin y el usuario no lo es, ocultar
    if (category.onlySuperAdmin && !isSuperAdmin) return null;

    // 2. Filtrar subítems por permisos
    if (category.items) {
      const visibleItems = category.items.filter(item =>
        !item.permission || can(item.permission)
      ).map(item => {
        // Detectar si el subítem está activo
        const itemUrl = route(item.url);
        const isActive = url === new URL(itemUrl).pathname || url.startsWith(new URL(itemUrl).pathname + '/');
        return { ...item, isActive };
      });

      // Si una categoría normal se queda sin ítems, ocultarla
      if (visibleItems.length === 0) return null;

      // La categoría está abierta (isActive) si alguno de sus subítems está activo
      const hasActiveChild = visibleItems.some(item => item.isActive);
      return { ...category, items: visibleItems, isActive: hasActiveChild };
    }

    return category;
  }).filter(Boolean);

  // Filtrar ítems simples y detectar activos
  const filteredNavSingle = singleData.filter(item =>
    !item.permission || can(item.permission)
  ).map(item => {
    const itemUrl = route(item.url);
    const itemPath = new URL(itemUrl).pathname;

    // Regresa true solo si la URL es idéntica para dashboard, o si empieza por la ruta para el resto
    const isActive = item.url === 'dashboard'
      ? url === itemPath
      : (url === itemPath || url.startsWith(itemPath + '/'));

    return { ...item, isActive };
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center py-4">
          <Link href={route('dashboard')}>
            <ApplicationLogo className="h-10 w-auto" />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavSingle items={filteredNavSingle} />
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={settingsData.title}>
              <Link href={route('setting.index')}>
                <settingsData.icon />
                <span>{settingsData.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
