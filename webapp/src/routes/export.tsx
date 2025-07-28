import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import * as React from "react";
import { RequireAuth } from "~/components/require-auth";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { subDays, subMonths } from "date-fns";
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
import { CalendarIcon, Download } from "lucide-react";
import { cn } from "~/lib/utils";
import { format } from "date-fns";

export const Route = createFileRoute("/export")({
	component: Export,
});

type ExportFormat = "markdown" | "text" | "csv";

function Export() {
	const { isAuthenticated } = useAuth();
	const state = useStore(userStore);
	const { contexts, loading } = state;

	// Form state
	const [startDate, setStartDate] = React.useState<Date | undefined>(() => {
		const today = getTodayString();
		const [year, month, day] = today.split("-").map(Number);
		return new Date(year, month - 1, day);
	});

	const [endDate, setEndDate] = React.useState<Date | undefined>(() => {
		const today = getTodayString();
		const [year, month, day] = today.split("-").map(Number);
		return new Date(year, month - 1, day);
	});

	const [selectedContexts, setSelectedContexts] = React.useState<Set<number>>(
		() => new Set(),
	);

	const [exportFormat, setExportFormat] = React.useState<ExportFormat>("markdown");
	const [includeNotes, setIncludeNotes] = React.useState(true);
	const [isExporting, setIsExporting] = React.useState(false);
	const [exportError, setExportError] = React.useState<string | null>(null);

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

	const handleExport = async () => {
		if (!startDate || !endDate || selectedContexts.size === 0) {
			return;
		}

		setIsExporting(true);
		setExportError(null);

		try {
			const exportData = {
				start_date: getLocalDateString(startDate),
				end_date: getLocalDateString(endDate),
				context_ids: Array.from(selectedContexts),
				format: exportFormat,
				include_notes: includeNotes,
			};

			const file = await api.export.generate(exportData);
			
			// Create download link and trigger download
			const url = URL.createObjectURL(file);
			const link = document.createElement('a');
			link.href = url;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

		} catch (error) {
			console.error("Export failed:", error);
			setExportError(
				error instanceof Error ? error.message : "Export failed. Please try again."
			);
		} finally {
			setIsExporting(false);
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
		if (exportError) {
			setExportError(null);
		}
	}, [startDate, endDate, selectedContexts, exportFormat, includeNotes]);

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
						<CardTitle>Export Your Data</CardTitle>
						<CardDescription>
							Export your activities and notes in various formats
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

						{/* Export Format */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Export Format</h3>
							<RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="markdown" id="format-markdown" />
									<Label htmlFor="format-markdown" className="font-normal">
										Markdown (.md) - Rich text with formatting
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="text" id="format-text" />
									<Label htmlFor="format-text" className="font-normal">
										Plain Text (.txt) - Simple text format
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="csv" id="format-csv" />
									<Label htmlFor="format-csv" className="font-normal">
										CSV (.csv) - Spreadsheet compatible
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Additional Options */}
						<div className="space-y-4">
							<h3 className="text-sm font-medium">Additional Options</h3>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="include-notes"
									checked={includeNotes}
									onCheckedChange={(checked) =>
										setIncludeNotes(checked as boolean)
									}
								/>
								<Label htmlFor="include-notes" className="font-normal">
									Include activity notes
								</Label>
							</div>
						</div>

						{/* Export Button */}
						<Button
							onClick={handleExport}
							className="w-full"
							disabled={
								!startDate ||
								!endDate ||
								selectedContexts.size === 0 ||
								(startDate && endDate && startDate > endDate) ||
								isExporting
							}
						>
							<Download className={cn("mr-2 h-4 w-4", isExporting && "animate-spin")} />
							{isExporting ? "Exporting..." : "Export Data"}
						</Button>

						{/* Error Message */}
						{exportError && (
							<p className="text-sm text-destructive">
								{exportError}
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
		</RequireAuth>
	);
}