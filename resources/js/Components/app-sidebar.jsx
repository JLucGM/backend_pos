import * as React from "react"
import {
  AudioWaveform,
  // BookOpen,
  Bot,
  Cog,
  Command,
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
  // SquareTerminal,
} from "lucide-react"

// import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/Components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { NavSingle } from "./nav-single"
import { NavMain } from "@/Components/nav-main"

export function AppSidebar({
  ...props
}) {
  const user = usePage().props.auth.user;
  // This is sample data.d
  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Inventario",
        url: "#",
        icon: ShoppingBag,
        items: [
          {
            title: "Productos",
            url: "products.index",
          },
          {
            title: "Categoria",
            url: "category.index",
          },
          {
            title: "Inventarios",
            url: "stocks.index",
          },
        ],
      },
      {
        title: "Usuarios",
        url: "#",
        icon: Bot,
        items: [
          {
            title: "Staff",
            url: "user.index",
          },
          {
            title: "Clientes",
            url: "clients.index",
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
            title: "Tiendas",
            url: "stores.index",
          },
          {
            title: "Metodo de pago",
            url: "paymentmethod.index",
          },
          // {
          //   title: "Taxes",
          //   url: "tax.index",
          // },
        ],
      },
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "General",
      //       url: "#",
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //     },
      //   ],
      // },
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
      
    ],
  }

  return (
    (<Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
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
