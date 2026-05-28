import api from './axios';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
	const res = await api.get<User[]>('/users');
	return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
	await api.delete(`/users/${id}`);
};
