import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Product, Category } from '../../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
	'#22c55e', '#ef4444', '#3b82f6', '#f97316',
	'#84cc16', '#8b5cf6', '#f59e0b', '#14b8a6', '#ec4899',
];

type Props = { products: Product[]; categories: Category[] };

export default function CategoryChart({ products, categories }: Props) {
	const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
	const countByCategory = new Map<string, number>();

	for (const product of products) {
		const name = categoryMap.get(product.categoryId) ?? 'Unknown';
		countByCategory.set(name, (countByCategory.get(name) ?? 0) + 1);
	}

	const labels = Array.from(countByCategory.keys());
	const data = Array.from(countByCategory.values());

	return (
		<Doughnut
			data={{
				labels,
				datasets: [{ data, backgroundColor: CHART_COLORS.slice(0, labels.length), borderWidth: 2 }],
			}}
			options={{
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { position: 'bottom' } },
			}}
		/>
	);
}
