import * as React from "react"
import {
  AudioWaveform,
  BadgePercent,
  // BookOpen,
  Bot,
  ChartColumnBigIcon,
  Cog,
  Command,
  CreditCard,
  Crown,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  Map,
  // MapPin,
  MapPinned,
  PieChart,
  // Settings2,
  ShoppingBag,
  ShoppingBasket,
  Wallpaper,
  // SquareTerminal,
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
// import { NavUser } from "@/components/nav-user"
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

export function AppSidebar({
  ...props
}) {
  const user = usePage().props.auth.user;
  const userRoles = user.roles || [];
  const isSuperAdmin = userRoles.some(role => role.name === 'super admin');

  // This is sample data.d
  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    // teams: [
    //   {
    //     name: "Acme Inc",
    //     logo: GalleryVerticalEnd,
    //     plan: "Enterprise",
    //   },
    //   {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    //   },
    //   {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    //   },
    // ],
    navMain: [
      {
        title: "Productos",
        url: "#",
        icon: ShoppingBag,
        items: [
          {
            title: "Productos",
            url: "products.index",
          },
          // {
          //   title: "Categoria",
          //   url: "category.index",
          // },
          {
            title: "Inventarios",
            url: "stocks.index",
          },
          {
            title: "Transferencias",
            url: "inventory-transfers.index",
          },
          {
            title: "Gift Cards",
            url: "giftCards.index",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Usuarios",
            url: "user.index",
          },
          {
            title: "Clientes",
            url: "client.index",
          },
        ],
      },
      {
        title: "Tienda Online",
        url: "",
        icon: Wallpaper,
        // isActive: true,
        items: [
          {
            title: "Temas",
            url: "pages.themes",
          },
          {
            title: "Menus",
            url: "menus.index",
          },
          {
            title: "Paginas",
            url: "pages.index",
          },

        ],
      },
      {
        title: "Settings",
        url: "",
        icon: Cog,
        // isActive: true,
        items: [
          {
            title: "Configuración",
            url: "setting.index",
          },
          {
            title: "Políticas",
            url: "policy.index",
          },
          {
            title: "Tiendas",
            url: "stores.index",
          },
          {
            title: "Metodo de pago",
            url: "paymentmethod.index",
          },
          {
            title: "Impuestos",
            url: "tax.index",
          },
          {
            title: "Tarifa de envio",
            url: "shippingrate.index",
          },
        ],
      },
      {
        title: "Suscripciones",
        url: "#",
        icon: CreditCard,
        items: [
          {
            title: "Mi Suscripción",
            url: "subscriptions.index",
          },
          {
            title: "Historial de Pagos",
            url: "subscriptions.payments",
          },
        ],
      },

    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }

  // Agregar sección de administración solo para super admins
  if (isSuperAdmin) {
    data.navMain.push({
      title: "Administración",
      url: "#",
      icon: Crown,
      items: [
        {
          title: "Dashboard Suscripciones",
          url: "admin.subscriptions.index",
        },
        {
          title: "Crear Suscripción",
          url: "admin.subscriptions.create",
        },
        {
          title: "Analytics",
          url: "admin.subscriptions.analytics",
        },
        {
          title: "Planes de suscripción",
          url: "admin.subscriptionPlan.index",
        },
      ],
    },
      {
        title: "Locaciones",
        url: "#",
        icon: MapPinned,
        items: [
          {
            title: "Paises",
            url: "countries.index",
          },
          {
            title: "Estados",
            url: "states.index",
          },
          {
            title: "Ciudades",
            url: "cities.index",
          },
        ],
      },);
  }

  const datasingle = {
    navMain: [
      {
        title: "Inicio",
        url: "dashboard",
        icon: HomeIcon,
      },
      {
        title: "Pedidos",
        url: "orders.index",
        icon: ShoppingBasket,
      },
      {
        title: "Descuentos",
        url: "discounts.index",
        icon: BadgePercent,
      },
      {
        title: "Reportes",
        url: "reportes.index",
        icon: ChartColumnBigIcon,
      },

    ],
  }

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher 
        teams={data.teams} 
        /> */}
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
    </Sidebar>)
  );
}
