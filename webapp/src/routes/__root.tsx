/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useStore } from "@tanstack/react-store";
import type * as React from "react";
import { AppSidebar } from "~/components/app-sidebar";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "~/components/ui/sidebar";
import appCss from "~/styles/app.css?url";
import { AuthProvider } from "~/utils/auth";
import { seo } from "~/utils/seo";
import { userStore } from "~/stores/userStore";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Lifebuffer | Your Life, Your Way",
				description:
					"Lifebuffer is a platform for tracking your life, your way.",
			}),
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
		scripts: [],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const state = useStore(userStore);
	const { selectedDate } = state;

	const formatSelectedDate = () => {
		const today = new Date().toISOString().split('T')[0];
		
		if (selectedDate === today) {
			return "Today";
		}
		
		const [year, month, day] = selectedDate.split('-').map(Number);
		const date = new Date(year, month - 1, day);
		
		// Show full date for non-today dates
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	};

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AuthProvider>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
								<SidebarTrigger className="-ml-1" />
								<Separator
									orientation="vertical"
									className="mr-2 data-[orientation=vertical]:h-4"
								/>
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbPage>{formatSelectedDate()}</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</header>
							<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
						</SidebarInset>
					</SidebarProvider>
					<TanStackRouterDevtools position="bottom-right" />
				</AuthProvider>
				<Scripts />
			</body>
		</html>
	);
}
