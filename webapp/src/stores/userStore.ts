import { Store } from "@tanstack/react-store";
import { api } from "~/utils/api";
import type { Context, User } from "~/utils/types";

interface UserState {
	user: User | null;
	contexts: Context[];
	loading: {
		contexts: boolean;
	};
	error: {
		contexts: string | null;
	};
}

const initialState: UserState = {
	user: null,
	contexts: [],
	loading: {
		contexts: false,
	},
	error: {
		contexts: null,
	},
};

export const userStore = new Store(initialState);

// Actions
export const userActions = {
	setUser: (user: User | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			user,
		}));
	},

	setContexts: (contexts: Context[]) => {
		userStore.setState((state: UserState) => ({
			...state,
			contexts,
		}));
	},

	addContext: (context: Context) => {
		userStore.setState((state: UserState) => ({
			...state,
			contexts: [...state.contexts, context],
		}));
	},

	updateContext: (id: number, updates: Partial<Context>) => {
		userStore.setState((state: UserState) => ({
			...state,
			contexts: state.contexts.map((context: Context) =>
				context.id === id ? { ...context, ...updates } : context,
			),
		}));
	},

	removeContext: (id: number) => {
		userStore.setState((state: UserState) => ({
			...state,
			contexts: state.contexts.filter((context: Context) => context.id !== id),
		}));
	},

	setContextsLoading: (loading: boolean) => {
		userStore.setState((state: UserState) => ({
			...state,
			loading: {
				...state.loading,
				contexts: loading,
			},
		}));
	},

	setContextsError: (error: string | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			error: {
				...state.error,
				contexts: error,
			},
		}));
	},

	// Async actions
	fetchContexts: async () => {
		userActions.setContextsLoading(true);
		userActions.setContextsError(null);

		try {
			const contexts = await api.contexts.list();
			userActions.setContexts(contexts);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch contexts";
			userActions.setContextsError(errorMessage);
		} finally {
			userActions.setContextsLoading(false);
		}
	},

	createContext: async (
		data: Omit<Context, "id" | "user_id" | "created_at" | "updated_at">,
	) => {
		try {
			const newContext = await api.contexts.create(data);
			userActions.addContext(newContext);
			return newContext;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create context";
			userActions.setContextsError(errorMessage);
			throw error;
		}
	},

	updateContextById: async (
		id: number,
		data: Partial<
			Omit<Context, "id" | "user_id" | "created_at" | "updated_at">
		>,
	) => {
		try {
			const updatedContext = await api.contexts.update(id, data);
			userActions.updateContext(id, updatedContext);
			return updatedContext;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update context";
			userActions.setContextsError(errorMessage);
			throw error;
		}
	},

	deleteContext: async (id: number) => {
		try {
			await api.contexts.delete(id);
			userActions.removeContext(id);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete context";
			userActions.setContextsError(errorMessage);
			throw error;
		}
	},
};

// Selectors
export const userSelectors = {
	getUser: () => userStore.state.user,
	getContexts: () => userStore.state.contexts,
	getContextsLoading: () => userStore.state.loading.contexts,
	getContextsError: () => userStore.state.error.contexts,
	getContextById: (id: number) =>
		userStore.state.contexts.find((context: Context) => context.id === id),
};
