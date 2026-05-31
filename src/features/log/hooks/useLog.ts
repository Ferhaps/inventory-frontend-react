import { useMutation } from '@tanstack/react-query';
import { getLogs } from '../../../api/log.api';

export function useLogs() {
	return useMutation({ mutationFn: getLogs });
}