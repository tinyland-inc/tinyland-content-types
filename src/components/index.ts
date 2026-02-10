/**
 * Content Component Types
 * Shared types for reusable content sub-components
 */

import type { ContentVisibility } from '../visibility/index.js';

// ============================================================================
// Reading Progress Types
// ============================================================================

/**
 * Reading progress variant
 */
export type ProgressVariant = 'circular' | 'bar';

// ============================================================================
// Series Navigation Types
// ============================================================================

/**
 * Post in a series
 */
export interface SeriesPost {
	/** URL slug */
	slug: string;
	/** Post title */
	title: string;
	/** Order within series (1-based) */
	order: number;
}

// ============================================================================
// Author Types
// ============================================================================

/**
 * Author information for content display
 * Supports ActivityPub actor linking
 */
export interface ContentAuthor {
	/** Display name */
	name: string;
	/** Handle/username (without @) */
	handle?: string;
	/** Avatar image URL */
	avatar?: string;
	/** Profile URL (local) */
	url?: string;
	/** ActivityPub actor URL (for federation) */
	actorUrl?: string;
	/** Author bio/description */
	bio?: string;
}

/**
 * Props for AuthorCard component
 */
export interface AuthorCardProps {
	/** Author information */
	author: ContentAuthor;
	/** Display variant */
	variant?: 'compact' | 'full';
	/** Show avatar */
	showAvatar?: boolean;
	/** Show handle link */
	showHandle?: boolean;
	/** Additional CSS classes */
	class?: string;
}

// ============================================================================
// Meta Badge Types
// ============================================================================

/**
 * Props for MetaBadges component
 */
export interface MetaBadgesProps {
	/** Publication date (ISO string) */
	publishedAt?: string;
	/** Last update date (ISO string) */
	updatedAt?: string;
	/** Reading time in minutes */
	readingTime?: number;
	/** Content visibility */
	visibility?: ContentVisibility;
	/** Show publication date */
	showDate?: boolean;
	/** Show reading time */
	showReadingTime?: boolean;
	/** Show visibility badge */
	showVisibility?: boolean;
	/** Show update date if different from publish date */
	showUpdatedAt?: boolean;
	/** Badge size variant */
	size?: 'sm' | 'md' | 'lg';
	/** Additional CSS classes */
	class?: string;
}

// ============================================================================
// Hero Image Types
// ============================================================================

/**
 * Props for HeroImage component
 */
export interface HeroImageProps {
	/** Image source URL */
	src: string;
	/** Alt text for accessibility */
	alt: string;
	/** BlurHash placeholder string */
	blurHash?: string;
	/** Aspect ratio (e.g., '16/9', '4/3', '1/1') */
	aspectRatio?: string;
	/** Show gradient overlay */
	showOverlay?: boolean;
	/** Overlay gradient direction */
	overlayDirection?: 'top' | 'bottom' | 'left' | 'right';
	/** Priority loading (above fold) */
	priority?: boolean;
	/** Additional CSS classes */
	class?: string;
}

// ============================================================================
// Content Title Types
// ============================================================================

/**
 * Badge configuration for content titles
 */
export interface ContentBadge {
	/** Badge label text */
	label: string;
	/** Badge color preset */
	preset?: string;
	/** Icon name (iconify format) */
	icon?: string;
}

/**
 * Props for ContentTitle component
 */
export interface ContentTitleProps {
	/** Main title */
	title: string;
	/** Optional subtitle */
	subtitle?: string;
	/** Status badges (draft, scheduled, etc.) */
	badges?: ContentBadge[];
	/** Heading level (1-6) */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Additional CSS classes */
	class?: string;
}

// ============================================================================
// Frontmatter Normalization
// ============================================================================

/**
 * Normalized frontmatter for display components
 * Flattens various frontmatter formats into consistent structure
 */
export interface NormalizedFrontmatter {
	title: string;
	subtitle?: string;
	excerpt?: string;
	publishedAt?: string;
	updatedAt?: string;
	author?: ContentAuthor;
	heroImage?: string;
	heroBlurHash?: string;
	readingTime?: number;
	visibility?: ContentVisibility;
	isDraft?: boolean;
	isScheduled?: boolean;
	categories?: string[];
	tags?: string[];
}

/**
 * Normalize various frontmatter formats to consistent structure
 */
export function normalizeFrontmatter(
	frontmatter: Record<string, unknown>
): NormalizedFrontmatter {
	// Extract author
	let author: ContentAuthor | undefined;
	if (typeof frontmatter.author === 'object' && frontmatter.author !== null) {
		const a = frontmatter.author as Record<string, unknown>;
		author = {
			name: (a.name as string) || 'Unknown',
			handle: a.handle as string,
			avatar: a.avatar as string,
			url: a.url as string,
			actorUrl: a.actorUrl as string
		};
	} else if (typeof frontmatter.author === 'string') {
		author = { name: frontmatter.author };
	}

	// Try organizer/coordinator as fallback
	if (!author && typeof frontmatter.organizer === 'object') {
		const o = frontmatter.organizer as Record<string, unknown>;
		author = {
			name: (o.name as string) || 'Unknown',
			handle: o.handle as string
		};
	}
	if (!author && typeof frontmatter.coordinator === 'object') {
		const c = frontmatter.coordinator as Record<string, unknown>;
		author = {
			name: (c.name as string) || 'Unknown',
			handle: c.handle as string
		};
	}

	// Extract hero image
	const heroImage =
		(frontmatter.heroImage as string) ||
		(frontmatter.featuredImage as string) ||
		(frontmatter.coverImage as string) ||
		(frontmatter.image as string);

	// Extract dates
	const publishedAt =
		(frontmatter.publishedAt as string) ||
		(frontmatter.date as string) ||
		(frontmatter.createdAt as string);

	const updatedAt =
		(frontmatter.updatedAt as string) || (frontmatter.lastModified as string);

	// Extract visibility
	const visibility = frontmatter.visibility as ContentVisibility | undefined;

	// Determine draft/scheduled status
	const isDraft =
		frontmatter.draft === true ||
		frontmatter.published === false ||
		frontmatter.status === 'draft';

	const isScheduled =
		frontmatter.status === 'scheduled' ||
		(publishedAt !== undefined && publishedAt !== null && new Date(publishedAt) > new Date());

	return {
		title: (frontmatter.title as string) || 'Untitled',
		subtitle:
			(frontmatter.subtitle as string) || (frontmatter.tagline as string),
		excerpt:
			(frontmatter.excerpt as string) || (frontmatter.description as string),
		publishedAt,
		updatedAt,
		author,
		heroImage,
		heroBlurHash: frontmatter.heroBlurHash as string,
		readingTime: frontmatter.readingTime as number,
		visibility,
		isDraft,
		isScheduled,
		categories: frontmatter.categories as string[],
		tags: frontmatter.tags as string[]
	};
}
