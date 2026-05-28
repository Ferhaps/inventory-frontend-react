import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../../api/users.api';
import { register } from '../../../api/auth.api';

export const USERS_KEY = ['users'];

export function useUsers() {
	return useQuery({ queryKey: USERS_KEY, queryFn: getUsers });
}

export function useRegisterUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: register,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
	});
}
