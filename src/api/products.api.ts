import api from './axios';
import type { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
	const res = await api.get<Product[]>('/products');
	return res.data;
};
