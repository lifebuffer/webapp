import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Clock, FileText } from "lucide-react";
import * as React from "react";
import { ActivityModal } from "~/components/activity-modal";
import { EditableMarkdown } from "~/components/editable-markdown";
import { RequireAuth } from "~/components/require-auth";
import { getTodayString } from "~/utils/date";
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
	const {
		currentDay,
		activities,
		loading,
		error,
		selectedDate,
		selectedContextId,
	} = state;

	const [selectedActivity, setSelectedActivity] =
		React.useState<Activity | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	// Filter activities by selected context
	const filteredActivities = React.useMemo(() => {
		if (selectedContextId === null) {
			return activities; // Show all activities
		}
		return activities.filter(
			(activity) => activity.context_id === selectedContextId,
		);
	}, [activities, selectedContextId]);

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

	const handleActivityClick = (activity: Activity) => {
		setSelectedActivity(activity);
		setIsModalOpen(true);
	};

	const handleDayNotesUpdate = async (content: string) => {
		if (!currentDay) return;
		await userActions.updateDay(currentDay.date, { notes: content });
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
									const today = getTodayString();
									return selectedDate === today ? "Today's Notes" : "Notes";
								})()}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<EditableMarkdown
								content={currentDay.notes || ""}
								placeholder="Click to add notes..."
								onSave={handleDayNotesUpdate}
							/>
						</CardContent>
					</Card>
				)}

				{/* Activities Section */}
				<Card>
					<CardHeader>
						<CardTitle>Activities</CardTitle>
						<CardDescription>
							{filteredActivities.length}{" "}
							{filteredActivities.length === 1 ? "activity" : "activities"}
							{(() => {
								const today = getTodayString();
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
						) : filteredActivities.length === 0 ? (
							<div className="flex items-center justify-center py-8">
								<p className="text-sm text-muted-foreground">
									{selectedContextId === null
										? `No activities${selectedDate === getTodayString() ? " yet today" : " for this date"}.`
										: "No activities found for the selected context."}
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{filteredActivities.map((activity) => (
									// biome-ignore lint/a11y/useSemanticElements: <TODO: fix this>
									<div
										key={activity.id}
										role="button"
										tabIndex={0}
										className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
										onClick={() => handleActivityClick(activity)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												handleActivityClick(activity);
											}
										}}
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

				<ActivityModal
					activity={selectedActivity}
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
				/>
			</div>
		</RequireAuth>
	);
}
