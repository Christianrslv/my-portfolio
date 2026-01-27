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

		// Load about - use glob to get both frontmatter and raw content
		const aboutFiles = import.meta.glob<{ frontmatter: any }>('../content/about/*.md', { eager: true });
		const aboutRawFiles = import.meta.glob<string>('../content/about/*.md?raw', { eager: true, import: 'default' });
		
		const aboutFile = aboutFiles['../content/about/index.md'];
		const aboutRawContent = aboutRawFiles['../content/about/index.md?raw'];
		
		let aboutParagraphs: string[] = [];
		const aboutData = aboutFile?.frontmatter || {};
		
		if (aboutRawContent && typeof aboutRawContent === 'string') {
			// Remove frontmatter (everything between --- markers)
			const contentWithoutFrontmatter = aboutRawContent.replace(/^---[\s\S]*?---\s*\n\n?/, '').trim();
			// Split by double newlines to get paragraphs
			aboutParagraphs = contentWithoutFrontmatter
				.split(/\n\s*\n/)
				.map((p: string) => p.trim())
				.filter((p: string) => p.length > 0 && !p.startsWith('#'));
			console.log('[Content-Simple] About paragraphs from raw:', aboutParagraphs.length);
		} else if (aboutFile) {
			console.warn('[Content-Simple] Could not get raw content for about, trying alternative');
		}
		
		console.log('[Content-Simple] About paragraphs:', aboutParagraphs);

		// Load projects
		const projectFiles = import.meta.glob<{ frontmatter: any }>('../content/projects/*.md', { eager: true });
		const projects = Object.values(projectFiles)
			.map((file: any) => ({
				title: file.frontmatter.title,
				description: file.frontmatter.description,
				technologies: file.frontmatter.technologies || [],
				projectUrl: file.frontmatter.projectUrl || '#',
				codeUrl: file.frontmatter.codeUrl || '#',
				category: file.frontmatter.category,
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
