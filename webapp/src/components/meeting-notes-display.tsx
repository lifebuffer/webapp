import * as React from "react";
import ReactMarkdown from "react-markdown";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
	Copy,
	Download,
	RefreshCw,
	Edit,
	Check,
	X,
	FileText,
	Sparkles,
} from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "~/lib/utils";

interface MeetingNotesDisplayProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	notes: {
		id: string;
		generated_at: string;
		date_range: {
			start: string;
			end: string;
		};
		total_activities: number;
		total_time_minutes: number;
		notes: {
			markdown: string;
			sections?: Array<{
				title: string;
				items: string[];
			}>;
			ai_generated?: boolean;
			model?: string;
		};
		metadata: {
			contexts_included: string[];
			activities_processed: number;
			meeting_type: string;
		};
	};
	onRegenerate: () => void;
}

export function MeetingNotesDisplay({
	open,
	onOpenChange,
	notes,
	onRegenerate,
}: MeetingNotesDisplayProps) {
	const [isEditing, setIsEditing] = React.useState(false);
	const [editedMarkdown, setEditedMarkdown] = React.useState(notes.notes.markdown);
	const [isCopying, setIsCopying] = React.useState(false);

	React.useEffect(() => {
		setEditedMarkdown(notes.notes.markdown);
	}, [notes.notes.markdown]);

	const handleCopy = async () => {
		try {
			setIsCopying(true);

			// Check if clipboard API is available
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(editedMarkdown);
			} else {
				// Fallback method for older browsers or insecure contexts
				const textArea = document.createElement('textarea');
				textArea.value = editedMarkdown;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}

			setTimeout(() => setIsCopying(false), 2000);
		} catch (error) {
			console.error("Failed to copy meeting notes:", error);

			// Try the fallback method if the modern API fails
			try {
				const textArea = document.createElement('textarea');
				textArea.value = editedMarkdown;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				const successful = document.execCommand('copy');
				document.body.removeChild(textArea);

				if (!successful) {
					throw new Error('Fallback copy method failed');
				}

				setTimeout(() => setIsCopying(false), 2000);
			} catch (fallbackError) {
				console.error("Fallback copy method also failed:", fallbackError);
				setIsCopying(false);
				// You could show an error toast here if you had toast functionality
				alert('Copy failed. Please manually select and copy the text.');
			}
		}
	};

	const handleDownload = () => {
		const blob = new Blob([editedMarkdown], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		const dateRange = `${notes.date_range.start}_to_${notes.date_range.end}`;
		link.download = `meeting_notes_${dateRange}.md`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleSaveEdit = () => {
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setEditedMarkdown(notes.notes.markdown);
		setIsEditing(false);
	};

	const formatTime = (minutes: number): string => {
		if (minutes === 0) return "0 minutes";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0 && mins > 0) {
			return `${hours}h ${mins}m`;
		} else if (hours > 0) {
			return `${hours} hour${hours !== 1 ? 's' : ''}`;
		} else {
			return `${mins} minute${mins !== 1 ? 's' : ''}`;
		}
	};

	const meetingTypeLabel = {
		manager_1on1: "1:1 with Manager",
		team_update: "Team Update",
		project_review: "Project Review",
	}[notes.metadata.meeting_type] || "Meeting";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl h-[80vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						{meetingTypeLabel} Notes
						{notes.notes.ai_generated && (
							<span className="ml-2 inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
								<Sparkles className="h-3 w-3" />
								AI Generated
							</span>
						)}
					</DialogTitle>
					<DialogDescription>
						<div className="flex flex-wrap gap-4 text-sm">
							<span>
								<strong>Period:</strong> {format(new Date(notes.date_range.start), "MMM d")} - {format(new Date(notes.date_range.end), "MMM d, yyyy")}
							</span>
							<span>
								<strong>Activities:</strong> {notes.total_activities}
							</span>
							{notes.total_time_minutes > 0 && (
								<span>
									<strong>Time tracked:</strong> {formatTime(notes.total_time_minutes)}
								</span>
							)}
							<span>
								<strong>Contexts:</strong> {notes.metadata.contexts_included.join(", ")}
							</span>
						</div>
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-hidden">
					{isEditing ? (
						<Textarea
							value={editedMarkdown}
							onChange={(e) => setEditedMarkdown(e.target.value)}
							className="h-full font-mono text-sm resize-none"
							placeholder="Edit your meeting notes..."
						/>
					) : (
						<div className="h-full overflow-y-auto">
							<div className="prose prose-sm dark:prose-invert max-w-none p-4">
								<ReactMarkdown
									components={{
										h1: ({ children }) => (
											<h1 className="text-2xl font-bold mb-4">{children}</h1>
										),
										h2: ({ children }) => (
											<h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
										),
										h3: ({ children }) => (
											<h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
										),
										ul: ({ children }) => (
											<ul className="list-disc pl-5 space-y-1">{children}</ul>
										),
										li: ({ children }) => (
											<li className="text-sm">{children}</li>
										),
										p: ({ children }) => (
											<p className="text-sm mb-3">{children}</p>
										),
										strong: ({ children }) => (
											<strong className="font-semibold">{children}</strong>
										),
										em: ({ children }) => (
											<em className="italic">{children}</em>
										),
									}}
								>
									{editedMarkdown}
								</ReactMarkdown>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="flex-shrink-0">
					<div className="flex justify-between w-full">
						<div className="flex gap-2">
							{isEditing ? (
								<>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCancelEdit}
									>
										<X className="h-4 w-4 mr-1" />
										Cancel
									</Button>
									<Button
										size="sm"
										onClick={handleSaveEdit}
									>
										<Check className="h-4 w-4 mr-1" />
										Save Changes
									</Button>
								</>
							) : (
								<>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditing(true)}
									>
										<Edit className="h-4 w-4 mr-1" />
										Edit
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopy}
										disabled={isCopying}
									>
										{isCopying ? (
											<>
												<Check className="h-4 w-4 mr-1" />
												Copied!
											</>
										) : (
											<>
												<Copy className="h-4 w-4 mr-1" />
												Copy
											</>
										)}
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleDownload}
									>
										<Download className="h-4 w-4 mr-1" />
										Download
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											onOpenChange(false);
											setTimeout(onRegenerate, 300);
										}}
									>
										<RefreshCw className="h-4 w-4 mr-1" />
										Regenerate
									</Button>
								</>
							)}
						</div>
						<Button
							variant="default"
							size="sm"
							onClick={() => onOpenChange(false)}
						>
							Done
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}