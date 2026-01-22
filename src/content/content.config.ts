import { defineCollection, z } from 'astro:content';

// Portfolio content collections
const portfolio = defineCollection({
	type: 'content',
	schema: z.object({
		// Hero section
		greeting: z.string().optional(),
		name: z.string(),
		role: z.string(),
		description: z.string(),
		primaryButtonText: z.string().optional(),
		primaryButtonHref: z.string().optional(),
		secondaryButtonText: z.string().optional(),
		secondaryButtonHref: z.string().optional(),
		backgroundImage: z.string().optional(),
	}),
});

const about = defineCollection({
	type: 'content',
	schema: z.object({
		showImage: z.boolean().optional().default(true),
		imageUrl: z.string().optional(),
		imageAlt: z.string().optional(),
	}),
});

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		projectUrl: z.string().optional(),
		codeUrl: z.string().optional(),
		image: z.string().optional(),
		featured: z.boolean().optional().default(false),
		category: z.string().optional(), // Category for grouping projects (work, ventures, playground)
	}),
});

const skills = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		skills: z.array(z.string()),
	}),
});

const contact = defineCollection({
	type: 'content',
	schema: z.object({
		description: z.string(),
		email: z.string(),
		socialLinks: z.array(z.object({
			name: z.string(),
			url: z.string(),
			icon: z.string(),
		})).optional(),
	}),
});

export const collections = {
	portfolio,
	about,
	projects,
	skills,
	contact,
};
