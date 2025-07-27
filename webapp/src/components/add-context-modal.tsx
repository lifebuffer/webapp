import { useStore } from "@tanstack/react-store";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { userActions, userStore } from "~/stores/userStore";

interface AddContextModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// Common emojis for contexts
const EMOJI_OPTIONS = [
	"🏠",
	"💼",
	"🎯",
	"📚",
	"💪",
	"🍽️",
	"🛒",
	"🚗",
	"✈️",
	"🏥",
	"💰",
	"📱",
	"💻",
	"🎮",
	"🎵",
	"🎨",
	"📝",
	"🔧",
	"⚽",
	"🌱",
	"☕",
	"🍕",
	"📧",
	"📞",
	"💡",
	"🔍",
	"📊",
	"📅",
	"⏰",
	"🎉",
	"❤️",
	"⭐",
	"🔥",
	"💎",
	"🎪",
	"🌟",
	"🏆",
	"🎁",
	"🌈",
	"🦄",
];

export function AddContextModal({ open, onOpenChange }: AddContextModalProps) {
	const state = useStore(userStore);
	const { contexts } = state;

	const [name, setName] = React.useState("");
	const [selectedEmoji, setSelectedEmoji] = React.useState("📝");
	const [isSaving, setIsSaving] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// Reset form when modal opens/closes
	React.useEffect(() => {
		if (open) {
			setName("");
			setSelectedEmoji("📝");
			setError(null);
		}
	}, [open]);

	const handleSave = async () => {
		if (!name.trim()) {
			setError("Context name is required");
			return;
		}

		// Check for duplicate names (case-insensitive)
		const normalizedName = name.trim().toLowerCase();
		const isDuplicate = contexts.some(
			(context) => context.name.toLowerCase() === normalizedName,
		);

		if (isDuplicate) {
			setError("A context with this name already exists");
			return;
		}

		setIsSaving(true);
		setError(null);

		try {
			await userActions.createContext({
				name: name.trim(),
				icon: selectedEmoji,
			});
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to create context:", error);
			setError("Failed to create context. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			handleSave();
		} else if (e.key === "Escape") {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Context</DialogTitle>
					<DialogDescription>
						Create a new context to organize your activities. Choose an emoji
						and give it a name.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Emoji Selection */}
					<div className="space-y-2">
						<Label>Icon</Label>
						<div className="grid grid-cols-10 gap-2 p-3 border rounded-md max-h-32 overflow-y-auto">
							{EMOJI_OPTIONS.map((emoji) => (
								<button
									key={emoji}
									type="button"
									className={`p-2 text-lg hover:bg-accent rounded transition-colors ${
										selectedEmoji === emoji ? "bg-accent ring-2 ring-ring" : ""
									}`}
									onClick={() => setSelectedEmoji(emoji)}
									disabled={isSaving}
								>
									{emoji}
								</button>
							))}
						</div>
						<p className="text-xs text-muted-foreground">
							Selected: <span className="text-lg">{selectedEmoji}</span>
						</p>
					</div>

					{/* Name Input */}
					<div className="space-y-2">
						<Label htmlFor="context-name">Name</Label>
						<Input
							id="context-name"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setError(null);
							}}
							onKeyDown={handleKeyDown}
							placeholder="Enter context name..."
							disabled={isSaving}
							autoFocus
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || !name.trim()}
						className="flex items-center gap-2"
					>
						{isSaving ? "Creating..." : "Create Context"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
