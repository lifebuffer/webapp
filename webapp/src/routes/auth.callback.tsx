import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { authConfig } from "~/config/auth";
import { useAuth } from "~/utils/auth";

const {
	apiBaseUrl: API_BASE_URL,
	clientId: CLIENT_ID,
	// biome-ignore lint/correctness/noUnusedVariables: <Optional>
	clientSecret: CLIENT_SECRET,
} = authConfig;

export const Route = createFileRoute("/auth/callback")({
	component: AuthCallback,
});

function AuthCallback() {
	const { setTokens } = useAuth();

	useEffect(() => {
		const handleCallback = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get("code");
			const state = params.get("state");
			const error = params.get("error");

			if (error) {
				window.location.href = "/";
				return;
			}

			// Verify state matches
			const storedState = sessionStorage.getItem("oauth_state");
			if (!state || state !== storedState) {
				window.location.href = "/";
				return;
			}

			// Get stored code verifier
			const codeVerifier = sessionStorage.getItem("oauth_code_verifier");
			if (!(code && codeVerifier)) {
				window.location.href = "/";
				return;
			}

			try {
				// Build form data for token exchange
				const formData = new URLSearchParams();
				formData.append("grant_type", "authorization_code");
				formData.append("client_id", CLIENT_ID);
				formData.append(
					"redirect_uri",
					`${window.location.origin}/auth/callback`,
				);
				formData.append("code_verifier", codeVerifier);
				formData.append("code", code);
				// Exchange authorization code for tokens
				const tokenResponse = await fetch(`${API_BASE_URL}/oauth/token`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Accept: "application/json",
					},
					body: formData.toString(),
					credentials: "include",
				});
				const responseText = await tokenResponse.text();

				if (!tokenResponse.ok) {
					throw new Error(`Token exchange failed: ${responseText}`);
				}

				const tokenData = JSON.parse(responseText);

				if (tokenData.access_token) {
					// Handle both cases: with and without refresh token
					const refreshToken = tokenData.refresh_token || "";
					await setTokens(tokenData.access_token, refreshToken);

					// Clean up session storage
					sessionStorage.removeItem("oauth_state");
					sessionStorage.removeItem("oauth_code_verifier");

					window.location.href = "/";
				} else {
					throw new Error("No access token in response");
				}
			} catch (_error) {
				// Redirect to home after error
				setTimeout(() => {
					window.location.href = "/";
				}, 3000);
			}
		};

		handleCallback();
	}, [setTokens]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h2 className="mb-2 font-semibold text-2xl">Authenticating...</h2>
				<p className="text-gray-600">
					Please wait while we complete your login.
				</p>
			</div>
		</div>
	);
}
