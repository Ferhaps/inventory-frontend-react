import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { Layout, Login, Dashboard, Products, Categories, Users, Log } from './lazyRoutes';

const withSuspense = (Component: React.ComponentType) => (
	<Suspense fallback={null}>
		<Component />
	</Suspense>
);

export const router = createBrowserRouter([
	{
		path: '/login',
		element: withSuspense(Login),
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				{withSuspense(Layout)}
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},
			{
				path: 'dashboard',
				element: withSuspense(Dashboard),
			},
			{
				path: 'products',
				element: withSuspense(Products),
			},
			{
				path: 'categories',
				element: withSuspense(Categories),
			},
			{
				path: 'users',
				element: withSuspense(Users),
			},
			{
				path: 'log',
				element: withSuspense(Log),
			},
		]
	},
	{
		path: '*',
		element: <Navigate to="/login" replace />,
	},
]);