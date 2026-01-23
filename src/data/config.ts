/**
 * Portfolio configuration
 * Update this file to customize your portfolio content
 */

export const portfolioConfig = {
	// Navigation
	nav: {
		logo: 'CR',
		links: [
			{ label: 'Home', href: '#home' },
			{ label: 'About', href: '#about' },
			{ label: 'Skills', href: '#skills' },
			{ label: 'Projects', href: '#projects' },
			{ label: 'Timeline', href: '#timeline' },
			{ label: 'Contact', href: '#contact' },
		],
	},

	// Hero section
	hero: {
		greeting: "Hi, I'm",
		name: 'Your Name',
		role: 'Full Stack Developer',
		description:
			'I create beautiful, functional, and user-centered digital experiences. Passionate about clean code and innovative solutions.',
		primaryButton: { text: 'View Work', href: '#projects' },
		secondaryButton: { text: 'Get In Touch', href: '#contact' },
	},

	// About section
	about: {
		paragraphs: [
			"I'm a passionate developer with a love for creating digital experiences that make a difference. With expertise in modern web technologies, I bring ideas to life through clean code and thoughtful design.",
			"When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
		],
		stats: [
			{ number: '50+', label: 'Projects' },
			{ number: '5+', label: 'Years Experience' },
			{ number: '100+', label: 'Happy Clients' },
		],
		showImage: true,
	},

	// Skills section
	skills: {
		categories: [
			{
				title: 'Frontend',
				skills: ['React', 'TypeScript', 'Next.js', 'Astro', 'Tailwind CSS', 'Vue.js'],
			},
			{
				title: 'Backend',
				skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL', 'REST APIs'],
			},
			{
				title: 'Tools & Others',
				skills: ['Git', 'Docker', 'AWS', 'Figma', 'CI/CD', 'Linux'],
			},
		],
	},

	// Projects section
	projects: [
		{
			title: 'Project Name',
			description:
				'A modern web application built with cutting-edge technologies. Features include real-time updates, responsive design, and seamless user experience.',
			technologies: ['React', 'TypeScript', 'Node.js'],
			projectUrl: '#',
			codeUrl: '#',
		},
		{
			title: 'Project Name',
			description:
				'An innovative solution that solves real-world problems with elegant code and intuitive design. Built for scalability and performance.',
			technologies: ['Next.js', 'PostgreSQL', 'Tailwind'],
			projectUrl: '#',
			codeUrl: '#',
		},
		{
			title: 'Project Name',
			description:
				'A full-stack application showcasing modern development practices. Includes authentication, database integration, and API development.',
			technologies: ['Vue.js', 'Python', 'MongoDB'],
			projectUrl: '#',
			codeUrl: '#',
		},
	],

	// Contact section
	contact: {
		description:
			"I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!",
		email: 'your.email@example.com',
		socialLinks: [
			{
				name: 'GitHub',
				url: '#',
				icon: 'github',
			},
			{
				name: 'LinkedIn',
				url: '#',
				icon: 'linkedin',
			},
			{
				name: 'Twitter',
				url: '#',
				icon: 'twitter',
			},
		],
	},

	// Footer
	footer: {
		text: 'Designed & Built with ❤️',
		year: '2024',
	},
};