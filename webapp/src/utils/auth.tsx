import { useRouter } from "@tanstack/react-router";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { authConfig } from "~/config/auth";
import type { User } from "~/utils/types";

interface AuthState {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	user: User | null;
	loading: boolean;
}

interface AuthContextType extends AuthState {
	login: () => void;
	logout: () => void;
	setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const {
	apiBaseUrl: API_BASE_URL,
	clientId: CLIENT_ID,
	// biome-ignore lint/correctness/noUnusedVariables: <Optional>
	clientSecret: CLIENT_SECRET,
	scopes: SCOPES,
} = authConfig;

// OAuth PKCE helpers
function generateRandomString(length: number): string {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
	let text = "";
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

// Simple SHA-256 implementation for environments without crypto.subtle
function sha256(str: string): string {
	function rightRotate(value: number, amount: number): number {
		return (value >>> amount) | (value << (32 - amount));
	}

	function sha256Hash(message: string): number[] {
		const K = [
			0x42_8a_2f_98, 0x71_37_44_91, 0xb5_c0_fb_cf, 0xe9_b5_db_a5, 0x39_56_c2_5b,
			0x59_f1_11_f1, 0x92_3f_82_a4, 0xab_1c_5e_d5, 0xd8_07_aa_98, 0x12_83_5b_01,
			0x24_31_85_be, 0x55_0c_7d_c3, 0x72_be_5d_74, 0x80_de_b1_fe, 0x9b_dc_06_a7,
			0xc1_9b_f1_74, 0xe4_9b_69_c1, 0xef_be_47_86, 0x0f_c1_9d_c6, 0x24_0c_a1_cc,
			0x2d_e9_2c_6f, 0x4a_74_84_aa, 0x5c_b0_a9_dc, 0x76_f9_88_da, 0x98_3e_51_52,
			0xa8_31_c6_6d, 0xb0_03_27_c8, 0xbf_59_7f_c7, 0xc6_e0_0b_f3, 0xd5_a7_91_47,
			0x06_ca_63_51, 0x14_29_29_67, 0x27_b7_0a_85, 0x2e_1b_21_38, 0x4d_2c_6d_fc,
			0x53_38_0d_13, 0x65_0a_73_54, 0x76_6a_0a_bb, 0x81_c2_c9_2e, 0x92_72_2c_85,
			0xa2_bf_e8_a1, 0xa8_1a_66_4b, 0xc2_4b_8b_70, 0xc7_6c_51_a3, 0xd1_92_e8_19,
			0xd6_99_06_24, 0xf4_0e_35_85, 0x10_6a_a0_70, 0x19_a4_c1_16, 0x1e_37_6c_08,
			0x27_48_77_4c, 0x34_b0_bc_b5, 0x39_1c_0c_b3, 0x4e_d8_aa_4a, 0x5b_9c_ca_4f,
			0x68_2e_6f_f3, 0x74_8f_82_ee, 0x78_a5_63_6f, 0x84_c8_78_14, 0x8c_c7_02_08,
			0x90_be_ff_fa, 0xa4_50_6c_eb, 0xbe_f9_a3_f7, 0xc6_71_78_f2,
		];

		const H = [
			0x6a_09_e6_67, 0xbb_67_ae_85, 0x3c_6e_f3_72, 0xa5_4f_f5_3a, 0x51_0e_52_7f,
			0x9b_05_68_8c, 0x1f_83_d9_ab, 0x5b_e0_cd_19,
		];

		const bytes = new TextEncoder().encode(message);
		const bitLength = bytes.length * 8;
		const paddedLength = Math.ceil((bitLength + 65) / 512) * 512;
		const paddedBytes = new Uint8Array(paddedLength / 8);
		paddedBytes.set(bytes);
		paddedBytes[bytes.length] = 0x80;

		const view = new DataView(paddedBytes.buffer);
		view.setBigUint64(paddedBytes.length - 8, BigInt(bitLength), false);

		for (let chunk = 0; chunk < paddedBytes.length; chunk += 64) {
			const W = new Array(64);

			for (let i = 0; i < 16; i++) {
				W[i] = view.getUint32(chunk + i * 4, false);
			}

			for (let i = 16; i < 64; i++) {
				const s0 =
					rightRotate(W[i - 15], 7) ^
					rightRotate(W[i - 15], 18) ^
					(W[i - 15] >>> 3);
				const s1 =
					rightRotate(W[i - 2], 17) ^
					rightRotate(W[i - 2], 19) ^
					(W[i - 2] >>> 10);
				W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
			}

			let [a, b, c, d, e, f, g, h] = H;

			for (let i = 0; i < 64; i++) {
				const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
				const ch = (e & f) ^ (~e & g);
				const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
				const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
				const maj = (a & b) ^ (a & c) ^ (b & c);
				const temp2 = (S0 + maj) >>> 0;

				h = g;
				g = f;
				f = e;
				e = (d + temp1) >>> 0;
				d = c;
				c = b;
				b = a;
				a = (temp1 + temp2) >>> 0;
			}

			H[0] = (H[0] + a) >>> 0;
			H[1] = (H[1] + b) >>> 0;
			H[2] = (H[2] + c) >>> 0;
			H[3] = (H[3] + d) >>> 0;
			H[4] = (H[4] + e) >>> 0;
			H[5] = (H[5] + f) >>> 0;
			H[6] = (H[6] + g) >>> 0;
			H[7] = (H[7] + h) >>> 0;
		}

		return H;
	}

	const hash = sha256Hash(str);
	const bytes = new Uint8Array(32);
	const view = new DataView(bytes.buffer);

	for (let i = 0; i < 8; i++) {
		view.setUint32(i * 4, hash[i], false);
	}

	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
		try {
			const encoder = new TextEncoder();
			const data = encoder.encode(codeVerifier);
			const digest = await window.crypto.subtle.digest("SHA-256", data);
			const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
			return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
		} catch (_error) {
			return sha256(codeVerifier);
		}
	} else {
		return sha256(codeVerifier);
	}
}

async function fetchUserDetails(accessToken: string): Promise<User | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/api/user`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch user details");
		}

		const userData = await response.json();
		// Store in session storage
		sessionStorage.setItem("user", JSON.stringify(userData));
		return userData;
	} catch (_e) {
		return null;
	}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null,
		user: null,
		loading: true,
	});

	useEffect(() => {
		const initAuth = async () => {
			if (typeof window === "undefined") {
				setAuthState((prev) => ({ ...prev, loading: false }));
				return;
			}

			const accessToken = localStorage.getItem("access_token");
			const refreshToken = localStorage.getItem("refresh_token");

			if (accessToken) {
				// Try to get user from session storage first
				const storedUser = sessionStorage.getItem("user");
				let user: User | null = null;

				if (storedUser) {
					try {
						user = JSON.parse(storedUser);
					} catch (_e) {
						// Invalid JSON, fetch fresh
						user = await fetchUserDetails(accessToken);
					}
				} else {
					// No stored user, fetch from API
					user = await fetchUserDetails(accessToken);
				}

				setAuthState({
					isAuthenticated: true,
					accessToken,
					refreshToken,
					user,
					loading: false,
				});
			} else {
				setAuthState((prev) => ({ ...prev, loading: false }));
			}
		};

		initAuth();
	}, []);

	const login = async () => {
		// Generate PKCE parameters
		const state = generateRandomString(40);
		const codeVerifier = generateRandomString(128);
		const codeChallenge = await generateCodeChallenge(codeVerifier);

		// Store state and code verifier in sessionStorage for later verification
		sessionStorage.setItem("oauth_state", state);
		sessionStorage.setItem("oauth_code_verifier", codeVerifier);

		// Build OAuth parameters
		const params = new URLSearchParams({
			client_id: CLIENT_ID,
			redirect_uri: `${window.location.origin}/auth/callback`,
			response_type: "code",
			scope: SCOPES,
			state,
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
			prompt: "login",
		});

		// Redirect to OAuth authorization endpoint
		window.location.href = `${API_BASE_URL}/oauth/authorize?${params.toString()}`;
	};

	const logout = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			sessionStorage.removeItem("user");
		}
		setAuthState({
			isAuthenticated: false,
			accessToken: null,
			refreshToken: null,
			user: null,
			loading: false,
		});
		router.navigate({ to: "/" });
	};

	const setTokens = async (accessToken: string, refreshToken: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("access_token", accessToken);
			if (refreshToken) {
				localStorage.setItem("refresh_token", refreshToken);
			}
		}

		// Fetch user details with the new token
		const user = await fetchUserDetails(accessToken);

		setAuthState({
			isAuthenticated: true,
			accessToken,
			refreshToken,
			user,
			loading: false,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				...authState,
				login,
				logout,
				setTokens,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export async function requireAuth() {
	if (typeof window === "undefined") {
		throw new Error("Authentication required");
	}

	const accessToken = localStorage.getItem("access_token");

	if (!accessToken) {
		window.location.href = `${API_BASE_URL}/login?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`;
		throw new Error("Authentication required");
	}

	return {
		auth: {
			isAuthenticated: true,
			accessToken,
		},
	};
}
