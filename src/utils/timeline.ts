/**
 * Timeline utility functions for loading and processing timeline entries
 */

export interface TimelineEntry {
	title: string;
	date: string;
	category: string;
	icon?: string;
	Content: any;
	slug: string;
}

/**
 * Get all timeline entries sorted by date
 */
export async function getTimelineEntries(): Promise<TimelineEntry[]> {
	// In Astro, we'll use glob to import all markdown files
	const allEntries = import.meta.glob<{ frontmatter: any; Content: any }>(
		'../content/timeline/*.md',
		{ eager: true }
	);

	const entries: TimelineEntry[] = [];

	for (const path in allEntries) {
		const entry = allEntries[path];
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		
		// Handle special case for "today"
		let date = entry.frontmatter.date;
		if (slug === 'today') {
			date = 'Today';
		}

		entries.push({
			title: entry.frontmatter.title,
			date: date,
			category: entry.frontmatter.category,
			icon: entry.frontmatter.icon || '',
			Content: entry.Content,
			slug: slug,
		});
	}

	// Sort entries by date (convert to number for proper sorting)
	return entries.sort((a, b) => {
		const dateA = a.date === 'Today' ? new Date().getFullYear() + 1 : parseInt(a.date);
		const dateB = b.date === 'Today' ? new Date().getFullYear() + 1 : parseInt(b.date);
		return dateA - dateB;
	});
}

/**
 * Format date for display
 */
export function formatTimelineDate(date: string): string {
	if (date === 'Today') {
		return 'Today';
	}
	return date;
}

/**
 * Check if entry is in the future
 */
export function isFutureDate(date: string): boolean {
	if (date === 'Today') return false;
	const year = parseInt(date);
	return year > new Date().getFullYear();
}

/**
 * Check if entry is current/present
 */
export function isCurrentDate(date: string): boolean {
	return date === 'Today' || parseInt(date) === new Date().getFullYear();
}