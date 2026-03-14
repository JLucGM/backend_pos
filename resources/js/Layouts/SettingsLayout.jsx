import { Head, usePage, Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Cog, ShieldCheck, Store, CreditCard, Receipt, Truck, HomeIcon, Users, UserCog } from "lucide-react"; // Importar Users y UserCog
import { NavUser } from "@/Components/nav-user";
import { NavSingle } from "@/Components/nav-single";
import { usePermission } from "@/hooks/usePermission";
import { Toaster } from "@/Components/ui/sonner";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarProvider,
    SidebarRail,
    SidebarInset,
    SidebarTrigger
} from "@/Components/ui/sidebar";

export default function SettingsLayout({ children }) {
    const { user, can } = usePermission();
    const { url } = usePage();

    const navItems = [
        { title: "Volver al Panel", url: 'dashboard', icon: HomeIcon },
        { title: "General", url: 'setting.index', icon: Cog, isActive: url.includes('/setting'), permission: 'admin.setting.index' },
        { title: "Políticas", url: 'policy.index', icon: ShieldCheck, isActive: url.includes('/policy'), permission: 'admin.pages.index' },
        { title: "Tiendas", url: 'stores.index', icon: Store, isActive: url.includes('/stores'), permission: 'admin.stores.index' },
        { title: "Usuarios", url: 'user.index', icon: Users, isActive: url.includes('/users'), permission: 'admin.user.index' },
        { title: "Roles", url: 'roles.index', icon: UserCog, isActive: url.includes('/roles'), permission: 'admin.roles.index' },
        { title: "Métodos de Pago", url: 'paymentmethod.index', icon: CreditCard, isActive: url.includes('/paymentmethod'), permission: 'admin.paymentmethod.index' },
        { title: "Impuestos", url: 'tax.index', icon: Receipt, isActive: url.includes('/tax'), permission: 'admin.tax.index' },
        { title: "Tarifas de Envío", url: 'shippingrate.index', icon: Truck, isActive: url.includes('/shippingRate'), permission: 'admin.shippingRate.index' },
    ];
    const filteredItems = navItems.filter(item => !item.permission || can(item.permission));

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-4">
                        <Link href={route('dashboard')}>
                            <ApplicationLogo className="h-10 w-auto" />
                        </Link>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <NavSingle items={filteredItems} />
                </SidebarContent>

                {/* <SidebarFooter>
                    <NavUser user={{
                        name: user?.name,
                        email: user?.email,
                        avatar: user?.avatar,
                    }} />
                </SidebarFooter> */}
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 bg-gray-100 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 pr-4">
                    <div className="flex items-center gap-2 bg-gray-100 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                    <div className="flex items-center gap-2">
                        <NavUser user={{
                            name: user?.name,
                            email: user?.email,
                            avatar: user?.avatar,
                        }} />
                    </div>
                </header>

                <main className="bg-gray-100 px-5 md:px-16 h-full">
                    {/* <div className="max-w-5xl mx-auto py-12 px-8"> */}
                    {children}
                    {/* </div> */}
                    <Toaster />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
