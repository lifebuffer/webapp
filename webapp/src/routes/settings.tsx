import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import * as React from "react";
import { RequireAuth } from "~/components/require-auth";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { userStore, userActions } from "~/stores/userStore";
import { api } from "~/utils/api";
import { useAuth } from "~/utils/auth";
import { Trash2, User, Lock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	const { user } = useStore(userStore);
	const { logout } = useAuth();

	// Profile form state
	const [profileForm, setProfileForm] = React.useState({
		name: user?.name || "",
		email: user?.email || "",
		password: "",
		password_confirmation: "",
	});
	const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
	const [profileError, setProfileError] = React.useState<string | null>(null);
	const [profileSuccess, setProfileSuccess] = React.useState(false);

	// Account deletion state
	const [deleteForm, setDeleteForm] = React.useState({
		password: "",
		confirmation: "",
	});
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [deleteError, setDeleteError] = React.useState<string | null>(null);

	// Update form when user data changes
	React.useEffect(() => {
		if (user) {
			setProfileForm(prev => ({
				...prev,
				name: user.name || "",
				email: user.email || "",
			}));
		}
	}, [user]);

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsUpdatingProfile(true);
		setProfileError(null);
		setProfileSuccess(false);

		try {
			const updateData: any = {
				name: profileForm.name,
				email: profileForm.email,
			};

			// Only include password if it's provided
			if (profileForm.password.trim()) {
				updateData.password = profileForm.password;
				updateData.password_confirmation = profileForm.password_confirmation;
			}

			const updatedUser = await api.user.updateProfile(updateData);
			
			// Update the user in the store with the new name and email
			if (user) {
				userActions.setUser({
					...user,
					name: profileForm.name,
					email: profileForm.email,
				});
			}
			
			setProfileSuccess(true);
			// Clear password fields after successful update
			setProfileForm(prev => ({
				...prev,
				password: "",
				password_confirmation: "",
			}));

			// Hide success message after 3 seconds
			setTimeout(() => setProfileSuccess(false), 3000);
		} catch (error: any) {
			console.error('Failed to update profile:', error);
			setProfileError(error.message || 'Failed to update profile');
		} finally {
			setIsUpdatingProfile(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteForm.confirmation !== "DELETE") {
			setDeleteError("Please type 'DELETE' to confirm account deletion");
			return;
		}

		setIsDeleting(true);
		setDeleteError(null);

		try {
			await api.user.deleteAccount({
				password: deleteForm.password,
				confirmation: deleteForm.confirmation,
			});

			// Account deleted successfully - logout and redirect
			logout();
		} catch (error: any) {
			console.error('Failed to delete account:', error);
			setDeleteError(error.message || 'Failed to delete account');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<RequireAuth>
			<div className="space-y-6 max-w-2xl mx-auto">
				<div>
					<h1 className="text-2xl font-bold">Account Settings</h1>
					<p className="text-muted-foreground">
						Manage your account preferences and settings
					</p>
				</div>

				{/* Profile Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Profile Information
						</CardTitle>
						<CardDescription>
							Update your account details and personal information
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleProfileUpdate} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										value={profileForm.name}
										onChange={(e) =>
											setProfileForm(prev => ({ ...prev, name: e.target.value }))
										}
										placeholder="Your full name"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={profileForm.email}
										onChange={(e) =>
											setProfileForm(prev => ({ ...prev, email: e.target.value }))
										}
										placeholder="your@email.com"
										required
									/>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Lock className="h-4 w-4" />
									<h3 className="text-sm font-medium">Change Password</h3>
									<span className="text-xs text-muted-foreground">(optional)</span>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="password">New Password</Label>
										<Input
											id="password"
											type="password"
											value={profileForm.password}
											onChange={(e) =>
												setProfileForm(prev => ({ ...prev, password: e.target.value }))
											}
											placeholder="Leave blank to keep current password"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="password_confirmation">Confirm Password</Label>
										<Input
											id="password_confirmation"
											type="password"
											value={profileForm.password_confirmation}
											onChange={(e) =>
												setProfileForm(prev => ({ ...prev, password_confirmation: e.target.value }))
											}
											placeholder="Confirm new password"
										/>
									</div>
								</div>
							</div>

							{profileError && (
								<div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
									{profileError}
								</div>
							)}

							{profileSuccess && (
								<div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
									Profile updated successfully!
								</div>
							)}

							<Button type="submit" disabled={isUpdatingProfile}>
								{isUpdatingProfile ? "Updating..." : "Update Profile"}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Danger Zone */}
				<Card className="border-destructive">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="h-5 w-5" />
							Danger Zone
						</CardTitle>
						<CardDescription>
							Irreversible actions that will permanently affect your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-medium mb-2">Delete Account</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Permanently delete your account and all associated data. This action cannot be undone.
								</p>
								
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive" className="flex items-center gap-2">
											<Trash2 className="h-4 w-4" />
											Delete Account
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription className="space-y-2">
												<p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
												<p>All your activities, contexts, and notes will be lost forever.</p>
											</AlertDialogDescription>
										</AlertDialogHeader>
										
										<div className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="delete-password">Enter your password</Label>
												<Input
													id="delete-password"
													type="password"
													value={deleteForm.password}
													onChange={(e) =>
														setDeleteForm(prev => ({ ...prev, password: e.target.value }))
													}
													placeholder="Password"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="delete-confirmation">
													Type "DELETE" to confirm
												</Label>
												<Input
													id="delete-confirmation"
													value={deleteForm.confirmation}
													onChange={(e) =>
														setDeleteForm(prev => ({ ...prev, confirmation: e.target.value }))
													}
													placeholder="DELETE"
												/>
											</div>
											{deleteError && (
												<div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
													{deleteError}
												</div>
											)}
										</div>

										<AlertDialogFooter>
											<AlertDialogCancel 
												onClick={() => {
													setDeleteForm({ password: "", confirmation: "" });
													setDeleteError(null);
												}}
											>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction 
												onClick={handleDeleteAccount}
												disabled={isDeleting || deleteForm.confirmation !== "DELETE"}
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											>
												{isDeleting ? "Deleting..." : "Delete Account"}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</RequireAuth>
	);
}