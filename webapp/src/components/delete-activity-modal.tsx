import { AlertTriangle, Trash2 } from "lucide-react";
import * as React from "react";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { userActions } from "~/stores/userStore";
import type { Activity } from "~/utils/types";

interface DeleteActivityModalProps {
	activity: Activity | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteActivityModal({
	activity,
	open,
	onOpenChange,
}: DeleteActivityModalProps) {
	const [isDeleting, setIsDeleting] = React.useState(false);

	// Refs for keyboard navigation
	const cancelButtonRef = React.useRef<HTMLButtonElement>(null);
	const deleteButtonRef = React.useRef<HTMLButtonElement>(null);

	const [focusedButton, setFocusedButton] = React.useState<'cancel' | 'delete'>('cancel');

	// Focus management
	React.useEffect(() => {
		if (open) {
			setFocusedButton('cancel');
			setTimeout(() => {
				cancelButtonRef.current?.focus();
			}, 100);
		}
	}, [open]);

	// Modal keyboard navigation
	useKeyboardShortcuts([
		{
			key: 'ArrowLeft',
			handler: () => {
				if (open) {
					setFocusedButton('cancel');
					cancelButtonRef.current?.focus();
				}
			},
		},
		{
			key: 'ArrowRight',
			handler: () => {
				if (open) {
					setFocusedButton('delete');
					deleteButtonRef.current?.focus();
				}
			},
		},
		{
			key: 'Tab',
			handler: () => {
				if (open) {
					if (focusedButton === 'cancel') {
						setFocusedButton('delete');
						deleteButtonRef.current?.focus();
					} else {
						setFocusedButton('cancel');
						cancelButtonRef.current?.focus();
					}
				}
			},
		},
		{
			key: 'Enter',
			handler: () => {
				if (open) {
					if (focusedButton === 'delete') {
						handleDelete();
					} else {
						onOpenChange(false);
					}
				}
			},
		},
		{
			key: 'Escape',
			handler: () => {
				if (open) {
					onOpenChange(false);
				}
			},
		},
	]);

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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
						<AlertTriangle className="w-6 h-6 text-red-600" />
					</div>
					<DialogTitle className="text-center">Delete Activity</DialogTitle>
					<DialogDescription className="text-center">
						Are you sure you want to delete "{activity.title}"? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-3 pt-4">
					<Button
						ref={cancelButtonRef}
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
						className="flex-1"
						onFocus={() => setFocusedButton('cancel')}
					>
						Cancel
					</Button>
					<Button
						ref={deleteButtonRef}
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
						className="flex-1"
						onFocus={() => setFocusedButton('delete')}
					>
						{isDeleting ? (
							<>
								<Trash2 className="w-4 h-4 mr-2 animate-pulse" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="w-4 h-4 mr-2" />
								Delete
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}