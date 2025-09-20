import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Download, Keyboard } from "lucide-react";

import { Contexts } from "~/components/contexts";
import { DatePicker } from "~/components/date-picker";
import { KeyboardShortcutsModal } from "~/components/keyboard-shortcuts-modal";
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
	const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = React.useState(false);

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
			<SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
				<Link to="/export" className="w-full">
					<Button className="w-full bg-primary hover:bg-primary/90">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>
				</Link>
				<Button
					variant="outline"
					className="w-full"
					onClick={() => setIsKeyboardShortcutsOpen(true)}
				>
					<Keyboard className="mr-2 h-4 w-4" />
					Keyboard shortcuts
				</Button>
			</SidebarFooter>
			<SidebarRail />

			{/* Keyboard Shortcuts Modal */}
			<KeyboardShortcutsModal
				open={isKeyboardShortcutsOpen}
				onOpenChange={setIsKeyboardShortcutsOpen}
			/>
		</Sidebar>
	);
}
