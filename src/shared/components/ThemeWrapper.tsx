import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Toaster } from 'sonner';
import { useThemeStore } from '../../stores/theme.store';
import { router } from '../../routes';

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#31adff' },
		background: { default: '#ffffff', paper: '#f5f5f5' },
		text: { primary: '#333333' },
		divider: '#e0e0e0',
	},
});

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: { main: '#29b6f6' },
		background: { default: '#1a1a1a', paper: '#1e1e1e' },
		text: { primary: '#f2f2f2' },
		divider: '#404040',
	},
});

export default function ThemeWrapper() {
	const isDark = useThemeStore((s) => s.isDark);

	useEffect(() => {
		document.body.classList.toggle('dark-theme', isDark);
	}, [isDark]);

	return (
		<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
			<RouterProvider router={router} />
			<Toaster position="top-right" />
		</ThemeProvider>
	);
}
