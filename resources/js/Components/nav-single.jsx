"use client"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react";

export function NavSingle({
    items
}) {
    return (
        (
            <SidebarGroup >
                <SidebarMenu >
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} >
                            <SidebarMenuButton asChild isActive={item.isActive} >
                                <Link href={route(item.url)} className="p-0">
                                    <item.icon />{item.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

        )
    );
}
