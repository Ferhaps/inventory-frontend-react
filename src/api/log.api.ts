import api from './axios';
import type { Log, LogBody } from '../types';

export const getLogs = async (body: LogBody): Promise<Log[]> => {
	const res = await api.post<Log[]>('/log', body);
	return res.data;
};

export const getLogEvents = async (): Promise<string[]> => {
	const res = await api.get<string[]>('/log/events');
	return res.data;
};
