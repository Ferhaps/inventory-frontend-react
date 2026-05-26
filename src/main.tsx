import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { createTheme, ThemeProvider } from '@mui/material';
import "./index.css";

const queryClient = new QueryClient();

const theme = createTheme({
	palette: {
		primary: { main: '#31adff' },
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
