import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	IconButton,
	Menu,
	MenuItem,
	Switch,
	Divider,
} from '@mui/material';
import {
	Dashboard,
	List,
	Category,
	People,
	TableChart,
	MoreVert,
	Logout,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';

const NAV_ITEMS = [
	{ label: 'Dashboard', path: '/dashboard', icon: <Dashboard fontSize="small" /> },
	{ label: 'Products', path: '/products', icon: <List fontSize="small" /> },
	{ label: 'Categories', path: '/categories', icon: <Category fontSize="small" /> },
	{ label: 'Users', path: '/users', icon: <People fontSize="small" /> },
	{ label: 'Log', path: '/log', icon: <TableChart fontSize="small" /> },
];

export default function Header() {
	const logout = useAuthStore((s) => s.logout);
	const { isDark, toggleTheme } = useThemeStore();
	const navigate = useNavigate();

	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

	const handleLogout = () => {
		setMenuAnchor(null);
		logout();
		navigate('/login', { replace: true });
	};

	return (
		<header
			className="flex items-center gap-8 text-white border-b border-black/10 pr-4"
			style={{ backgroundColor: 'var(--primary-color)', minHeight: 'var(--header-height)' }}
		>
			<nav className="flex items-center gap-4 ml-4">
				{NAV_ITEMS.map((item) => (
					<NavLink
						key={item.path}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center gap-2 cursor-pointer text-sm font-medium no-underline py-1 px-2.5 rounded-md transition-all duration-150 ${isActive
								? 'bg-white text-black'
								: 'text-white hover:bg-white hover:text-black'
							}`
						}
					>
						{item.icon}
						<span>{item.label}</span>
					</NavLink>
				))}
			</nav>

			<div className="ml-auto flex items-center">
				{/* Dark mode toggle — MatSlideToggle equivalent */}
				<label className="flex items-center gap-2 cursor-pointer text-sm" style={{ minWidth: 120 }}>
					<Switch checked={isDark} onChange={toggleTheme} size="small" />
					Dark Mode
				</label>

				<div className="mx-4">
					<Divider
						orientation="vertical"
						flexItem sx={{ borderColor: 'rgba(255,255,255,0.4)', alignSelf: 'center', height: 30 }}
					/>
				</div>

				<IconButton
					className="ml-4"
					sx={{ color: '#fff' }}
					onClick={(e) => setMenuAnchor(e.currentTarget)}
				>
					<MoreVert />
				</IconButton>

				<Menu
					anchorEl={menuAnchor}
					open={Boolean(menuAnchor)}
					onClose={() => setMenuAnchor(null)}
				>
					<MenuItem onClick={handleLogout} sx={{ gap: 1, color: 'error.main' }}>
						<Logout fontSize="small" />
						<span>Logout</span>
					</MenuItem>
				</Menu>
			</div>
		</header>
	);
}