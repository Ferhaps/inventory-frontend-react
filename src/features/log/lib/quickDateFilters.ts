export type QuickDateFilter =
	| 'Today' | '1 week' | '1 month'
	| 'This week' | 'This month' | 'This year';

export const QUICK_FILTERS: QuickDateFilter[] = ['Today', '1 week', '1 month'];
export const MORE_FILTERS: QuickDateFilter[] = ['This week', 'This month', 'This year'];

export function getDateRangeForFilter(filter: QuickDateFilter): { start: Date; end: Date } {
	const now = new Date();
	const start = new Date();

	switch (filter) {
		case 'Today':
			start.setHours(0, 0, 0, 0);
			break;
		case '1 week':
			start.setDate(now.getDate() - 6);
			break;
		case '1 month':
			start.setMonth(now.getMonth() - 1);
			break;
		case 'This week':
			start.setDate(now.getDate() - now.getDay());
			break;
		case 'This month':
			start.setDate(1);
			break;
		case 'This year':
			start.setMonth(0);
			start.setDate(1);
			break;
	}

	return { start, end: now };
}