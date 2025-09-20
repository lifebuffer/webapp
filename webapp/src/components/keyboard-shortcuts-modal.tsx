import { Keyboard } from "lucide-react";
import * as React from "react";
import { Badge } from "~/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { useKeyboardShortcuts } from "~/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface ShortcutItem {
	key: string;
	description: string;
	category: string;
}

const shortcuts: ShortcutItem[] = [
	// Navigation shortcuts
	{
		key: "↑ / ↓",
		description: "Navigate between activities",
		category: "Navigation",
	},
	{
		key: "← / →",
		description: "Navigate between days",
		category: "Navigation",
	},

	// Action shortcuts
	{
		key: "C",
		description: "Create new activity",
		category: "Actions",
	},
	{
		key: "E",
		description: "Edit selected activity",
		category: "Actions",
	},
	{
		key: "D",
		description: "Delete selected activity",
		category: "Actions",
	},

	// Modal shortcuts
	{
		key: "↑ / ↓",
		description: "Navigate between form fields (in modals)",
		category: "Modal Navigation",
	},
	{
		key: "Tab",
		description: "Navigate to next field (in modals)",
		category: "Modal Navigation",
	},
	{
		key: "Enter",
		description: "Submit form / Confirm action",
		category: "Modal Navigation",
	},
	{
		key: "Escape",
		description: "Close modal / Cancel action",
		category: "Modal Navigation",
	},
	{
		key: "← / →",
		description: "Navigate between buttons (in delete modal)",
		category: "Modal Navigation",
	},
];

const KeyShortcut = ({ shortcut }: { shortcut: string }) => (
	<Badge variant="outline" className="font-mono text-xs px-2 py-1">
		{shortcut}
	</Badge>
);

export function KeyboardShortcutsModal({
	open,
	onOpenChange,
}: KeyboardShortcutsModalProps) {
	// Modal keyboard navigation - close on Escape
	useKeyboardShortcuts([
		{
			key: 'Escape',
			handler: () => {
				if (open) {
					onOpenChange(false);
				}
			},
		},
	]);

	// Group shortcuts by category
	const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
		if (!acc[shortcut.category]) {
			acc[shortcut.category] = [];
		}
		acc[shortcut.category].push(shortcut);
		return acc;
	}, {} as Record<string, ShortcutItem[]>);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
				<DialogHeader className="space-y-3">
					<div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary/10 rounded-full">
						<Keyboard className="w-6 h-6 text-primary" />
					</div>
					<DialogTitle className="text-center">Keyboard Shortcuts</DialogTitle>
					<DialogDescription className="text-center">
						Use these keyboard shortcuts to navigate and interact with the app
						efficiently.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pt-4">
					{Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
						<div key={category} className="space-y-3">
							<h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
								{category}
							</h3>
							<div className="space-y-3">
								{categoryShortcuts.map((shortcut, index) => (
									<div
										key={`${category}-${index}`}
										className="flex items-center justify-between py-2"
									>
										<span className="text-sm">{shortcut.description}</span>
										<KeyShortcut shortcut={shortcut.key} />
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className="pt-4 border-t">
					<p className="text-xs text-muted-foreground text-center">
						Press <KeyShortcut shortcut="Escape" /> to close this dialog
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}