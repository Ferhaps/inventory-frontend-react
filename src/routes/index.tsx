import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout, Login, Dashboard, Products, Categories, Users, Log } from './lazyRoutes';
import ProtectedRoute from '../shared/components/ProtectedRoute';

const withSuspense = (Component: React.ComponentType) => (
	<Suspense fallback={null}>
		<Component />
	</Suspense>
);

export const router = createBrowserRouter([
	{
		path: '/login',
		element: withSuspense(Login),
		handle: { title: 'Inventory Login' },
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
				handle: { title: 'Inventory Dashboard' },
			},
			{
				path: 'products',
				element: withSuspense(Products),
				handle: { title: 'Inventory Products' },
			},
			{
				path: 'categories',
				element: withSuspense(Categories),
				handle: { title: 'Inventory Categories' },
			},
			{
				path: 'users',
				element: withSuspense(Users),
				handle: { title: 'Inventory Users' },
			},
			{
				path: 'log',
				element: withSuspense(Log),
				handle: { title: 'Inventory Log' },
			},
		]
	},
	{
		path: '*',
		element: <Navigate to="/login" replace />,
	},
]);