/**
 * Unified Content Types
 * Standardized content model across all content types for ActivityPub federation
 *
 * These types represent the INTERNAL content model used for loading, editing,
 * and cross-content operations. For the federation (ActivityPub protocol) model,
 * see the activitypub/ module.
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { BlogFrontmatter } from '../frontmatter/blog.js';
import type { ProductFrontmatter } from '../frontmatter/product.js';
import type { EventFrontmatter } from '../frontmatter/event.js';
import type { VideoFrontmatter } from '../frontmatter/video.js';
import type { NoteFrontmatter } from '../frontmatter/note.js';
import type { ProfileFrontmatter } from '../frontmatter/profile.js';
import type { VideoEmbed, Reference } from '../frontmatter/blog.js';
import type { TransactionMethod, TransactionType } from '../commerce/index.js';
import type { FediverseVisibility } from '../frontmatter/base.js';

// ============================================================================
// Content Type Enum
// ============================================================================

/**
 * All supported content types
 */
export type ContentType =
	| 'blog'
	| 'note'
	| 'product'
	| 'event'
	| 'program'
	| 'video'
	| 'profile';

/**
 * ActivityPub object types that map to our content types
 */
export type ActivityPubObjectType =
	| 'Article'
	| 'Note'
	| 'Page'
	| 'Event'
	| 'Video'
	| 'Person'
	| 'Group';

// ============================================================================
// Program Frontmatter (not defined in its own file)
// ============================================================================

/**
 * Program frontmatter for MDsveX (recurring events/activities)
 */
export interface ProgramFrontmatter {
	// Required
	title: string;
	slug?: string;

	// Program details
	excerpt?: string;
	coverImage?: string;
	coordinator?: {
		name: string;
		handle: string;
	};

	// Schedule
	schedule?: string;
	startDate?: string;
	endDate?: string;
	duration?: string;

	// Location
	location?: string;

	// Capacity
	capacity?: number;
	registrationRequired?: boolean;

	// Categorization
	categories?: string[];
	tags?: string[];

	// Publishing
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	// Visibility
	visibility?: ContentVisibility;
	fediverseVisibility?: ContentVisibility;

	// ActivityPub
	activityPubId?: string;
}

// ============================================================================
// Unified Content Item
// ============================================================================

/**
 * All possible frontmatter types
 */
export type AnyFrontmatter =
	| BlogFrontmatter
	| NoteFrontmatter
	| ProductFrontmatter
	| EventFrontmatter
	| ProgramFrontmatter
	| VideoFrontmatter
	| ProfileFrontmatter;

/**
 * Unified content item interface
 * Used for ActivityPub federation and cross-content operations
 */
export interface UnifiedContentItem<T extends AnyFrontmatter = AnyFrontmatter> {
	/** Content type */
	type: ContentType;

	/** URL-safe slug identifier */
	slug: string;

	/** Author/owner handle (without @) */
	authorHandle: string;

	/** Typed frontmatter based on content type */
	frontmatter: T;

	/** Markdown content body */
	content: string;

	/** Local visibility setting */
	visibility: ContentVisibility;

	/** ActivityPub object ID (if federated) */
	fediverseId?: string;

	/** Fediverse visibility for ActivityPub addressing */
	fediverseVisibility?: ContentVisibility;

	/** Publication date */
	publishedAt: string;

	/** Last update date */
	updatedAt?: string;

	/** File path (for debugging) */
	filePath?: string;
}

// ============================================================================
// Extended Frontmatter Types (with relations and fediverse integration)
// ============================================================================

/**
 * Extended product frontmatter with fediverse and relations
 */
export interface ExtendedProductFrontmatter {
	// Required fields
	name: string;
	slug: string;
	description: string;
	category: string;

	// Transaction methods
	transactions?: TransactionMethod[];
	primaryTransaction?: TransactionType;

	// Related content
	relatedPosts?: string[];
	relatedProducts?: string[];

	// Fediverse
	visibility?: FediverseVisibility;
	activityPubId?: string;

	// All other optional fields from ProductFrontmatter
	price?: number;
	currency?: 'USD' | 'EUR' | 'GBP' | 'free';
	license?: string;
	version?: string;
	featured?: boolean;
	image?: string;
	excerpt?: string;
	tagline?: string;
	tags?: string[];
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;
}

/**
 * Extended blog frontmatter with fediverse and relations
 */
export interface ExtendedBlogFrontmatter {
	// Required fields
	title: string;

	// Publishing
	date?: string;
	publishedAt?: string;
	published?: boolean;
	draft?: boolean;
	featured?: boolean;

	// Author
	author?: {
		name: string;
		handle?: string;
		avatar?: string;
	};

	// Content metadata
	excerpt?: string;
	coverImage?: string;
	readingTime?: number;
	wordCount?: number;

	// Categorization
	categories?: string[];
	tags?: string[];
	series?: string;
	seriesOrder?: number;

	// Related content
	relatedProducts?: string[];
	relatedPosts?: string[];

	// Videos
	videos?: VideoEmbed[];

	// External references
	references?: Reference[];

	// Fediverse
	visibility?: FediverseVisibility;
	activityPubId?: string;

	// SEO
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
}

/**
 * Content item with resolved relations
 */
