import type * as React from "react";
import { Link } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { Contexts } from "~/components/contexts";
import { DatePicker } from "~/components/date-picker";
import { NavUser } from "~/components/nav-user";
import { Button } from "~/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
			<SidebarFooter className="border-t border-sidebar-border p-4">
				<Link to="/export" className="w-full">
					<Button className="w-full bg-primary hover:bg-primary/90">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</Link>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
