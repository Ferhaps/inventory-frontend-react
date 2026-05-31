import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getProducts,
	addProduct,
	updateProductQuantity,
	deleteProduct,
} from '../../../api/products.api';

export const PRODUCTS_KEY = ['products'];

export function useProducts() {
	return useQuery({ queryKey: PRODUCTS_KEY, queryFn: getProducts });
}

export function useAddProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProduct,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
	});
}

export function useUpdateProductQuantity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateProductQuantity,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
	});
}