export interface ContentWithRelations<T> {
	frontmatter: T;
	content: string;
	slug: string;
	filePath?: string;
	relatedItems?: {
		products?: Array<{ slug: string; name: string; excerpt?: string }>;
		posts?: Array<{ slug: string; title: string; excerpt?: string }>;
	};
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if content is a blog post
 */
export function isBlogContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<BlogFrontmatter> {
	return item.type === 'blog';
}

/**
 * Check if content is a note
 */
export function isNoteContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<NoteFrontmatter> {
	return item.type === 'note';
}

/**
 * Check if content is a product
 */
export function isProductContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProductFrontmatter> {
	return item.type === 'product';
}

/**
 * Check if content is an event
 */
export function isEventContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<EventFrontmatter> {
	return item.type === 'event';
}

/**
 * Check if content is a program
 */
export function isProgramContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProgramFrontmatter> {
	return item.type === 'program';
}

/**
 * Check if content is a video
 */
export function isVideoContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<VideoFrontmatter> {
	return item.type === 'video';
}

/**
 * Check if content is a profile
 */
export function isProfileContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProfileFrontmatter> {
	return item.type === 'profile';
}

// ============================================================================
// ActivityPub Type Mapping
// ============================================================================

/**
 * Map content type to ActivityPub object type
 */
export function getContentActivityPubType(type: ContentType): ActivityPubObjectType {
	switch (type) {
		case 'blog':
			return 'Article';
		case 'note':
			return 'Note';
		case 'product':
			return 'Page';
		case 'event':
		case 'program':
			return 'Event';
		case 'video':
			return 'Video';
		case 'profile':
			return 'Person';
		default:
			return 'Note';
	}
}

/**
 * Map ActivityPub object type to content type
 */
export function getActivityPubContentType(apType: string): ContentType | null {
	switch (apType) {
		case 'Article':
			return 'blog';
		case 'Note':
			return 'note';
		case 'Page':
			return 'product';
		case 'Event':
			return 'event';
		case 'Video':
			return 'video';
		case 'Person':
		case 'Group':
		case 'Organization':
		case 'Application':
		case 'Service':
			return 'profile';
		default:
			return null;
	}
}

// ============================================================================
// Content URL Helpers
// ============================================================================

/**
 * Generate canonical URL for content
 */
export function getContentUrl(item: UnifiedContentItem, baseUrl: string): string {
	const base = baseUrl.replace(/\/$/, '');

	switch (item.type) {
		case 'blog':
			return `${base}/blog/${item.slug}`;
		case 'note':
			return `${base}/@${item.authorHandle}/notes/${item.slug}`;
		case 'product':
			return `${base}/products/${item.slug}`;
		case 'event':
			return `${base}/events/${item.slug}`;
		case 'program':
			return `${base}/programs/${item.slug}`;
		case 'video':
			return `${base}/videos/${item.slug}`;
		case 'profile':
			return `${base}/@${item.slug}`;
		default:
			return `${base}/${item.slug}`;
	}
}

/**
 * Generate ActivityPub ID for content
 */
export function getContentActivityPubId(item: UnifiedContentItem, baseUrl: string): string {
	// If already has a fediverse ID, use it
	if (item.fediverseId) {
		return item.fediverseId;
	}

	const base = baseUrl.replace(/\/$/, '');

	switch (item.type) {
		case 'blog':
			return `${base}/ap/articles/${item.slug}`;
		case 'note':
			return `${base}/ap/users/${item.authorHandle}/notes/${item.slug}`;
		case 'product':
			return `${base}/ap/pages/${item.slug}`;
		case 'event':
			return `${base}/ap/events/${item.slug}`;
		case 'program':
			return `${base}/ap/events/programs/${item.slug}`;
		case 'video':
			return `${base}/ap/videos/${item.slug}`;
		case 'profile':
			return `${base}/ap/users/${item.slug}`;
		default:
			return `${base}/ap/objects/${item.slug}`;
	}
}

// ============================================================================
// Content Display Helpers
// ============================================================================

/**
 * Get display title for any content type
 */
export function getContentTitle(item: UnifiedContentItem): string {
	const fm = item.frontmatter as Record<string, unknown>;
	return (fm.title as string) || (fm.name as string) || (fm.displayName as string) || item.slug;
}

/**
 * Get display excerpt for any content type
 */
export function getContentExcerpt(item: UnifiedContentItem): string | undefined {
	const fm = item.frontmatter as Record<string, unknown>;
	return (fm.excerpt as string) || (fm.description as string) || (fm.bio as string);
}

/**
 * Get cover/featured image for any content type
 */
export function getContentImage(item: UnifiedContentItem): string | undefined {
	const fm = item.frontmatter as Record<string, unknown>;
	return (
		(fm.coverImage as string) ||
		(fm.featuredImage as string) ||
		(fm.image as string) ||
		(fm.thumbnailUrl as string) ||
		(fm.avatar as string)
	);
}

/**
 * Get author/owner info for any content type
 */
export function getContentAuthor(item: UnifiedContentItem): {
	handle: string;
	name?: string;
	avatar?: string;
} {
	const fm = item.frontmatter as Record<string, unknown>;

	// Try various author field patterns
	if (typeof fm.author === 'object' && fm.author !== null) {
		const author = fm.author as Record<string, unknown>;
		return {
			handle: (author.handle as string) || item.authorHandle,
			name: author.name as string,
			avatar: author.avatar as string
		};
	}

	if (typeof fm.organizer === 'object' && fm.organizer !== null) {
		const organizer = fm.organizer as Record<string, unknown>;
		return {
			handle: (organizer.handle as string) || item.authorHandle,
			name: organizer.name as string,
			avatar: organizer.avatar as string
		};
	}

	if (typeof fm.coordinator === 'object' && fm.coordinator !== null) {
		const coordinator = fm.coordinator as Record<string, unknown>;
		return {
			handle: (coordinator.handle as string) || item.authorHandle,
			name: coordinator.name as string
		};
	}

	// Profile is its own author
	if (item.type === 'profile') {
		return {
			handle: item.slug,
			name: (fm.name as string) || (fm.displayName as string),
			avatar: (fm.avatar as string) || (fm.image as string)
		};
	}

	return { handle: item.authorHandle };
}
