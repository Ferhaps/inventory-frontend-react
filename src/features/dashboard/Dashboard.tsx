import { useQueries } from '@tanstack/react-query';
import { Inventory2, Category, People, Warning } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { getProducts } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';
import { getUsers } from '../../api/users.api';
import ActivityFeed from './components/ActivityFeed';
import CategoryChart from './components/CategoryChart';
import { getLogs } from '../../api/log.api';

const LOW_STOCK_THRESHOLD = 20;

export default function Dashboard() {
	const [productsQ, categoriesQ, usersQ, logsQ] = useQueries({
		queries: [
			{ queryKey: ['products'], queryFn: getProducts },
			{ queryKey: ['categories'], queryFn: getCategories },
			{ queryKey: ['users'], queryFn: getUsers },
			{ queryKey: ['logs', 'dashboard'], queryFn: () => getLogs({ pageSize: 10 }) },
		],
	});

	const isLoading = [productsQ, categoriesQ, usersQ, logsQ].some((q) => q.isLoading);

	const products = productsQ.data ?? [];
	const categories = categoriesQ.data ?? [];
	const users = usersQ.data ?? [];
	const logs = logsQ.data ?? [];

	const lowStockCount = products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD).length;

	const statCards = [
		{
			value: products.length,
			label: 'Total Products',
			icon: <Inventory2 />,
			iconClass: 'bg-blue-100 text-blue-500',
		},
		{
			value: categories.length,
			label: 'Categories',
			icon: <Category />,
			iconClass: 'bg-purple-100 text-purple-500',
		},
		{
			value: users.length,
			label: 'Users',
			icon: <People />,
			iconClass: 'bg-green-100 text-green-600',
		},
		{
			value: lowStockCount,
			label: 'Low Stock Items',
			icon: <Warning />,
			iconClass: lowStockCount > 0 ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400',
			valueClass: lowStockCount > 0 ? 'text-red-500' : '',
		},
	];

	return (
		<div className="flex flex-col h-full overflow-hidden p-4 w-full">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 shrink-0">
				{statCards.map((card) => (
					<div key={card.label} className="p-5 rounded-xl flex items-center gap-4 shadow-md bg-[var(--surface-color)]">
						<div className={`rounded-full p-3 ${card.iconClass}`}>
							{card.icon}
						</div>
						<div>
							<div className={`text-3xl font-bold ${card.valueClass ?? ''}`}>
								{isLoading ? <CircularProgress size={24} /> : card.value}
							</div>
							<div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
						</div>
					</div>
				))}
			</div>

			{!isLoading && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
					<div className="p-5 rounded-xl flex flex-col overflow-hidden shadow-md bg-[var(--surface-color)]">
						<h2 className="text-lg font-semibold mb-4 shrink-0">Products by Category</h2>
						{products.length > 0 ? (
							<div className="flex-1 min-h-0">
								<CategoryChart products={products} categories={categories} />
							</div>
						) : (
							<div className="text-gray-400 text-sm">No products found.</div>
						)}
					</div>

					<div className="p-5 rounded-xl flex flex-col overflow-hidden shadow-md bg-[var(--surface-color)]">
						<h2 className="text-lg font-semibold mb-3 shrink-0">Recent Activity</h2>
						<div className="flex-1 min-h-0 overflow-hidden">
							<ActivityFeed logs={logs} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
