import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function Layout() {
	useDocumentTitle();
	return (
		<div className="flex flex-col h-screen">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Outlet />
			</div>
		</div>
	);
}