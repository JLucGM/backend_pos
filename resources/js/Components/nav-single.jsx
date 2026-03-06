// resources/js/Components/nav-single.jsx
"use client"

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react"

// NavSingle.jsx (ya está correcto, pero por si acaso)
export function NavSingle({ items }) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="flex items-center">
                        <SidebarMenuButton asChild isActive={item.isActive} className="flex-1">
                            <Link href={route(item.url)}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {item.action && (
                            <div className="ml-auto px-2" onClick={(e) => e.stopPropagation()}>
                                {item.action}
                            </div>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}