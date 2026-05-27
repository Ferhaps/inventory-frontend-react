import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, addCategory, deleteCategory } from '../../../api/categories.api';

export const CATEGORIES_KEY = ['categories'];

export function useCategories() {
	return useQuery({ queryKey: CATEGORIES_KEY, queryFn: getCategories });
}

export function useAddCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addCategory,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
	});
}