import type * as React from "react";

import { Calendars } from "~/components/calendars";
import { DatePicker } from "~/components/date-picker";
import { NavUser } from "~/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarSeparator,
} from "~/components/ui/sidebar";

// This is sample data.
const data = {
	calendars: [
		{
			name: "Contexts",
			items: ["Personal", "Work", "Family"],
		},
	],
};

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
				<Calendars calendars={data.calendars} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
