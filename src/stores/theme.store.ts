import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
	isDark: boolean;
	toggleTheme: () => void;
	setDarkMode: (isDark: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
	persist(
		(set, get) => ({
			isDark: false,

			setDarkMode: (isDark: boolean) => {
				set({ isDark });
				document.body.classList.toggle('dark-theme', isDark);
			},

			toggleTheme: () => {
				get().setDarkMode(!get().isDark);
			},
		}),
		{ name: 'preferred-theme' }
	)
);