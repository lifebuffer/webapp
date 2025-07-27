import type * as React from "react";

import { Contexts } from "~/components/contexts";
import { DatePicker } from "~/components/date-picker";
import { NavUser } from "~/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarSeparator,
} from "~/components/ui/sidebar";

export function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar> & {}) {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="h-16 border-b border-sidebar-border">
				<NavUser />
			</SidebarHeader>
			<SidebarContent>
				<DatePicker />
				<SidebarSeparator className="mx-0" />
				<Contexts />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
