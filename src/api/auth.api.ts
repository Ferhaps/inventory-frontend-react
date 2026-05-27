import type { LoggedUserInfo, User, UserRole } from "../types";
import api from "./axios";

export const login = async (body: { email: string; password: string }): Promise<LoggedUserInfo> => {
	const res = await api.post<LoggedUserInfo>('/auth/login', body);
	return res.data;
};

export const register = async (body: {
	email: string;
	password: string;
	role: UserRole;
}): Promise<User> => {
	const res = await api.post<User>('/auth/register', body);
	return res.data;
};