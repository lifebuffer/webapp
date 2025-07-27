import { Check, ChevronRight, Plus } from "lucide-react"
import { useStore } from "@tanstack/react-store"
import { userStore } from "~/stores/userStore"
import { useAuth } from "~/utils/auth"
import type { Context } from "~/utils/types"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar"

export function Contexts() {
  const state = useStore(userStore)
  const { contexts, loading, error } = state
  const { isAuthenticated } = useAuth()

  // Data is now loaded at the dashboard level

  if (!isAuthenticated) {
    return null
  }

  if (loading.contexts) {
    return (
      <SidebarGroup className="py-0">
        <SidebarGroupLabel className="text-sm">
          Contexts
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="text-sm text-sidebar-muted-foreground px-2">
            Loading contexts...
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  if (error.contexts) {
    return (
      <SidebarGroup className="py-0">
        <SidebarGroupLabel className="text-sm">
          Contexts
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="text-sm text-red-500 px-2">
            {error.contexts}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <>
      <SidebarGroup className="py-0">
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroupLabel
            asChild
            className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <CollapsibleTrigger>
              Contexts{" "}
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {contexts.map((context: Context) => (
                  <SidebarMenuItem key={context.id}>
                    <SidebarMenuButton>
                      <div className="flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground">
                        {context.icon ? (
                          <span className="text-xs">{context.icon}</span>
                        ) : (
                          <Check className="size-3" />
                        )}
                      </div>
                      {context.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="text-sidebar-muted-foreground hover:text-sidebar-foreground"
                    onClick={() => {
                      // TODO: Open create context dialog
                      console.log('Create new context')
                    }}
                  >
                    <div className="flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-dashed border-sidebar-border">
                      <Plus className="size-3" />
                    </div>
                    Add Context
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>
      <SidebarSeparator className="mx-0" />
    </>
  )
}