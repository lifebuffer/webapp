import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "~/components/require-auth";
import { useAuth } from "~/utils/auth";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { logout, user } = useAuth();

	return (
		<RequireAuth>
			<div className="p-6">
				<h3 className="text-2xl font-bold mb-4">Welcome to LifeBuffer!</h3>

				{user && (
					<div className="bg-gray-100 rounded-lg p-4 mb-6">
						<h4 className="text-lg font-semibold mb-2">User Details</h4>
						<div className="space-y-1">
							<p>
								<span className="font-medium">Name:</span> {user.name}
							</p>
							<p>
								<span className="font-medium">Email:</span> {user.email}
							</p>
							<p>
								<span className="font-medium">Member since:</span>{" "}
								{new Date(user.created_at).toLocaleDateString()}
							</p>
							{user.email_verified_at && (
								<p>
									<span className="font-medium">Email verified:</span>{" "}
									{new Date(user.email_verified_at).toLocaleDateString()}
								</p>
							)}
						</div>
					</div>
				)}

				<div className="mt-4">
					<button
						type="button"
						className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
						onClick={logout}
					>
						Logout
					</button>
				</div>
			</div>
		</RequireAuth>
	);
}
