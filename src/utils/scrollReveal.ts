/**
 * Scroll-based reveal system for the entire site
 * Creates a non-traditional scrolling experience where content appears on screen
 */

export interface ScrollSection {
	id: string;
	element: HTMLElement;
	order: number;
}

let sections: ScrollSection[] = [];
let currentSectionIndex = 0;
let isScrolling = false;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Initialize scroll reveal system
 */
export function initScrollReveal() {
	// Get all sections in order
	const sectionElements = document.querySelectorAll<HTMLElement>('.scroll-section');
	sections = Array.from(sectionElements).map((el, index) => ({
		id: el.id || `section-${index}`,
		element: el,
		order: index,
	}));

	if (sections.length === 0) return;

	// Set initial state
	updateSectionVisibility(0);
	
	// Add scroll listener
	window.addEventListener('wheel', handleWheel, { passive: false });
	window.addEventListener('touchstart', handleTouchStart, { passive: false });
	window.addEventListener('touchmove', handleTouchMove, { passive: false });
	
	// Prevent default scroll behavior
	document.body.style.overflow = 'hidden';
	
	// Handle keyboard navigation
	document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handle wheel events for section navigation
 */
function handleWheel(e: WheelEvent) {
	if (isScrolling) {
		e.preventDefault();
		return;
	}

	e.preventDefault();
	
	const delta = e.deltaY;
	const threshold = 50; // Minimum scroll delta to trigger section change
	
	if (Math.abs(delta) < threshold) return;
	
	if (delta > 0) {
		// Scroll down - next section
		goToNextSection();
	} else {
		// Scroll up - previous section
		goToPreviousSection();
	}
}

let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e: TouchEvent) {
	touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e: TouchEvent) {
	if (isScrolling) {
		e.preventDefault();
		return;
	}
	
	touchEndY = e.touches[0].clientY;
	const delta = touchEndY - touchStartY;
	const threshold = 50;
	
	if (Math.abs(delta) < threshold) return;
	
	e.preventDefault();
	
	if (delta > 0) {
		goToPreviousSection();
	} else {
		goToNextSection();
	}
	
	touchStartY = touchEndY;
}

/**
 * Handle keyboard navigation
 */
function handleKeyDown(e: KeyboardEvent) {
	if (isScrolling) return;
	
	if (e.key === 'ArrowDown' || e.key === 'PageDown') {
		e.preventDefault();
		goToNextSection();
	} else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
		e.preventDefault();
		goToPreviousSection();
	} else if (e.key === 'Home') {
		e.preventDefault();
		goToSection(0);
	} else if (e.key === 'End') {
		e.preventDefault();
		goToSection(sections.length - 1);
	}
}

/**
 * Navigate to next section
 */
function goToNextSection() {
	if (currentSectionIndex < sections.length - 1) {
		goToSection(currentSectionIndex + 1);
	}
}

/**
 * Navigate to previous section
 */
function goToPreviousSection() {
	if (currentSectionIndex > 0) {
		goToSection(currentSectionIndex - 1);
	}
}

/**
 * Navigate to specific section
 */
export function goToSection(index: number) {
	if (index < 0 || index >= sections.length || isScrolling) return;
	
	isScrolling = true;
	currentSectionIndex = index;
	
	updateSectionVisibility(index);
	
	// Update URL hash without scrolling
	if (sections[index].id) {
		window.history.replaceState(null, '', `#${sections[index].id}`);
	}
	
	// Reset scroll lock after animation
	if (scrollTimeout) clearTimeout(scrollTimeout);
	scrollTimeout = setTimeout(() => {
		isScrolling = false;
	}, 800); // Match animation duration
}

/**
 * Update section visibility based on current index
 */
function updateSectionVisibility(activeIndex: number) {
	sections.forEach((section, index) => {
		const element = section.element;
		
		if (index === activeIndex) {
			element.classList.add('active');
			element.classList.remove('prev', 'next');
			element.setAttribute('data-visible', 'true');
		} else if (index < activeIndex) {
			element.classList.add('prev');
			element.classList.remove('active', 'next');
			element.setAttribute('data-visible', 'false');
		} else {
			element.classList.add('next');
			element.classList.remove('active', 'prev');
			element.setAttribute('data-visible', 'false');
		}
	});
	
	// Dispatch custom event for scroll indicator
	window.dispatchEvent(new CustomEvent('sectionchange', {
		detail: { index: activeIndex }
	}));
}

/**
 * Get current section index
 */
export function getCurrentSectionIndex(): number {
	return currentSectionIndex;
}

/**
 * Get total number of sections
 */
export function getTotalSections(): number {
	return sections.length;
}