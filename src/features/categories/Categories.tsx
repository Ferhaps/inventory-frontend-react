import { useState } from 'react';
import { IconButton, Menu, MenuItem, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useCategories, useDeleteCategory } from './hooks/useCategories';
import { useAuthStore } from '../../stores/auth.store';
import type { Category } from '../../types';
import AddCategoryDialog from './components/AddCategoryPopup';
import DeleteConfirmDialog from '../../shared/components/DeleteDialog';

export default function Categories() {
	const { data: categories = [], isLoading } = useCategories();
	const { mutate: deleteCategory } = useDeleteCategory();
	const user = useAuthStore((s) => s.user);
	const isAdmin = user?.role === 'ADMIN';

	const [addOpen, setAddOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [menuCategory, setMenuCategory] = useState<Category | null>(null);

	const openMenu = (e: React.MouseEvent<HTMLElement>, category: Category) => {
		setMenuAnchor(e.currentTarget);
		setMenuCategory(category);
	};

	const closeMenu = () => {
		setMenuAnchor(null);
		setMenuCategory(null);
	};

	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteCategory(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
	};

	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString('en-GB').replace(/\//g, '.');

	return (
		<div className="w-full h-full mx-4">
			<div className="flex items-center my-4 gap-4">
				<h1 className="text-2xl font-bold">Categories</h1>
				{isAdmin && (
					<span
						className="text-[#009DDC] cursor-pointer font-medium"
						onClick={() => setAddOpen(true)}
					>
						+ add
					</span>
				)}
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
								<th className="text-left px-4 py-3 font-semibold text-lg">Date created</th>
								<th className="text-left px-4 py-3 font-semibold text-lg">Date updated</th>
								{isAdmin && (
									<th className="text-left px-4 py-3 font-semibold text-lg">Actions</th>
								)}
							</tr>
						</thead>
						<tbody>
							{categories.map((category) => (
								<tr key={category.id} className="border-b hover:bg-[var(--hover-color)]">
									<td className="px-4 py-2">{category.name}</td>
									<td className="px-4 py-2">{formatDate(category.createdAt)}</td>
									<td className="px-4 py-2">{formatDate(category.updatedAt)}</td>
									{isAdmin && (
										<td className="px-4 py-2">
											<IconButton onClick={(e) => openMenu(e, category)}>
												<MoreVert />
											</IconButton>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
				<MenuItem
					onClick={() => { setDeleteTarget(menuCategory); closeMenu(); }}
					sx={{ color: 'error.main', fontWeight: 500 }}
				>
					Delete
				</MenuItem>
			</Menu>

			<AddCategoryDialog open={addOpen} onClose={() => setAddOpen(false)} />
			<DeleteConfirmDialog
				open={Boolean(deleteTarget)}
				label={`category: ${deleteTarget?.name}. Keep in mind that all the products that belong to this category will be deleted as well`}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}