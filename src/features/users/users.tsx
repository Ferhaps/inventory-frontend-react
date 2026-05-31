import { useState } from 'react';
import { IconButton, Menu, MenuItem, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useUsers, useDeleteUser } from './hooks/useUsers';
import { useAuthStore } from '../../stores/auth.store';
import type { User } from '../../types';
import RegisterUserDialog from './components/RegisterUserPopup';
import DeleteConfirmDialog from '../../shared/components/DeleteDialog';

export default function Users() {
	const { data: users = [], isLoading } = useUsers();
	const { mutate: deleteUser } = useDeleteUser();
	const loggedUser = useAuthStore((s) => s.user);
	const isAdmin = loggedUser?.role === 'ADMIN';

	const [registerOpen, setRegisterOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [menuUser, setMenuUser] = useState<User | null>(null);

	// Users can only be deleted by ADMIN and not by themselves
	const isDeletable = (user: User) =>
		isAdmin && user.id !== loggedUser?.id;

	const openMenu = (e: React.MouseEvent<HTMLElement>, user: User) => {
		setMenuAnchor(e.currentTarget);
		setMenuUser(user);
	};

	const closeMenu = () => {
		setMenuAnchor(null);
		setMenuUser(null);
	};

	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteUser(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
	};

	return (
		<div className="w-full h-full mx-4">
			<div className="flex items-center my-4 gap-4">
				<h1 className="text-2xl font-bold">Users</h1>
				{isAdmin && (
					<span
						className="text-[#009DDC] cursor-pointer font-medium"
						onClick={() => setRegisterOpen(true)}
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
								<th className="text-left px-4 py-3 font-semibold text-lg">Email</th>
								<th className="text-left px-4 py-3 font-semibold text-lg">Role</th>
								{isAdmin && (
									<th className="text-left px-4 py-3 font-semibold text-lg">Actions</th>
								)}
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id} className="border-b hover:bg-[var(--hover-color)]">
									<td className="px-4 py-2">{user.email}</td>
									<td className="px-4 py-2">{user.role}</td>
									{isAdmin && (
										<td className="px-4 py-2">
											{isDeletable(user) && (
												<IconButton onClick={(e) => openMenu(e, user)}>
													<MoreVert />
												</IconButton>
											)}
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
					onClick={() => { setDeleteTarget(menuUser); closeMenu(); }}
					sx={{ color: 'error.main', fontWeight: 500 }}
				>
					Delete
				</MenuItem>
			</Menu>

			<RegisterUserDialog open={registerOpen} onClose={() => setRegisterOpen(false)} />
			<DeleteConfirmDialog
				open={Boolean(deleteTarget)}
				label={`user: ${deleteTarget?.email ?? ''}`}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}
