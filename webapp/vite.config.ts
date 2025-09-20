import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		port: parseInt(process.env.PORT || "3000"),
		allowedHosts: ["app.lifebuffer.test", "app.lifebuffer.com"],
	},
	plugins: [
		tsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tanstackStart({ customViteReactPlugin: true }),
		viteReact(),
	],
});
