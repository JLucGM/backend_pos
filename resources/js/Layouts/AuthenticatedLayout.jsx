// import { usePage } from '@inertiajs/react';
import { AppSidebar } from "@/Components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Toaster } from "@/Components/ui/sonner";
import { NavUser } from "@/Components/nav-user";
import { usePermission } from "@/hooks/usePermission";
import { Separator } from "@/Components/ui/separator";

export default function AuthenticatedLayout({ header, children }) {
  const { user } = usePermission();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-gray-100 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 pr-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex items-center gap-2">
            <NavUser user={{
              name: user?.name,
              email: user?.email,
              avatar: user?.avatar,
            }} />
          </div>
        </header>

        <div className="bg-gray-100 h-full ">
          <main className='bg-gray-100 px-5 md:px-16'>
            {header && (
              <header className="bg-gray-100  dark:bg-gray-800">
                <div className="mb-5 ">
                  {header}
                </div>
              </header>
            )}
            {children}
          </main>
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}
