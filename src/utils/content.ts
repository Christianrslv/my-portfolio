/**
 * Content loader utility
 * Loads content from Markdown files using Astro Content Collections
 */

import { getCollection } from 'astro:content';

export async function getPortfolioContent() {
	try {
		console.log('[Content] Starting to load portfolio content...');
		
		// List all available collections
		console.log('[Content] Attempting to get portfolio collection...');
		
		const portfolioEntries = await getCollection('portfolio');
		console.log('[Content] Portfolio entries loaded:', portfolioEntries.length);
		console.log('[Content] Portfolio entry IDs:', portfolioEntries.map(e => e.id));
		console.log('[Content] Portfolio entry slugs:', portfolioEntries.map(e => e.slug));
		
		const hero = portfolioEntries.find(entry => entry.id === 'hero' || entry.slug === 'hero');
		
		console.log('[Content] Hero found:', !!hero);
		if (hero) {
			console.log('[Content] Hero entry ID:', hero.id);
			console.log('[Content] Hero entry slug:', hero.slug);
			console.log('[Content] Hero data:', JSON.stringify(hero.data, null, 2));
			console.log('[Content] Hero name:', hero.data.name);
		} else {
			console.warn('[Content] Hero entry not found!');
			console.warn('[Content] Available entries:', portfolioEntries.map(e => ({ id: e.id, slug: e.slug })));
		}
		
		const aboutEntries = await getCollection('about');
		console.log('[Content] About entries found:', aboutEntries.length);
		console.log('[Content] About entry IDs:', aboutEntries.map(e => e.id));
		const about = aboutEntries.find(entry => entry.id === 'index');
		console.log('[Content] About entry found:', !!about);
		
		const projectEntries = await getCollection('projects');
		const projects = projectEntries
			.filter(entry => entry.data.featured !== false)
			.sort((a, b) => {
				// Sort by featured first, then by title
				if (a.data.featured && !b.data.featured) return -1;
				if (!a.data.featured && b.data.featured) return 1;
				return a.data.title.localeCompare(b.data.title);
			});
		
		const skillEntries = await getCollection('skills');
		const skills = skillEntries.sort((a, b) => 
			a.data.title.localeCompare(b.data.title)
		);
		
		const contactEntries = await getCollection('contact');
		const contact = contactEntries.find(entry => entry.id === 'index');
		
		// Parse about paragraphs from body
		// In Astro Content Collections, we need to render() to get the content
		let aboutParagraphs: string[] = [];
		if (about) {
			try {
				const rendered = await about.render();
				// The render() method returns an object with a Content component
				// We need to render it to HTML string to extract text
				// For now, let's try accessing the raw markdown if available
				// Otherwise, we'll need to render the component
				
				// Check if entry has rawBody (some Astro versions expose this)
				if ('rawBody' in about && typeof (about as any).rawBody === 'string') {
					aboutParagraphs = (about as any).rawBody
						.split('\n\n')
						.map((p: string) => p.trim())
						.filter((p: string) => p.length > 0 && !p.startsWith('---'));
					console.log('[Content] About paragraphs from rawBody:', aboutParagraphs.length);
				} else {
					// Fallback: render the component and extract text
					// This is a workaround - ideally we'd have rawBody
					console.warn('[Content] rawBody not available, trying alternative method');
					// For now, return empty array - the simple loader should handle this
					aboutParagraphs = [];
				}
				console.log('[Content] About paragraphs:', aboutParagraphs);
			} catch (error) {
				console.error('[Content] Error processing about content:', error);
				aboutParagraphs = [];
			}
		} else {
			console.warn('[Content] About entry not found!');
		}

		const result = {
			hero: hero ? {
				greeting: hero.data.greeting || "Hi, I'm",
				name: hero.data.name,
				role: hero.data.role,
				description: hero.data.description,
				primaryButton: {
					text: hero.data.primaryButtonText || 'View Work',
					href: hero.data.primaryButtonHref || '#projects',
				},
				secondaryButton: {
					text: hero.data.secondaryButtonText || 'Get In Touch',
					href: hero.data.secondaryButtonHref || '#contact',
				},
				backgroundImage: hero.data.backgroundImage,
			} : null,
			about: about ? {
				paragraphs: aboutParagraphs.length > 0 ? aboutParagraphs : undefined,
				showImage: about.data.showImage ?? true,
				imageUrl: about.data.imageUrl,
				imageAlt: about.data.imageAlt || 'Profile photo',
			} : null,
			projects: projects.map(entry => ({
				title: entry.data.title,
				description: entry.data.description,
				technologies: entry.data.technologies,
				projectUrl: entry.data.projectUrl || '#',
				codeUrl: entry.data.codeUrl || '#',
				category: entry.data.category,
			})),
			skills: {
				categories: skills.map(entry => ({
					title: entry.data.title,
					skills: entry.data.skills,
				})),
			},
			contact: contact ? {
				description: contact.data.description,
				email: contact.data.email,
				socialLinks: contact.data.socialLinks || [],
			} : null,
		};
		
		console.log('[Content] Successfully loaded content:', {
			hasHero: !!result.hero,
			heroName: result.hero?.name,
		});
		
		return result;
	} catch (error) {
		console.error('[Content] Error loading content:', error);
		if (error instanceof Error) {
			console.error('[Content] Error message:', error.message);
			console.error('[Content] Error stack:', error.stack);
		}
		// Return null to fall back to config.ts
		return null;
	}
}
