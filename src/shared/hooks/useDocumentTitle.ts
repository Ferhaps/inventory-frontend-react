import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

export function useDocumentTitle() {
	const matches = useMatches();

	useEffect(() => {
		const match = [...matches].reverse().find(m => (m.handle as { title?: string })?.title);
		const title = (match?.handle as { title?: string })?.title;
		if (title) document.title = title;
	}, [matches]);
}
