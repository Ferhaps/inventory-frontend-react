import api from './axios';
import type { Category } from '../types';

export const getCategories = async (): Promise<Category[]> => {
	const res = await api.get<Category[]>('/categories');
	return res.data;
};

export const addCategory = async (name: string): Promise<Category> => {
	const res = await api.post<Category>(`/categories?categoryName=${name}`, {});
	return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
	await api.delete(`/categories/${id}`);
};