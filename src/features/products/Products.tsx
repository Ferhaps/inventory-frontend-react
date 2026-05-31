import { useState, useMemo } from 'react';
import { IconButton, Menu, MenuItem, CircularProgress, Chip } from '@mui/material';
import { CheckCircle, Cancel, MoreVert } from '@mui/icons-material';
import { toast } from 'sonner';
import { useProducts, useUpdateProductQuantity, useDeleteProduct } from './hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories.api';
import AddProductDialog from './components/AddProductDialog';
import { useAuthStore } from '../../stores/auth.store';
import type { Product } from '../../types';
import DeleteConfirmDialog from '../../shared/components/DeleteDialog';

const formatDate = (d: string) =>
	new Date(d).toLocaleDateString('en-GB').replace(/\//g, '.');

export default function Products() {
	const { data: allProducts = [], isLoading: productsLoading } = useProducts();
	const { data: categories = [], isLoading: categoriesLoading } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	});
	const { mutate: updateQuantity } = useUpdateProductQuantity();
	const { mutate: deleteProduct } = useDeleteProduct();
	const user = useAuthStore((s) => s.user);
	const isAdmin = user?.role === 'ADMIN';

	const [currentCategoryId, setCurrentCategoryId] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState('');
	const [addOpen, setAddOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [menuProduct, setMenuProduct] = useState<Product | null>(null);
	// track edited quantities locally: productId -> newQuantity
	const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({});

	// Set first category as default once loaded
	const activeCategoryId = currentCategoryId || categories[0]?.id || '';

	const filteredProducts = useMemo(() => {
		const byCat = allProducts.filter((p) => p.categoryId === activeCategoryId);
		const term = searchTerm.toLowerCase();
		if (!term) return byCat;
		return [...byCat].sort((a, b) => {
			const aMatch = a.name.toLowerCase().includes(term) ? 0 : 1;
			const bMatch = b.name.toLowerCase().includes(term) ? 0 : 1;
			return aMatch - bMatch;
		});
	}, [allProducts, activeCategoryId, searchTerm]);

	const getQuantity = (product: Product) =>
		editedQuantities[product.id] ?? product.quantity;

	const handleQuantityChange = (productId: string, value: number) => {
		setEditedQuantities((prev) => ({ ...prev, [productId]: value }));
	};

	const handleQuantityReset = (product: Product) => {
		setEditedQuantities((prev) => {
			const next = { ...prev };
			delete next[product.id];
			return next;
		});
	};

	const handleQuantityConfirm = (product: Product) => {
		const newQty = getQuantity(product);
		updateQuantity({ id: product.id, quantity: newQty }, {
			onSuccess: () => {
				handleQuantityReset(product);
				toast.success('Quantity updated successfully');
			},
			onError: () => handleQuantityReset(product),
		});
	};

	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteProduct(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
	};

	const openMenu = (e: React.MouseEvent<HTMLElement>, product: Product) => {
		setMenuAnchor(e.currentTarget);
		setMenuProduct(product);
	};
	const closeMenu = () => { setMenuAnchor(null); setMenuProduct(null); };

	const isLoading = productsLoading || categoriesLoading;

	return (
		<div className="w-full h-full mx-4">
			{/* Toolbar */}
			<div className="flex items-center flex-wrap my-4 gap-4">
				<h1 className="text-2xl font-bold">Products</h1>
				{isAdmin && (
					<span
						className="text-[#009DDC] cursor-pointer font-medium"
						onClick={() => setAddOpen(true)}
					>
						+ add
					</span>
				)}

				<input
					type="text"
					placeholder="Search products..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#009ddc]"
				/>

				<div className="flex gap-2 flex-wrap">
					{categories.map((cat) => (
						<Chip
							key={cat.id}
							label={cat.name}
							onClick={() => { setCurrentCategoryId(cat.id); setSearchTerm(''); }}
							color={activeCategoryId === cat.id ? 'primary' : 'default'}
							variant={activeCategoryId === cat.id ? 'filled' : 'outlined'}
							clickable
						/>
					))}
				</div>
			</div>

			<div className="overflow-y-auto min-h-[370px] shadow-md rounded">
				{isLoading ? (
					<div className="flex justify-center items-center h-40">
						<CircularProgress />
					</div>
				) : (
					<table>
						<thead>
							<tr className="border-b sticky top-0 bg-[var(--surface-color)] z-10">
								<th className="text-left px-4 py-3 font-semibold text-lg">Name</th>
								<th className="text-left px-4 py-3 font-semibold text-lg">Quantity</th>
								<th className="text-left px-4 py-3 font-semibold text-lg">Date created</th>
								<th className="text-left px-4 py-3 font-semibold text-lg">Date updated</th>
								{isAdmin && (
									<th className="text-left px-4 py-3 font-semibold text-lg">Actions</th>
								)}
							</tr>
						</thead>
						<tbody>
							{filteredProducts.map((product) => {
								const editedQty = getQuantity(product);
								const isDirty = editedQty !== product.quantity;

								return (
									<tr key={product.id} className="border-b hover:bg-[var(--hover-color)]">
										<td className="px-4 py-2">{product.name}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<input
													type="number"
													value={editedQty}
													onChange={(e) =>
														handleQuantityChange(product.id, Number(e.target.value))
													}
													className="border border-gray-300 rounded px-2 py-1 w-20 text-sm focus:outline-none focus:border-[#009ddc]"
												/>
												<div className={`flex items-center gap-1 ${isDirty ? 'visible' : 'invisible'}`}>
													<IconButton
														size="small"
														sx={{ color: 'green' }}
														onClick={() => handleQuantityConfirm(product)}
													>
														<CheckCircle />
													</IconButton>
													<IconButton
														size="small"
														sx={{ color: 'red' }}
														onClick={() => handleQuantityReset(product)}
													>
														<Cancel />
													</IconButton>
												</div>
											</div>
										</td>
										<td className="px-4 py-2">{formatDate(product.createdAt)}</td>
										<td className="px-4 py-2">{formatDate(product.updatedAt)}</td>
										{isAdmin && (
											<td className="px-4 py-2">
												<IconButton onClick={(e) => openMenu(e, product)}>
													<MoreVert />
												</IconButton>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
				<MenuItem
					onClick={() => { setDeleteTarget(menuProduct); closeMenu(); }}
					sx={{ color: 'error.main', fontWeight: 500 }}
				>
					Delete
				</MenuItem>
			</Menu>

			<AddProductDialog
				open={addOpen}
				categories={categories}
				currentCategoryId={activeCategoryId}
				onClose={() => setAddOpen(false)}
			/>
			<DeleteConfirmDialog
				open={Boolean(deleteTarget)}
				label={`product: ${deleteTarget?.name ?? ''}`}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}