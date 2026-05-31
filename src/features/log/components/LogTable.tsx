import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import type { Log } from '../../../types';
import { snakeCaseParser } from '../../../lib/utils';

const formatDate = (ts: string) =>
	new Date(ts).toLocaleString('en-GB', {
		day: '2-digit', month: '2-digit', year: '2-digit',
		hour: '2-digit', minute: '2-digit', second: '2-digit',
	});

type Props = {
	logs: Log[];
	isFetching: boolean;
	onScrollEnd: () => void;
};

export default function LogTable({ logs, isFetching, onScrollEnd }: Props) {
	const navigate = useNavigate();
	const containerRef = useRef<HTMLDivElement>(null);

	const handleScroll = useCallback(() => {
		const el = containerRef.current;
		if (!el) return;
		if (Math.ceil(el.scrollTop) + el.offsetHeight >= el.scrollHeight) {
			onScrollEnd();
		}
	}, [onScrollEnd]);

	const handleNavigate = (route: string) => {
		navigate(`/${route}`);
	};

	return (
		<div
			ref={containerRef}
			onScroll={handleScroll}
			className="overflow-y-scroll h-full"
		>
			<table>
				<thead>
					<tr>
						{['Date', 'Event', 'Data', 'Details'].map((h) => (
							<th key={h} className="text-left sticky top-0 bg-white z-10 px-3 py-2 font-semibold text-sm w-28">
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{logs.map((log, i) => {
						return (
							<tr key={`${log.id}-${i}`} className="border-b hover:bg-gray-50">
								<td className="px-3 py-2 text-sm whitespace-nowrap">{formatDate(log.timestamp)}</td>
								<td className="px-3 py-2 text-sm">{snakeCaseParser(log.event)}</td>
								<td className="px-3 py-2 text-sm">
									<div className="flex items-center flex-wrap gap-1">
										{log.user && (
											<>
												<span className="text-gray-500">User:</span>
												<span
													className="underline cursor-pointer hover:text-[#009ddc]"
													onClick={() => handleNavigate('users')}
												>
													{log.user.email || '-'}
												</span>
											</>
										)}
										{log.product && (
											<>
												<span className="text-gray-500 ml-1">Product:</span>
												<span
													className="underline cursor-pointer hover:text-[#009ddc]"
													onClick={() => handleNavigate('products')}
												>
													{log.product.name || '-'}
												</span>
											</>
										)}
										{log.category && (
											<>
												<span className="text-gray-500 ml-1">Category:</span>
												<span
													className="underline cursor-pointer hover:text-[#009ddc]"
													onClick={() => handleNavigate('categories')}
												>
													{log.category.name || '-'}
												</span>
											</>
										)}
									</div>
								</td>
								<td className="px-3 py-2 text-sm">{log.details || '-'}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{isFetching && (
				<div className="flex justify-center py-4">
					<CircularProgress size={28} />
				</div>
			)}
		</div>
	);
}