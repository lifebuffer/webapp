import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Clock, FileText } from "lucide-react";
import * as React from "react";
import { RequireAuth } from "~/components/require-auth";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { userActions, userStore } from "~/stores/userStore";
import { useAuth } from "~/utils/auth";
import type { Activity } from "~/utils/types";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { isAuthenticated } = useAuth();
	const state = useStore(userStore);
	const { currentDay, activities, loading, error, selectedDate } = state;

	React.useEffect(() => {
		// Fetch data for the selected date when the dashboard loads and user is authenticated
		if (isAuthenticated && selectedDate) {
			userActions.fetchDayData(selectedDate);
		}
	}, [isAuthenticated, selectedDate]);

	React.useEffect(() => {
		// Fetch recent days in the background after authentication
		if (isAuthenticated) {
			// Small delay to let the initial load complete first
			setTimeout(() => {
				userActions.fetchRecentDays();
			}, 1000);
		}
	}, [isAuthenticated]);

	const getStatusBadgeVariant = (status: Activity["status"]) => {
		switch (status) {
			case "done":
				return "default";
			case "in_progress":
				return "secondary";
			case "new":
				return "outline";
			default:
				return "outline";
		}
	};

	const formatTime = (minutes: number | null) => {
		if (!minutes) return null;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	return (
		<RequireAuth>
			<div className="space-y-6">
				{/* Day Notes Section */}
				{currentDay && (
					<Card>
						<CardHeader>
							<CardTitle>
								{(() => {
									const today = new Date().toISOString().split('T')[0];
									return selectedDate === today ? "Today's Notes" : "Notes";
								})()}
							</CardTitle>
							<CardDescription>
								{(() => {
									// Parse the date string as local date instead of UTC
									const [year, month, day] = currentDay.date
										.split("-")
										.map(Number);
									const localDate = new Date(year, month - 1, day);
									return localDate.toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									});
								})()}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{currentDay.notes ? (
								<p className="text-sm text-muted-foreground whitespace-pre-wrap">
									{currentDay.notes}
								</p>
							) : (
								<p className="text-sm text-muted-foreground italic">
									No notes for today yet.
								</p>
							)}
						</CardContent>
					</Card>
				)}

				{/* Activities Section */}
				<Card>
					<CardHeader>
						<CardTitle>Activities</CardTitle>
						<CardDescription>
							{activities.length}{" "}
							{activities.length === 1 ? "activity" : "activities"}
							{(() => {
								const today = new Date().toISOString().split('T')[0];
								return selectedDate === today ? " for today" : "";
							})()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{loading.todayData ? (
							<div className="flex items-center justify-center py-8">
								<p className="text-sm text-muted-foreground">
									Loading activities...
								</p>
							</div>
						) : error.todayData ? (
							<div className="flex items-center justify-center py-8">
								<p className="text-sm text-destructive">{error.todayData}</p>
							</div>
						) : activities.length === 0 ? (
							<div className="flex items-center justify-center py-8">
								<p className="text-sm text-muted-foreground">
									No activities{selectedDate === new Date().toISOString().split('T')[0] ? " yet today" : " for this date"}.
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{activities.map((activity) => (
									<div
										key={activity.id}
										className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
									>
										{/* Status Badge */}
										<Badge
											className="w-24 text-center flex items-center justify-center"
											variant={getStatusBadgeVariant(activity.status)}
										>
											{activity.status.replace("_", " ")}
										</Badge>

										{/* Context */}
										{activity.context && (
											<Badge
												variant="outline"
												className="text-center flex items-center justify-center"
											>
												{activity.context.icon}
											</Badge>
										)}

										{/* Title */}
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{activity.title}</p>
										</div>

										{/* Time */}
										{activity.time && (
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{formatTime(activity.time)}</span>
											</div>
										)}

										{/* Notes Indicator */}
										{activity.notes && (
											<div className="text-muted-foreground">
												<FileText className="h-4 w-4" />
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</RequireAuth>
	);
}
