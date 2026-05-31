import { useState, useEffect, useRef, useCallback } from 'react';
import { Chip, IconButton, Menu, MenuItem, Autocomplete, TextField } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useQueries } from '@tanstack/react-query';
import LogTable from './components/LogTable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getUsers } from '../../api/users.api';
import { getProducts } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';
import {
	QUICK_FILTERS, MORE_FILTERS, getDateRangeForFilter,
	type QuickDateFilter,
} from './lib/quickDateFilters';
import { snakeCaseParser } from '../../lib/utils';
import type { LogBody, User, Product, Category } from '../../types';
import { getLogEvents, getLogs } from '../../api/log.api';

const INITIAL_PAGE_SIZE = 50;

export default function Log() {
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const [selectedEvent, setSelectedEvent] = useState('');
	const [selectedUserId, setSelectedUserId] = useState('');
	const [selectedProductId, setSelectedProductId] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
	const [selectedDateFilter, setSelectedDateFilter] = useState<QuickDateFilter | null>(null);
	const [quickFilters, setQuickFilters] = useState(QUICK_FILTERS);
	const [moreFilters, setMoreFilters] = useState(MORE_FILTERS);

	const [eventInput, setEventInput] = useState('');
	const [userInput, setUserInput] = useState('');
	const [productInput, setProductInput] = useState('');
	const [categoryInput, setCategoryInput] = useState('');

	const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
	const [stopScrolling, setStopScrolling] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

	const [eventsQ, usersQ, productsQ, categoriesQ] = useQueries({
		queries: [
			{ queryKey: ['logEvents'], queryFn: getLogEvents },
			{ queryKey: ['users'], queryFn: getUsers },
			{ queryKey: ['products'], queryFn: getProducts },
			{ queryKey: ['categories'], queryFn: getCategories },
		],
	});

	const allEvents = eventsQ.data ?? [];
	const allUsers = usersQ.data ?? [];
	const allProducts = productsQ.data ?? [];
	const allCategories = categoriesQ.data ?? [];

	const [logs, setLogs] = useState<import('../../types').Log[]>([]);

	const buildBody = useCallback((size: number): LogBody => {
		const body: LogBody = { pageSize: size };
		if (selectedEvent) body.event = selectedEvent;
		if (selectedUserId) body.user = selectedUserId;
		if (selectedProductId) body.product = selectedProductId;
		if (selectedCategoryId) body.category = selectedCategoryId;
		if (dateRange.start && dateRange.end) {
			body.startDate = dateRange.start;
			body.endDate = dateRange.end;
		}
		return body;
	}, [selectedEvent, selectedUserId, selectedProductId, selectedCategoryId, dateRange]);

	const fetchLogs = useCallback(async (size: number, isInit: boolean) => {
		if (isInit) setLogs([]);
		try {
			const result = await getLogs(buildBody(size));
			setLogs(result);
			setStopScrolling(result.length < size);
		} finally {
			setIsFetching(false);
		}
	}, [buildBody]);

	useEffect(() => {
		setPageSize(INITIAL_PAGE_SIZE);
		setStopScrolling(false);
		fetchLogs(INITIAL_PAGE_SIZE, true);
	}, [selectedEvent, selectedUserId, selectedProductId, selectedCategoryId, dateRange]);

	const handleScrollEnd = () => {
		if (isFetching || stopScrolling) return;
		const nextSize = pageSize + INITIAL_PAGE_SIZE;
		setPageSize(nextSize);
		setIsFetching(true);
		fetchLogs(nextSize, false);
	};

	const resetTableScroll = () => {
		tableContainerRef.current?.scrollTo(0, 0);
	};

	const applyDateFilter = (filter: QuickDateFilter) => {
		setSelectedDateFilter(filter);
		const { start, end } = getDateRangeForFilter(filter);
		setDateRange({ start, end });
		resetTableScroll();
	};

	const handleMoreFilterClick = (filter: QuickDateFilter, index: number) => {
		applyDateFilter(filter);
		setMenuAnchor(null);
		setQuickFilters((prev) => {
			const next = [...prev];
			const displaced = next[0];
			next[0] = filter;
			setMoreFilters((m) => { const mn = [...m]; mn[index] = displaced; return mn; });
			return next;
		});
	};

	const clearFilters = () => {
		setSelectedEvent(''); setEventInput('');
		setSelectedUserId(''); setUserInput('');
		setSelectedProductId(''); setProductInput('');
		setSelectedCategoryId(''); setCategoryInput('');
		setDateRange({ start: null, end: null });
		setSelectedDateFilter(null);
		setStopScrolling(false);
		resetTableScroll();
	};

	const hasActiveFilters =
		selectedEvent || selectedUserId || selectedProductId ||
		selectedCategoryId || dateRange.start || selectedDateFilter;

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div className="w-full h-full flex overflow-hidden">
				<div className="min-w-95 pr-4 overflow-y-auto h-full border-r pl-4 pt-2">
					<div className="flex items-center py-2">
						<span className="font-bold text-xl">Filters</span>
						{hasActiveFilters && (
							<span
								className="ml-auto text-[#009DDC] cursor-pointer font-semibold"
								onClick={clearFilters}
							>
								Clear
							</span>
						)}
					</div>

					<div className="mt-4">
						<div className="flex items-center mb-2 flex-wrap gap-1">
							<p className="font-medium m-0 mr-2">Dates</p>
							{quickFilters.map((f) => (
								<Chip
									key={f}
									label={f}
									size="small"
									clickable
									onClick={() => applyDateFilter(f)}
									color={selectedDateFilter === f ? 'primary' : 'default'}
									variant={selectedDateFilter === f ? 'filled' : 'outlined'}
								/>
							))}
							<IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
								<MoreVert fontSize="small" />
							</IconButton>
							<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
								{moreFilters.map((f, i) => (
									<MenuItem key={f} onClick={() => handleMoreFilterClick(f, i)}>{f}</MenuItem>
								))}
							</Menu>
						</div>

						<div className="flex gap-2">
							<DatePicker
								label="Start date"
								value={dateRange.start}
								onChange={(d) => setDateRange((prev) => {
									const next = { ...prev, start: d };
									if (next.start && next.end) setSelectedDateFilter(null);
									return next;
								})}
								slotProps={{ textField: { size: 'small', fullWidth: true } }}
							/>
							<DatePicker
								label="End date"
								value={dateRange.end}
								onChange={(d) => setDateRange((prev) => {
									const next = { ...prev, end: d };
									if (next.start && next.end) setSelectedDateFilter(null);
									return next;
								})}
								slotProps={{ textField: { size: 'small', fullWidth: true } }}
							/>
						</div>
					</div>

					<div className="mt-4">
						<p className="font-medium mb-2">Events</p>
						<Autocomplete
							options={allEvents}
							getOptionLabel={(o) => snakeCaseParser(o)}
							inputValue={eventInput}
							onInputChange={(_, val) => setEventInput(val)}
							onChange={(_, val) => {
								if (val === selectedEvent) {
									setSelectedEvent(''); setEventInput('');
								} else {
									setSelectedEvent(val ?? '');
									setEventInput(val ? snakeCaseParser(val) : '');
								}
							}}
							renderInput={(params) => (
								<TextField {...params} size="small" placeholder="Select event" fullWidth />
							)}
						/>
					</div>

					<div className="mt-4">
						<p className="font-medium mb-2">Users</p>
						<Autocomplete
							options={allUsers}
							getOptionLabel={(u: User) => u.email}
							inputValue={userInput}
							onInputChange={(_, val) => setUserInput(val)}
							onChange={(_, val: User | null) => {
								if (val?.id === selectedUserId) {
									setSelectedUserId(''); setUserInput('');
								} else {
									setSelectedUserId(val?.id ?? '');
									setUserInput(val?.email ?? '');
								}
							}}
							renderInput={(params) => (
								<TextField {...params} size="small" placeholder="Search users" fullWidth />
							)}
						/>
					</div>

					<div className="mt-4">
						<p className="font-medium mb-2">Products</p>
						<Autocomplete
							options={allProducts}
							getOptionLabel={(p: Product) => p.name}
							inputValue={productInput}
							onInputChange={(_, val) => setProductInput(val)}
							onChange={(_, val: Product | null) => {
								if (val?.id === selectedProductId) {
									setSelectedProductId(''); setProductInput('');
								} else {
									setSelectedProductId(val?.id ?? '');
									setProductInput(val?.name ?? '');
								}
							}}
							renderInput={(params) => (
								<TextField {...params} size="small" placeholder="Search products" fullWidth />
							)}
						/>
					</div>

					<div className="mt-4">
						<p className="font-medium mb-2">Categories</p>
						<Autocomplete
							options={allCategories}
							getOptionLabel={(c: Category) => c.name}
							inputValue={categoryInput}
							onInputChange={(_, val) => setCategoryInput(val)}
							onChange={(_, val: Category | null) => {
								if (val?.id === selectedCategoryId) {
									setSelectedCategoryId(''); setCategoryInput('');
								} else {
									setSelectedCategoryId(val?.id ?? '');
									setCategoryInput(val?.name ?? '');
								}
							}}
							renderInput={(params) => (
								<TextField {...params} size="small" placeholder="Search categories" fullWidth />
							)}
						/>
					</div>
				</div>

				<div ref={tableContainerRef} className="flex-1 overflow-hidden">
					<LogTable
						logs={logs}
						isFetching={isFetching}
						onScrollEnd={handleScrollEnd}
					/>
				</div>
			</div>
		</LocalizationProvider>
	);
}