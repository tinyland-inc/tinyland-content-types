/**
 * ActivityPub Content Type Definitions
 * Federation model for AP protocol - these types represent content
 * as it appears in ActivityPub objects.
 *
 * IMPORTANT: These types are DISTINCT from the frontmatter/* types.
 * - frontmatter/* types = internal content model (for loading/editing MDsveX files)
 * - activitypub/* types = federation model (for AP protocol serialization/deserialization)
 *
 * Despite surface-level overlap, they serve different purposes and should NOT be merged.
 */

// ============================================================================
// AP Visibility (re-exported for convenience)
// ============================================================================

export type Visibility = 'public' | 'unlisted' | 'followers' | 'private';

// ============================================================================
// Base Content Interface
// ============================================================================

export interface BaseContent {
	id?: string;
	slug: string;
	title?: string;
	description?: string;
	excerpt?: string;
	content: string;
	featuredImage?: string;
	tags: string[];
	categories: string[];
	authorHandle: string;
	authorName?: string;
	authorAvatar?: string;
	visibility: Visibility;
	date: string;
	publishedAt: string;
	updatedAt?: string;
	wordCount?: number;
	readingTime?: number;
}

// ============================================================================
// Blog Post (Article)
// ============================================================================

export interface BlogPost extends BaseContent {
	type: 'blog-post';
	title: string; // Required
	coverImage?: string;
}

// ============================================================================
// Note (Micro-post/Status Update)
// ============================================================================

export interface APNote extends BaseContent {
	type: 'note';
	title?: string; // Optional
	replyTo?: string; // ActivityPub object URI
	inReplyTo?: string[];
	mood?: string;
	sensitive?: boolean;
	spoilerText?: string;
}

// ============================================================================
// Product (Page/Item)
// ============================================================================

export interface APProduct extends BaseContent {
	type: 'product';
	name: string; // Required (maps to title)
	price?: string;
	currency?: string;
	license?: string;
	githubUrl?: string;
	demoUrl?: string;
	downloadUrl?: string;
	coverImage?: string;
}

// ============================================================================
// Profile (Person/Group)
// ============================================================================

export interface APProfile extends BaseContent {
	type: 'profile';
	name: string; // Required
	location?: string;
	website?: string;
	pronouns?: string;
	pronounSet?: string[];
}

// ============================================================================
// Event (Event)
// ============================================================================

export interface APEvent extends BaseContent {
	type: 'event';
	name: string; // Required
	startDate: string; // ISO 8601
	endDate?: string;
	location?: string;
	isOnline?: boolean;
	status?: 'tentative' | 'confirmed' | 'cancelled';
}

// ============================================================================
// Image (Media)
// ============================================================================

export interface APImage extends BaseContent {
	type: 'image';
	title?: string;
	alt: string;
	url: string;
	width?: number;
	height?: number;
	blurhash?: string;
}

// ============================================================================
// Video (Media - PeerTube compatible)
// ============================================================================

export interface APVideo extends BaseContent {
	type: 'video';
	title: string; // Required
	url: string; // Direct video URL
	thumbnailUrl?: string;
	embedUrl?: string;
	width?: number;
	height?: number;
	duration?: number; // Seconds
	language?: string;
	category?: string;
}

// ============================================================================
// Document (PDF/Docs)
// ============================================================================

export interface APDocument extends BaseContent {
	type: 'document';
	title: string; // Required
	url: string; // PDF URL
	pages?: number;
	fileType?: string; // e.g., 'application/pdf'
	size?: number; // Bytes
}

// ============================================================================
// Tag / Hashtag
// ============================================================================

export interface Tag {
	name: string;
	slug: string;
	count?: number;
	created?: string;
}

// ============================================================================
// Union type for all AP content
// ============================================================================

export type APContent =
	| BlogPost
	| APNote
	| APProduct
	| APProfile
	| APEvent
	| APImage
	| APVideo
	| APDocument;
