import { lazy } from 'react';

export const Layout = lazy(() => import('../layout/Layout'));
export const Login = lazy(() => import('../features/auth/components/Login'));
export const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
export const Products = lazy(() => import('../features/products/Products'));
export const Categories = lazy(() => import('../features/categories/Categories'));
export const Users = lazy(() => import('../features/users/Users'));
export const Log = lazy(() => import('../features/log/Log'));
