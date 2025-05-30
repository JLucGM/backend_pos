// import { usePage } from '@inertiajs/react';
import { AppSidebar } from "@/Components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Toaster } from "@/Components/ui/sonner";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/Components/ui/sidebar"
// import { Toaster } from "@/components/ui/sonner"

export default function AuthenticatedLayout({ header, children }) {
  // const user = usePage().props.auth.user;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-gray-100 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 bg-gray-100 px-4">
            <SidebarTrigger className="-ml-1" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="bg-gray-100 h-screen">
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
