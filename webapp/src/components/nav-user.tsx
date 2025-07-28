import { BadgeCheck, ChevronsUpDown, LogOut, Settings, Palette } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

// biome-ignore lint/correctness/noUnusedImports: <TODO>
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "~/components/ui/sidebar";
import { useAuth } from "~/utils/auth";
import { userStore } from "~/stores/userStore";
import { useTheme } from "~/components/theme-provider";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { logout } = useAuth();
	const { user } = useStore(userStore);
	const { setTheme } = useTheme();

	return (
		<>
			{user && (
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										{/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
										<AvatarFallback className="rounded-lg">
											{user.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align="start"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											{/* <AvatarImage src={user.avatar} alt={user.name} /> */}
											<AvatarFallback className="rounded-lg">
												{user.name.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{user.name}
											</span>
											<span className="truncate text-xs">{user.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{/* <DropdownMenuGroup>
									<DropdownMenuItem>
										<Sparkles />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup> */}
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link to="/settings" className="flex items-center">
											<BadgeCheck />
											Account
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<Palette />
											Theme
										</DropdownMenuSubTrigger>
										<DropdownMenuSubContent>
											<DropdownMenuItem onClick={() => setTheme("light")}>
												Light
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setTheme("dark")}>
												Dark
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setTheme("system")}>
												System
											</DropdownMenuItem>
										</DropdownMenuSubContent>
									</DropdownMenuSub>
									{/* <DropdownMenuItem>
										<CreditCard />
										Billing
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Bell />
										Notifications
									</DropdownMenuItem> */}
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout}>
									<LogOut />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			)}
		</>
	);
}
