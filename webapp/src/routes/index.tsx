import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Clock, FileText, Keyboard, Mic, Play, Plus } from "lucide-react";
import * as React from "react";
import { ActivityModal } from "~/components/activity-modal";
import { DeleteActivityModal } from "~/components/delete-activity-modal";
import { EditableMarkdown } from "~/components/editable-markdown";
import { RequireAuth } from "~/components/require-auth";
import { TimerModal } from "~/components/timer-modal";
import { VoiceRecordingModal } from "~/components/voice-recording-modal";
import { getTodayString } from "~/utils/date";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
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
		selectedActivityId,
	} = state;

	const [selectedActivity, setSelectedActivity] =
		React.useState<Activity | null>(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
	const [isVoiceModalOpen, setIsVoiceModalOpen] = React.useState(false);
	const [isTimerModalOpen, setIsTimerModalOpen] = React.useState(false);
	const [timerActivity, setTimerActivity] = React.useState<Activity | null>(null);
	const [activityToDelete, setActivityToDelete] = React.useState<Activity | null>(null);

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

	// Check if any modal is open
	const isAnyModalOpen = isModalOpen || isCreateModalOpen || isDeleteModalOpen || isVoiceModalOpen || isTimerModalOpen;

	// Register keyboard shortcuts - only when no modals are open
	useKeyboardShortcuts([
		{
			key: 'c',
			handler: () => {
				if (!isAnyModalOpen) {
					setIsCreateModalOpen(true);
				}
			},
		},
		{
			key: 'v',
			handler: () => {
				if (!isAnyModalOpen) {
					setIsVoiceModalOpen(true);
				}
			},
		},
		{
			key: 't',
			handler: () => {
				if (!isAnyModalOpen && selectedActivityId) {
					const activity = filteredActivities.find(a => a.id === selectedActivityId);
					if (activity) {
						setTimerActivity(activity);
						setIsTimerModalOpen(true);
					}
				}
			},
		},
		{
			key: 'ArrowUp',
			handler: () => {
				if (!isAnyModalOpen) {
					userActions.navigateToPreviousActivity();
				}
			},
		},
		{
			key: 'ArrowDown',
			handler: () => {
				if (!isAnyModalOpen) {
					userActions.navigateToNextActivity();
				}
			},
		},
		{
			key: 'ArrowLeft',
			handler: () => {
				if (!isAnyModalOpen) {
					userActions.navigateToPreviousDay();
				}
			},
		},
		{
			key: 'ArrowRight',
			handler: () => {
				if (!isAnyModalOpen) {
					userActions.navigateToNextDay();
				}
			},
		},
		{
			key: 'e',
			handler: () => {
				if (!isAnyModalOpen) {
					const selectedActivity = filteredActivities.find(activity => activity.id === selectedActivityId);
					if (selectedActivity) {
						setSelectedActivity(selectedActivity);
						setIsModalOpen(true);
					}
				}
			},
		},
		{
			key: 'd',
			handler: () => {
				if (!isAnyModalOpen) {
					const selectedActivity = filteredActivities.find(activity => activity.id === selectedActivityId);
					if (selectedActivity) {
						setActivityToDelete(selectedActivity);
						setIsDeleteModalOpen(true);
					}
				}
			},
		},
		{
			key: 'Escape',
			handler: () => {
				if (isModalOpen) {
					setIsModalOpen(false);
				} else if (isCreateModalOpen) {
					setIsCreateModalOpen(false);
				} else if (isDeleteModalOpen) {
					setIsDeleteModalOpen(false);
				} else if (isVoiceModalOpen) {
					setIsVoiceModalOpen(false);
				}
			},
		},
	]);

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
						<div className="flex items-start justify-between">
							<div>
								<CardTitle>Activities</CardTitle>
								<CardDescription>
									{filteredActivities.length}{" "}
									{filteredActivities.length === 1 ? "activity" : "activities"}
									{(() => {
										const today = getTodayString();
										return selectedDate === today ? " for today" : "";
									})()}
								</CardDescription>
							</div>
							<Button
								onClick={() => setIsCreateModalOpen(true)}
								size="sm"
								className="flex items-center gap-2"
							>
								<Plus className="h-4 w-4" />
								New activity
							</Button>
						</div>
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
								{filteredActivities.map((activity) => {
									const isSelected = selectedActivityId === activity.id;
									return (
									// biome-ignore lint/a11y/useSemanticElements: <TODO: fix this>
									<div
										key={activity.id}
										role="button"
										tabIndex={0}
										className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
											isSelected
												? "bg-primary/10 border-primary ring-2 ring-primary/20"
												: "bg-card hover:bg-accent/50"
										}`}
										onClick={() => handleActivityClick(activity)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												handleActivityClick(activity);
											}
										}}
									>
										{/* Timer Button */}
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8"
											onClick={(e) => {
												e.stopPropagation();
												setTimerActivity(activity);
												setIsTimerModalOpen(true);
											}}
											title="Start timer"
										>
											<Play className="h-4 w-4" />
										</Button>

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
								);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Keyboard Shortcuts Callout */}
				<Alert className="mt-4 bg-muted/50">
					<Keyboard className="h-4 w-4" />
					<AlertDescription className="flex flex-wrap items-center gap-3">
						<span className="font-medium">Quick Actions:</span>
						<span className="flex items-center gap-1">
							Press <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">C</kbd> to create a new task
						</span>
						<span className="text-muted-foreground">•</span>
						<span className="flex items-center gap-1">
							Press <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">V</kbd> to record by voice
						</span>
						<span className="text-muted-foreground">•</span>
						<span className="flex items-center gap-1">
							Press <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">T</kbd> to start timer
						</span>
						<span className="text-muted-foreground">•</span>
						<span className="flex items-center gap-1">
							Use <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">↑</kbd> <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">↓</kbd> to navigate activities
						</span>
						<span className="text-muted-foreground">•</span>
						<span className="flex items-center gap-1">
							Use <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">←</kbd> <kbd className="px-2 py-1 text-xs font-semibold bg-background rounded border">→</kbd> to change days
						</span>
					</AlertDescription>
				</Alert>

				{/* Edit Activity Modal */}
				<ActivityModal
					activity={selectedActivity}
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
				/>

				{/* Create Activity Modal */}
				<ActivityModal
					activity={null}
					open={isCreateModalOpen}
					onOpenChange={setIsCreateModalOpen}
					isCreate
					onCreated={(newActivity) => {
						// Optionally handle the newly created activity
						console.log('Activity created:', newActivity);
					}}
				/>

				{/* Delete Activity Modal */}
				<DeleteActivityModal
					activity={activityToDelete}
					open={isDeleteModalOpen}
					onOpenChange={setIsDeleteModalOpen}
				/>

				{/* Voice Recording Modal */}
				<VoiceRecordingModal
					open={isVoiceModalOpen}
					onOpenChange={setIsVoiceModalOpen}
					onError={() => setIsCreateModalOpen(true)}
				/>

				{/* Timer Modal */}
				<TimerModal
					activity={timerActivity}
					open={isTimerModalOpen}
					onOpenChange={setIsTimerModalOpen}
				/>
			</div>
		</RequireAuth>
	);
}
