import { Store } from "@tanstack/react-store";
import { api } from "~/utils/api";
import type { Activity, Context, Day, User } from "~/utils/types";

interface CachedDayData {
	day: Day;
	activities: Activity[];
}

interface UserState {
	user: User | null;
	contexts: Context[];
	activities: Activity[];
	currentDay: Day | null;
	selectedDate: string; // YYYY-MM-DD format
	selectedContextId: number | null; // null means "All" contexts
	dayCache: Record<string, CachedDayData>; // Cache days by date (YYYY-MM-DD)
	loading: {
		contexts: boolean;
		todayData: boolean;
		recentDays: boolean;
	};
	error: {
		contexts: string | null;
		todayData: string | null;
		recentDays: string | null;
	};
}

// Get today's date in YYYY-MM-DD format
const getTodayString = () => {
	const today = new Date();
	return today.toISOString().split("T")[0];
};

const initialState: UserState = {
	user: null,
	contexts: [],
	activities: [],
	currentDay: null,
	selectedDate: getTodayString(),
	selectedContextId: null, // Show all contexts by default
	dayCache: {},
	loading: {
		contexts: false,
		todayData: false,
		recentDays: false,
	},
	error: {
		contexts: null,
		todayData: null,
		recentDays: null,
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

	setActivities: (activities: Activity[]) => {
		userStore.setState((state: UserState) => ({
			...state,
			activities,
		}));
	},

	setCurrentDay: (currentDay: Day | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			currentDay,
		}));
	},

	setSelectedDate: (selectedDate: string) => {
		userStore.setState((state: UserState) => ({
			...state,
			selectedDate,
		}));
	},

	setSelectedContextId: (selectedContextId: number | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			selectedContextId,
		}));
	},

	cacheDayData: (date: string, dayData: CachedDayData) => {
		userStore.setState((state: UserState) => ({
			...state,
			dayCache: {
				...state.dayCache,
				[date]: dayData,
			},
		}));
	},

	cacheMultipleDays: (
		daysData: Array<{ date: string; data: CachedDayData }>,
	) => {
		userStore.setState((state: UserState) => {
			const newCache = { ...state.dayCache };
			daysData.forEach(({ date, data }) => {
				newCache[date] = data;
			});
			return {
				...state,
				dayCache: newCache,
			};
		});
	},

	updateActivityInCache: (
		date: string,
		activityId: string,
		updatedActivity: Activity,
	) => {
		userStore.setState((state: UserState) => {
			const cachedDay = state.dayCache[date];
			if (!cachedDay) return state;

			const updatedActivities = cachedDay.activities.map((activity) =>
				activity.id === activityId ? updatedActivity : activity,
			);

			const newCache = {
				...state.dayCache,
				[date]: {
					...cachedDay,
					activities: updatedActivities,
				},
			};

			// Also update current activities if it's the selected date
			const newActivities =
				state.selectedDate === date ? updatedActivities : state.activities;

			return {
				...state,
				dayCache: newCache,
				activities: newActivities,
			};
		});
	},

	removeActivityFromCache: (date: string, activityId: string) => {
		userStore.setState((state: UserState) => {
			const cachedDay = state.dayCache[date];
			if (!cachedDay) return state;

			const updatedActivities = cachedDay.activities.filter(
				(activity) => activity.id !== activityId,
			);

			const newCache = {
				...state.dayCache,
				[date]: {
					...cachedDay,
					activities: updatedActivities,
				},
			};

			// Also update current activities if it's the selected date
			const newActivities =
				state.selectedDate === date ? updatedActivities : state.activities;

			return {
				...state,
				dayCache: newCache,
				activities: newActivities,
			};
		});
	},

	updateDayInCache: (date: string, updatedDay: Day) => {
		userStore.setState((state: UserState) => {
			const cachedDay = state.dayCache[date];
			if (!cachedDay) return state;

			const newCache = {
				...state.dayCache,
				[date]: {
					...cachedDay,
					day: updatedDay,
				},
			};

			// Also update currentDay if it's the selected date
			const newCurrentDay =
				state.selectedDate === date ? updatedDay : state.currentDay;

			return {
				...state,
				dayCache: newCache,
				currentDay: newCurrentDay,
			};
		});
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

	setTodayDataLoading: (loading: boolean) => {
		userStore.setState((state: UserState) => ({
			...state,
			loading: {
				...state.loading,
				todayData: loading,
			},
		}));
	},

	setTodayDataError: (error: string | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			error: {
				...state.error,
				todayData: error,
			},
		}));
	},

	setRecentDaysLoading: (loading: boolean) => {
		userStore.setState((state: UserState) => ({
			...state,
			loading: {
				...state.loading,
				recentDays: loading,
			},
		}));
	},

	setRecentDaysError: (error: string | null) => {
		userStore.setState((state: UserState) => ({
			...state,
			error: {
				...state.error,
				recentDays: error,
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

	fetchTodayData: async () => {
		userActions.setTodayDataLoading(true);
		userActions.setTodayDataError(null);

		try {
			const data = await api.today();
			userActions.setCurrentDay(data.day);
			userActions.setActivities(data.activities);
			userActions.setContexts(data.contexts);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch today's data";
			userActions.setTodayDataError(errorMessage);
		} finally {
			userActions.setTodayDataLoading(false);
		}
	},

	fetchDayData: async (date: string) => {
		userActions.setSelectedDate(date);

		// Check if data is already cached
		const cachedData = userStore.state.dayCache[date];
		if (cachedData) {
			// Use cached data immediately
			userActions.setCurrentDay(cachedData.day);
			userActions.setActivities(cachedData.activities);
			return;
		}

		// If not cached, fetch from API
		userActions.setTodayDataLoading(true);
		userActions.setTodayDataError(null);

		try {
			const data = await api.dayData(date);

			// Cache the fetched data
			userActions.cacheDayData(date, {
				day: data.day,
				activities: data.activities,
			});

			// Set current data
			userActions.setCurrentDay(data.day);
			userActions.setActivities(data.activities);
			userActions.setContexts(data.contexts);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch day data";
			userActions.setTodayDataError(errorMessage);
		} finally {
			userActions.setTodayDataLoading(false);
		}
	},

	fetchRecentDays: async () => {
		userActions.setRecentDaysLoading(true);
		userActions.setRecentDaysError(null);

		try {
			const data = await api.recentDays();

			// Prepare data for caching
			const daysToCache = data.days.map((dayData) => ({
				date: dayData.day.date,
				data: {
					day: dayData.day,
					activities: dayData.activities,
				},
			}));

			// Cache all the days
			userActions.cacheMultipleDays(daysToCache);

			// Update contexts as well
			userActions.setContexts(data.contexts);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to fetch recent days";
			userActions.setRecentDaysError(errorMessage);
		} finally {
			userActions.setRecentDaysLoading(false);
		}
	},

	updateDay: async (
		date: string,
		data: Partial<
			Omit<
				Day,
				"id" | "user_id" | "date" | "created_at" | "updated_at" | "deleted_at"
			>
		>,
	) => {
		try {
			const updatedDay = await api.days.update(date, data);
			userActions.updateDayInCache(date, updatedDay);
			return updatedDay;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update day";
			throw new Error(errorMessage);
		}
	},

	deleteActivity: async (activityId: string, date: string) => {
		try {
			await api.activities.delete(activityId);
			userActions.removeActivityFromCache(date, activityId);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete activity";
			throw new Error(errorMessage);
		}
	},
};

// Selectors
export const userSelectors = {
	getUser: () => userStore.state.user,
	getContexts: () => userStore.state.contexts,
	getActivities: () => userStore.state.activities,
	getCurrentDay: () => userStore.state.currentDay,
	getSelectedDate: () => userStore.state.selectedDate,
	getContextsLoading: () => userStore.state.loading.contexts,
	getTodayDataLoading: () => userStore.state.loading.todayData,
	getContextsError: () => userStore.state.error.contexts,
	getTodayDataError: () => userStore.state.error.todayData,
	getContextById: (id: number) =>
		userStore.state.contexts.find((context: Context) => context.id === id),
};
