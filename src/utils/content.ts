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
		const about = aboutEntries.find(entry => entry.id === 'index');
		
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
		const aboutParagraphs = about?.body 
			? about.body.split('\n\n').filter(p => p.trim())
			: [];

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
				paragraphs: aboutParagraphs,
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
