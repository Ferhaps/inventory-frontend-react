import api from './axios';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
	const res = await api.get<Product[]>('/products');
	return res.data;
};

export const addProduct = async (params: {
	name: string;
	categoryId: string;
	quantity: number;
}): Promise<Product> => {
	const res = await api.post<Product>(
		`/products?name=${params.name}&categoryId=${params.categoryId}&quantity=${params.quantity}`,
		{}
	);
	return res.data;
};

export const updateProductQuantity = async (params: {
	id: string;
	quantity: number;
}): Promise<void> => {
	await api.patch(`/products/${params.id}?quantity=${params.quantity}`, {});
};

export const deleteProduct = async (id: string): Promise<void> => {
	await api.delete(`/products/${id}`);
};