import { snakeCaseParser } from "../../../lib/utils";
import type { Log } from "../../../types";

const formatDate = (ts: string) =>
	new Date(ts).toLocaleString('en-GB', {
		day: '2-digit', month: '2-digit', year: '2-digit',
		hour: '2-digit', minute: '2-digit',
	});

type Props = { logs: Log[] };

export default function ActivityFeed({ logs }: Props) {
	if (!logs.length) {
		return <div className="text-gray-400 text-sm">No recent activity.</div>;
	}

	return (
		<div className="flex flex-col gap-1 overflow-auto h-full">
			{logs.map((log) => (
				<div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--hover-color)]">
					<div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
					<div className="flex-1 min-w-0">
						<div className="font-medium text-sm truncate">
							{snakeCaseParser(log.event)}
						</div>
						{log.user && (
							<div className="text-gray-500 text-xs truncate mt-0.5">
								User: {log.user.email}
							</div>
						)}
						{log.product && (
							<div className="text-gray-500 text-xs truncate mt-0.5">
								Product: {log.product.name}
							</div>
						)}
						{log.category && (
							<div className="text-gray-500 text-xs truncate mt-0.5">
								Category: {log.category.name}
							</div>
						)}
					</div>
					<div className="text-gray-400 text-xs shrink-0">{formatDate(log.timestamp)}</div>
				</div>
			))}
		</div>
	);
}
