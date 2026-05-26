import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoggedUserInfo } from "../types";

const TOKEN_KEY = 'INVENTORY_TOKEN';

type AuthState = {
	token: string | null;
	user: LoggedUserInfo['user'] | null;
	isAuthenticated: boolean;
	setAuth: (info: LoggedUserInfo) => void;
	logout: () => void;
	getLoggedUserInfo: () => LoggedUserInfo | null;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			isAuthenticated: false,

			setAuth: (info: LoggedUserInfo) =>
				set({
					token: info.token,
					user: info.user,
					isAuthenticated: true,
				}),

			logout: () => {
				set({ token: null, user: null, isAuthenticated: false });
			},

			getLoggedUserInfo: () => {
				const { token, user } = get();
				if (!token || !user) return null;
				return { token, user };
			},
		}),
		{
			name: TOKEN_KEY,
		}
	)
);