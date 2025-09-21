import { Clock, Pause, Play, CheckCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { userActions } from "~/stores/userStore";
import type { Activity } from "~/utils/types";

interface TimerModalProps {
	activity: Activity | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TimerModal({
	activity,
	open,
	onOpenChange,
}: TimerModalProps) {
	const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
	const [isRunning, setIsRunning] = React.useState(false);
	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = React.useRef<number | null>(null);
	const pausedTimeRef = React.useRef(0);

	// Start the timer automatically when modal opens
	React.useEffect(() => {
		if (open && activity) {
			setElapsedSeconds(0);
			pausedTimeRef.current = 0;

			// Set activity status to in_progress when timer starts
			if (activity.status !== 'in_progress') {
				userActions.updateActivity(activity.id, {
					status: 'in_progress'
				}).catch(error => {
					console.error('Failed to update activity status:', error);
				});
			}

			startTimer();
		} else {
			stopTimer();
			setElapsedSeconds(0);
			pausedTimeRef.current = 0;
		}
	}, [open, activity]);

	const startTimer = React.useCallback(() => {
		if (!isRunning) {
			startTimeRef.current = Date.now() - pausedTimeRef.current * 1000;
			setIsRunning(true);

			intervalRef.current = setInterval(() => {
				if (startTimeRef.current) {
					const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
					setElapsedSeconds(elapsed);
				}
			}, 100); // Update every 100ms for smooth display
		}
	}, [isRunning]);

	const pauseTimer = React.useCallback(() => {
		if (isRunning) {
			stopTimer();
			pausedTimeRef.current = elapsedSeconds;
		}
	}, [isRunning, elapsedSeconds]);

	const stopTimer = React.useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsRunning(false);
	}, []);

	const completeTimer = React.useCallback(async () => {
		if (!activity || elapsedSeconds === 0) return;

		stopTimer();

		// Convert seconds to minutes (rounding up)
		const minutesToAdd = Math.ceil(elapsedSeconds / 60);
		const existingMinutes = activity.time || 0;
		const newTotalMinutes = existingMinutes + minutesToAdd;

		try {
			// Update the activity with the new time
			await userActions.updateActivity(activity.id, {
				time: newTotalMinutes,
			});

			toast.success(`Added ${formatTime(elapsedSeconds)} to "${activity.title}"`, {
				description: `Total time: ${formatMinutes(newTotalMinutes)}`,
			});

			// Close the modal
			onOpenChange(false);
		} catch (error) {
			console.error('Failed to update activity time:', error);
			toast.error('Failed to update activity time');
		}
	}, [activity, elapsedSeconds, onOpenChange]);

	// Keyboard shortcuts
	useKeyboardShortcuts([
		{
			key: ' ', // Spacebar
			handler: () => {
				if (open) {
					if (isRunning) {
						pauseTimer();
					} else {
						startTimer();
					}
				}
			},
			preventDefault: true,
		},
		{
			key: 'Enter',
			handler: () => {
				if (open && elapsedSeconds > 0) {
					completeTimer();
				}
			},
		},
		{
			key: 'Escape',
			handler: () => {
				if (open) {
					stopTimer();
					onOpenChange(false);
				}
			},
		},
	]);

	// Format elapsed time as HH:MM:SS
	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		const parts = [];
		if (hours > 0) {
			parts.push(`${hours}h`);
		}
		if (minutes > 0 || hours > 0) {
			parts.push(`${minutes}m`);
		}
		parts.push(`${secs}s`);

		return parts.join(' ');
	};

	// Format display time as HH:MM:SS for the timer display
	const formatDisplayTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		const pad = (n: number) => n.toString().padStart(2, '0');

		if (hours > 0) {
			return `${hours}:${pad(minutes)}:${pad(secs)}`;
		}
		return `${minutes}:${pad(secs)}`;
	};

	// Format minutes for display
	const formatMinutes = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;

		if (hours > 0) {
			return `${hours}h ${mins}m`;
		}
		return `${mins}m`;
	};

	if (!activity) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
						<Clock className="w-8 h-8 text-primary" />
					</div>
					<DialogTitle className="text-center">Activity Timer</DialogTitle>
					<DialogDescription className="text-center">
						{activity.title}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pt-4">
					{/* Timer Display */}
					<div className="text-center">
						<div className="text-5xl font-mono font-bold text-primary">
							{formatDisplayTime(elapsedSeconds)}
						</div>
						{activity.time && (
							<div className="text-sm text-muted-foreground mt-2">
								Previously logged: {formatMinutes(activity.time)}
							</div>
						)}
					</div>

					{/* Timer Controls */}
					<div className="flex gap-2">
						<Button
							onClick={isRunning ? pauseTimer : startTimer}
							variant="outline"
							className="flex-1"
							disabled={!activity}
						>
							{isRunning ? (
								<>
									<Pause className="w-4 h-4 mr-2" />
									Pause
								</>
							) : (
								<>
									<Play className="w-4 h-4 mr-2" />
									{elapsedSeconds > 0 ? 'Resume' : 'Start'}
								</>
							)}
						</Button>
						<Button
							onClick={completeTimer}
							className="flex-1"
							disabled={elapsedSeconds === 0}
						>
							<CheckCircle className="w-4 h-4 mr-2" />
							Complete
						</Button>
					</div>

					{/* Keyboard Shortcuts */}
					<div className="text-center text-xs text-muted-foreground space-y-1">
						<div>
							Press <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> to {isRunning ? 'pause' : 'start'}
						</div>
						<div>
							Press <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> to complete
						</div>
						<div>
							Press <kbd className="px-2 py-1 bg-muted rounded">Escape</kbd> to cancel
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}