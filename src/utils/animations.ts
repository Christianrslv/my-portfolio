/**
 * Utility functions for scroll animations and interactions
 */

/**
 * Initialize smooth scroll for navigation links
 */
export function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(
				this.getAttribute('href') || ''
			);
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		});
	});
}

/**
 * Initialize intersection observer for fade-in animations
 */
export function initScrollAnimations() {
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px',
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.setAttribute('data-visible', 'true');
			}
		});
	}, observerOptions);

	// Observe all sections
	document.querySelectorAll('.section').forEach((section) => {
		section.setAttribute('data-visible', 'false');
		observer.observe(section);
	});
}

/**
 * Initialize navbar scroll effect
 */
export function initNavbarScroll() {
	let lastScroll = 0;
	window.addEventListener('scroll', () => {
		const navbar = document.querySelector('.navbar') as HTMLElement;
		if (!navbar) return;

		const currentScroll = window.pageYOffset;

		if (currentScroll > 100) {
			navbar.style.background = 'rgba(10, 10, 10, 0.95)';
		} else {
			navbar.style.background = 'rgba(10, 10, 10, 0.8)';
		}

		lastScroll = currentScroll;
	});
}

/**
 * Initialize all animations
 */
export function initAnimations() {
	initSmoothScroll();
	initScrollAnimations();
	initNavbarScroll();
}