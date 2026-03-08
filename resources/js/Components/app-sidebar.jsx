// resources/js/Components/app-sidebar.jsx
import * as React from "react"
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

import { NavProjects } from "@/components/nav-projects"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/Components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { NavSingle } from "./nav-single"
import { NavMain } from "@/Components/nav-main"
import { NavUser } from "@/Components/nav-user"

export function AppSidebar({ ...props }) {
  const { user, isSuperAdmin } = usePage().props.auth
  const company = usePage().props.company // Asumiendo que la compañía actual está disponible
  const env = props.env || {};


  const baseDomain = env?.SESSION_DOMAIN
    ? env.SESSION_DOMAIN.replace(/^\./, '')   // Elimina el punto inicial si existe
    : window.location.hostname.replace(/^[^.]+\./, '');

  // Construir la URL del frontend
  let frontendUrl = '#'
  if (company) {
    if (company.domain) {
      frontendUrl = `https://${company.domain}`
    } else if (company.subdomain) {
      frontendUrl = `https://${company.subdomain}.${baseDomain}`
    }
  }


  // Datos de navegación con subítems
  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    navMain: [
      {
        title: "Productos",
        url: "#",
        icon: ShoppingBag,
        items: [
          { title: "Productos", url: "products.index" },
          { title: "Colecciones", url: "collections.index" },
          { title: "Inventarios", url: "stocks.index" },
          { title: "Transferencias", url: "inventory-transfers.index" },
          { title: "Gift Cards", url: "giftCards.index" },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: Bot,
        items: [
          { title: "Usuarios", url: "user.index" },
          { title: "Clientes", url: "client.index" },
          { title: "Roles", url: "roles.index" },
        ],
      },
      {
        title: "Contenido",
        url: "",
        icon: Wallpaper,
        items: [
          // { title: "Temas", url: "pages.themes" },
          { title: "Menus", url: "menus.index" },
          { title: "Paginas", url: "pages.index" },
          { title: "Librería Media", url: "media.index" },
        ],
      },
      {
        title: "Settings",
        url: "",
        icon: Cog,
        items: [
          { title: "Configuración", url: "setting.index" },
          { title: "Políticas", url: "policy.index" },
          { title: "Tiendas", url: "stores.index" },
          { title: "Metodo de pago", url: "paymentmethod.index" },
          { title: "Impuestos", url: "tax.index" },
          { title: "Tarifa de envio", url: "shippingrate.index" },
        ],
      },
      {
        title: "Suscripciones",
        url: "#",
        icon: CreditCard,
        items: [
          { title: "Mi Suscripción", url: "subscriptions.index" },
          { title: "Historial de Pagos", url: "subscriptions.payments" },
        ],
      },
    ],
    projects: [
      { name: "Design Engineering", url: "#", icon: Frame },
      { name: "Sales & Marketing", url: "#", icon: PieChart },
      { name: "Travel", url: "#", icon: Map },
    ],
  }

  // Agregar secciones solo para super admin
  if (isSuperAdmin) {
    data.navMain.push({
      title: "Administración",
      url: "#",
      icon: Crown,
      items: [
        { title: "Dashboard Suscripciones", url: "admin.subscriptions.index" },
        { title: "Crear Suscripción", url: "admin.subscriptions.create" },
        { title: "Analytics", url: "admin.subscriptions.analytics" },
        { title: "Planes de suscripción", url: "admin.subscriptionPlan.index" },
      ],
    })

    data.navMain.push({
      title: "Locaciones",
      url: "#",
      icon: MapPinned,
      items: [
        { title: "Paises", url: "countries.index" },
        { title: "Estados", url: "states.index" },
        { title: "Ciudades", url: "cities.index" },
      ],
    })
  }

  // Datos de navegación simple (sin subítems)
  const datasingle = {
    navMain: [
      { title: "Inicio", url: "dashboard", icon: HomeIcon },
      { title: "Pedidos", url: "orders.index", icon: ShoppingBasket },
      { title: "Descuentos", url: "discounts.index", icon: BadgePercent },
      { title: "Reportes", url: "reportes.index", icon: ChartColumnBigIcon },
      {
        title: "Tienda online",
        url: "pages.themes",
        icon: ShoppingBagIcon,
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
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="mx-auto">
          <h1 className="text-xl font-bold">RUBICON</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavSingle items={datasingle.navMain} />
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}