import { useStore } from "@tanstack/react-store";
import { AlertCircle, ChevronDown, Save, Trash2, X } from "lucide-react";
import * as React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { userActions, userStore } from "~/stores/userStore";
import { api } from "~/utils/api";
import type { Activity } from "~/utils/types";

interface ActivityModalProps {
	activity: Activity | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ActivityModal({
	activity,
	open,
	onOpenChange,
}: ActivityModalProps) {
	const state = useStore(userStore);
	const { contexts } = state;

	const [formData, setFormData] = React.useState<Partial<Activity>>({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [timeInputValue, setTimeInputValue] = React.useState("");

	const getStatusVariant = (status: Activity["status"]) => {
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

	const getStatusLabel = (status: Activity["status"]) => {
		return status.replace("_", " ");
	};

	const formatTime = (minutes: number | null) => {
		if (!minutes || minutes === 0) return "";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0) {
			return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
		}
		return `${mins}m`;
	};

	const parseTime = (timeStr: string): number | null => {
		if (!timeStr.trim()) return null;

		// Remove any extra spaces and convert to lowercase
		const cleanStr = timeStr.toLowerCase().replace(/\s+/g, "");

		const hourMatch = cleanStr.match(/(\d+)h/);
		const minMatch = cleanStr.match(/(\d+)m/);

		const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
		const minutes = minMatch ? parseInt(minMatch[1]) : 0;

		const total = hours * 60 + minutes;
		return total > 0 ? total : null;
	};

	// Initialize form data when activity changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Avoid error>
	React.useEffect(() => {
		if (activity) {
			setFormData({
				title: activity.title,
				notes: activity.notes || "",
				status: activity.status,
				time: activity.time,
				context_id: activity.context_id,
			});
			setTimeInputValue(formatTime(activity.time));
			setHasUnsavedChanges(false);
		}
	}, [activity]);

	const saveActivity = async (forceUpdate = false, overrideData = {}) => {
		if (!activity || (!hasUnsavedChanges && !forceUpdate)) return;

		setIsSaving(true);
		try {
			// Merge formData with any override data (for immediate saves)
			const mergedFormData = { ...formData, ...overrideData };

			// Update the activity via API
			const updateData = {
				title: mergedFormData.title ?? activity.title,
				notes: mergedFormData.notes ?? activity.notes,
				status: mergedFormData.status ?? activity.status,
				time: mergedFormData.time ?? activity.time,
				context_id: mergedFormData.context_id ?? activity.context_id,
			};

			const updatedActivityFromAPI = await api.activities.update(
				activity.id,
				updateData,
			);

			console.log("Updated activity from API:", updatedActivityFromAPI);

			// Update the local cache with the response from API (includes populated context)
			userActions.updateActivityInCache(
				activity.date,
				activity.id,
				updatedActivityFromAPI,
			);

			setHasUnsavedChanges(false);
		} catch (error) {
			console.error("Failed to save activity:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleFieldChange = (field: keyof Activity, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setHasUnsavedChanges(true);
	};

	const handleBlur = () => {
		if (hasUnsavedChanges) {
			saveActivity();
		}
	};

	const handleClose = () => {
		if (hasUnsavedChanges) {
			saveActivity();
		}
		onOpenChange(false);
	};

	const handleTimeChange = (value: string) => {
		setTimeInputValue(value);
		const parsedTime = parseTime(value);
		handleFieldChange("time", parsedTime);
	};

	const handleDelete = async () => {
		if (!activity) return;

		setIsDeleting(true);
		try {
			await userActions.deleteActivity(activity.id, activity.date);
			onOpenChange(false); // Close modal after successful deletion
		} catch (error) {
			console.error("Failed to delete activity:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	if (!activity) return null;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Edit Activity
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Status */}
					<div className="space-y-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild disabled={isSaving}>
								<Button
									variant="outline"
									className="w-fit justify-between"
									disabled={isSaving}
								>
									<Badge
										variant={getStatusVariant(
											formData.status || activity.status,
										)}
									>
										{getStatusLabel(formData.status || activity.status)}
									</Badge>
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => {
										handleFieldChange("status", "new");
										saveActivity(true, { status: "new" });
									}}
								>
									<Badge variant="outline">new</Badge>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										handleFieldChange("status", "in_progress");
										saveActivity(true, { status: "in_progress" });
									}}
								>
									<Badge variant="secondary">in progress</Badge>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										handleFieldChange("status", "done");
										saveActivity(true, { status: "done" });
									}}
								>
									<Badge variant="default">done</Badge>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={formData.title || ""}
							onChange={(e) => handleFieldChange("title", e.target.value)}
							onBlur={handleBlur}
							disabled={isSaving}
						/>
					</div>

					{/* Context */}
					<div className="space-y-2">
						<Label htmlFor="context">Context</Label>
						<Select
							value={formData.context_id?.toString() || "none"}
							onValueChange={(value) => {
								const newContextId = value === "none" ? null : parseInt(value);
								handleFieldChange("context_id", newContextId);
								// Save immediately when context changes with the new value
								saveActivity(true, { context_id: newContextId });
							}}
							disabled={isSaving}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a context" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No context</SelectItem>
								{contexts.map((context) => (
									<SelectItem key={context.id} value={context.id.toString()}>
										{context.icon} {context.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Time */}
					<div className="space-y-2">
						<Label htmlFor="time">Time</Label>
						<Input
							id="time"
							placeholder="e.g., 2h 30m or 45m"
							value={timeInputValue}
							onChange={(e) => handleTimeChange(e.target.value)}
							onBlur={handleBlur}
							disabled={isSaving}
						/>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Add notes about this activity..."
							value={formData.notes || ""}
							onChange={(e) => handleFieldChange("notes", e.target.value)}
							onBlur={handleBlur}
							disabled={isSaving}
							rows={4}
						/>
					</div>

					{/* Action Buttons */}
					<div className="pt-4 space-y-3">
						{/* Save Button */}
						<Button
							onClick={async () => {
								if (hasUnsavedChanges) {
									await saveActivity(true);
								}
								handleClose();
							}}
							disabled={isSaving || isDeleting}
							className={`w-full transition-all duration-300 ease-in-out ${
								hasUnsavedChanges
									? "bg-red-600 hover:bg-red-700 text-white"
									: "bg-green-600 hover:bg-green-700 text-white"
							}`}
							variant={hasUnsavedChanges ? "destructive" : "default"}
						>
							<div className="flex items-center justify-center transition-all duration-200 ease-in-out">
								{isSaving ? (
									<>
										<Save className="h-4 w-4 mr-2 animate-pulse transition-transform duration-200" />
										<span className="transition-opacity duration-200">
											Saving...
										</span>
									</>
								) : hasUnsavedChanges ? (
									<>
										<AlertCircle className="h-4 w-4 mr-2 transition-transform duration-200" />
										<span className="transition-opacity duration-200">
											Unsaved changes
										</span>
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2 transition-transform duration-200" />
										<span className="transition-opacity duration-200">
											Saved
										</span>
									</>
								)}
							</div>
						</Button>

						{/* Delete Button */}
						<Button
							onClick={handleDelete}
							disabled={isSaving || isDeleting}
							variant="destructive"
							className="w-full bg-red-600 hover:bg-red-700 text-white"
						>
							<div className="flex items-center justify-center">
								{isDeleting ? (
									<>
										<Trash2 className="h-4 w-4 mr-2 animate-pulse" />
										<span>Deleting...</span>
									</>
								) : (
									<>
										<Trash2 className="h-4 w-4 mr-2" />
										<span>Delete Activity</span>
									</>
								)}
							</div>
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
