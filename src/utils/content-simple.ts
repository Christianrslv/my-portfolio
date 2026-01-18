/**
 * Simple content loader using import.meta.glob (like timeline)
 * This is a fallback if Content Collections aren't working
 */

export async function getPortfolioContentSimple() {
	try {
		// Load hero
		const heroFiles = import.meta.glob<{ frontmatter: any }>('../content/portfolio/*.md', { eager: true });
		const heroFile = Object.values(heroFiles).find((file: any) => file.frontmatter);
		const hero = heroFile?.frontmatter;

		// Load about
		const aboutFiles = import.meta.glob<{ frontmatter: any; default: any }>('../content/about/*.md', { eager: true });
		const aboutFile = aboutFiles['../content/about/index.md'];
		const aboutContent = aboutFile?.default?.render?.() || '';
		const aboutParagraphs = aboutContent
			? aboutContent.split('\n\n').filter((p: string) => p.trim() && !p.startsWith('#'))
			: [];
		const aboutData = aboutFile?.frontmatter || {};

		// Load projects
		const projectFiles = import.meta.glob<{ frontmatter: any }>('../content/projects/*.md', { eager: true });
		const projects = Object.values(projectFiles)
			.map((file: any) => ({
				title: file.frontmatter.title,
				description: file.frontmatter.description,
				technologies: file.frontmatter.technologies || [],
				projectUrl: file.frontmatter.projectUrl || '#',
				codeUrl: file.frontmatter.codeUrl || '#',
			}))
			.filter((p: any) => p.title);

		// Load skills
		const skillFiles = import.meta.glob<{ frontmatter: any }>('../content/skills/*.md', { eager: true });
		const skills = Object.values(skillFiles)
			.map((file: any) => ({
				title: file.frontmatter.title,
				skills: file.frontmatter.skills || [],
			}))
			.filter((s: any) => s.title)
			.sort((a: any, b: any) => a.title.localeCompare(b.title));

		// Load contact
		const contactFiles = import.meta.glob<{ frontmatter: any }>('../content/contact/*.md', { eager: true });
		const contactFile = contactFiles['../content/contact/index.md'];
		const contact = contactFile?.frontmatter;

		console.log('[Content-Simple] Hero loaded:', hero);
		console.log('[Content-Simple] Hero name:', hero?.name);
		console.log('[Content-Simple] About data:', aboutData);
		console.log('[Content-Simple] About imageUrl:', aboutData.imageUrl);

		return {
			hero: hero ? {
				greeting: hero.greeting || "Hi, I'm",
				name: hero.name,
				role: hero.role,
				description: hero.description,
				primaryButton: {
					text: hero.primaryButtonText || 'View Work',
					href: hero.primaryButtonHref || '#projects',
				},
				secondaryButton: {
					text: hero.secondaryButtonText || 'Get In Touch',
					href: hero.secondaryButtonHref || '#contact',
				},
				backgroundImage: hero.backgroundImage,
			} : null,
			about: {
				paragraphs: aboutParagraphs,
				showImage: aboutData.showImage !== false,
				imageUrl: aboutData.imageUrl,
				imageAlt: aboutData.imageAlt || 'Profile photo',
			},
			projects,
			skills: {
				categories: skills,
			},
			contact: contact ? {
				description: contact.description,
				email: contact.email,
				socialLinks: contact.socialLinks || [],
			} : null,
		};
	} catch (error) {
		console.error('[Content-Simple] Error:', error);
		return null;
	}
}
