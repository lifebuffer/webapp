import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import * as React from "react";
import { RequireAuth } from "~/components/require-auth";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { subDays, subWeeks, subMonths } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { userStore, userActions } from "~/stores/userStore";
import { getTodayString, getLocalDateString } from "~/utils/date";
import { api } from "~/utils/api";
import { useAuth } from "~/utils/auth";
import { CalendarIcon, Users, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { MeetingNotesDisplay } from "~/components/meeting-notes-display";

export const Route = createFileRoute("/prepare-meeting")({
	component: PrepareMeeting,
});

type MeetingType = "manager_1on1" | "team_update" | "project_review";

function PrepareMeeting() {
	const { isAuthenticated } = useAuth();
	const state = useStore(userStore);
	const { contexts, loading } = state;

	// Form state
	const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
		// Default to 1 week ago
		return subWeeks(new Date(), 1);
	});

	const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
		const today = getTodayString();
		const [year, month, day] = today.split("-").map(Number);
		return new Date(year, month - 1, day);
	});

	const [selectedContexts, setSelectedContexts] = React.useState<Set<number>>(
		() => new Set(),
	);

	const [meetingType, setMeetingType] = React.useState<MeetingType>("manager_1on1");
	const [includeNotes, setIncludeNotes] = React.useState(true);
	const [includeTime, setIncludeTime] = React.useState(true);
	const [groupByContext, setGroupByContext] = React.useState(false);

	const [isPreparing, setIsPreparing] = React.useState(false);
	const [prepareError, setPrepareError] = React.useState<string | null>(null);
	const [meetingNotes, setMeetingNotes] = React.useState<any | null>(null);
	const [showNotesModal, setShowNotesModal] = React.useState(false);

	const handleContextToggle = (contextId: number) => {
		const newSelected = new Set(selectedContexts);
		if (newSelected.has(contextId)) {
			newSelected.delete(contextId);
		} else {
			newSelected.add(contextId);
		}
		setSelectedContexts(newSelected);
	};

	const handleSelectAllContexts = () => {
		if (selectedContexts.size === contexts.length) {
			setSelectedContexts(new Set());
		} else {
			setSelectedContexts(new Set(contexts.map((c) => c.id)));
		}
	};

	const handlePrepareMeeting = async () => {
		if (!startDate || !endDate || selectedContexts.size === 0) {
			return;
		}

		setIsPreparing(true);
		setPrepareError(null);

		try {
			const prepareData = {
				start_date: getLocalDateString(startDate),
				end_date: getLocalDateString(endDate),
				context_ids: Array.from(selectedContexts),
				meeting_type: meetingType,
				include_notes: includeNotes,
				include_time: includeTime,
				group_by_context: groupByContext,
			};

			const response = await api.meeting.prepare(prepareData);

			if (response.success && response.data) {
				setMeetingNotes(response.data);
				setShowNotesModal(true);
			} else {
				throw new Error('Failed to prepare meeting notes');
			}

		} catch (error) {
			console.error("Meeting preparation failed:", error);
			setPrepareError(
				error instanceof Error ? error.message : "Failed to prepare meeting notes. Please try again."
			);
		} finally {
			setIsPreparing(false);
		}
	};

	// Load contexts if not available
	React.useEffect(() => {
		if (isAuthenticated && contexts.length === 0) {
			userActions.fetchContexts();
		}
	}, [isAuthenticated, contexts.length]);

	// Update selected contexts when contexts are loaded
	React.useEffect(() => {
		if (contexts.length > 0 && selectedContexts.size === 0) {
			setSelectedContexts(new Set(contexts.map((c) => c.id)));
		}
	}, [contexts, selectedContexts.size]);

	// Clear error when form changes
	React.useEffect(() => {
		if (prepareError) {
			setPrepareError(null);
		}
	}, [startDate, endDate, selectedContexts, meetingType, includeNotes]);

	// Date range preset handlers
	const setToday = () => {
		const today = new Date();
		setStartDate(today);
		setEndDate(today);
	};

	const setLastWeek = () => {
		const today = new Date();
		const weekAgo = subDays(today, 6); // 7 days including today
		setStartDate(weekAgo);
		setEndDate(today);
	};

	const setLastTwoWeeks = () => {
		const today = new Date();
		const twoWeeksAgo = subWeeks(today, 2);
		setStartDate(twoWeeksAgo);
		setEndDate(today);
	};

	const setLastMonth = () => {
		const today = new Date();
		const monthAgo = subMonths(today, 1);
		setStartDate(monthAgo);
		setEndDate(today);
	};

	return (
		<RequireAuth>
			<div className="max-w-2xl mx-auto space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Prepare Meeting Notes</CardTitle>
						<CardDescription>
							Generate AI-powered meeting notes from your activities
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Date Range Selection */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Date Range</h3>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="start-date">Start Date</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												id="start-date"
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!startDate && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{startDate ? format(startDate, "PPP") : "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={startDate}
												onSelect={setStartDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div className="space-y-2">
									<Label htmlFor="end-date">End Date</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												id="end-date"
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!endDate && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{endDate ? format(endDate, "PPP") : "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={endDate}
												onSelect={setEndDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							{/* Quick date range presets */}
							<div className="flex gap-4 text-sm">
								<button
									type="button"
									onClick={setToday}
									className="text-primary hover:underline"
								>
									Today
								</button>
								<span className="text-muted-foreground">•</span>
								<button
									type="button"
									onClick={setLastWeek}
									className="text-primary hover:underline"
								>
									Last week
								</button>
								<span className="text-muted-foreground">•</span>
								<button
									type="button"
									onClick={setLastTwoWeeks}
									className="text-primary hover:underline"
								>
									Last 2 weeks
								</button>
								<span className="text-muted-foreground">•</span>
								<button
									type="button"
									onClick={setLastMonth}
									className="text-primary hover:underline"
								>
									Last month
								</button>
							</div>
						</div>

						{/* Context Selection */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium">Contexts to Include</h3>
								{contexts.length > 0 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={handleSelectAllContexts}
									>
										{selectedContexts.size === contexts.length
											? "Deselect All"
											: "Select All"}
									</Button>
								)}
							</div>
							<div className="space-y-2">
								{loading.contexts ? (
									<p className="text-sm text-muted-foreground">Loading contexts...</p>
								) : contexts.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No contexts available. Create some contexts first.
									</p>
								) : (
									contexts.map((context) => (
										<div key={context.id} className="flex items-center space-x-2">
											<Checkbox
												id={`context-${context.id}`}
												checked={selectedContexts.has(context.id)}
												onCheckedChange={() => handleContextToggle(context.id)}
											/>
											<Label
												htmlFor={`context-${context.id}`}
												className="text-sm font-normal cursor-pointer flex items-center gap-2"
											>
												<span>{context.icon}</span>
												<span>{context.name}</span>
											</Label>
										</div>
									))
								)}
							</div>
						</div>

						{/* Meeting Type */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Meeting Type</h3>
							<RadioGroup value={meetingType} onValueChange={(value) => setMeetingType(value as MeetingType)}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="manager_1on1" id="type-1on1" />
									<Label htmlFor="type-1on1" className="font-normal">
										1:1 with Manager - Focus on individual progress and support
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="team_update" id="type-team" />
									<Label htmlFor="type-team" className="font-normal">
										Team Update - Highlight team achievements and collaboration
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="project_review" id="type-project" />
									<Label htmlFor="type-project" className="font-normal">
										Project Review - Emphasize milestones and deliverables
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Additional Options */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Additional Options</h3>
							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="include-time"
										checked={includeTime}
										onCheckedChange={(checked) =>
											setIncludeTime(checked as boolean)
										}
									/>
									<Label htmlFor="include-time" className="font-normal">
										Include time spent on activities
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="include-notes"
										checked={includeNotes}
										onCheckedChange={(checked) =>
											setIncludeNotes(checked as boolean)
										}
									/>
									<Label htmlFor="include-notes" className="font-normal">
										Include activity and day notes
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="group-by-context"
										checked={groupByContext}
										onCheckedChange={(checked) =>
											setGroupByContext(checked as boolean)
										}
									/>
									<Label htmlFor="group-by-context" className="font-normal">
										Group activities by context
									</Label>
								</div>
							</div>
						</div>

						{/* Prepare Button */}
						<Button
							onClick={handlePrepareMeeting}
							className="w-full"
							disabled={
								!startDate ||
								!endDate ||
								selectedContexts.size === 0 ||
								(startDate && endDate && startDate > endDate) ||
								isPreparing
							}
						>
							{isPreparing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Preparing Meeting Notes...
								</>
							) : (
								<>
									<Users className="mr-2 h-4 w-4" />
									Generate Meeting Notes
								</>
							)}
						</Button>

						{/* Error Message */}
						{prepareError && (
							<p className="text-sm text-destructive">
								{prepareError}
							</p>
						)}

						{/* Validation Message */}
						{startDate && endDate && startDate > endDate && (
							<p className="text-sm text-destructive">
								Start date must be before or equal to end date
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Meeting Notes Modal */}
			{meetingNotes && (
				<MeetingNotesDisplay
					open={showNotesModal}
					onOpenChange={setShowNotesModal}
					notes={meetingNotes}
					onRegenerate={handlePrepareMeeting}
				/>
			)}
		</RequireAuth>
	);
}