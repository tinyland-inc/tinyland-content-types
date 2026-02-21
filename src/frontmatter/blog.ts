/**
 * Blog Post Type Definitions
 * For MDsveX frontmatter
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';

/**
 * Video embed information for blog posts
 */
export interface VideoEmbed {
	/** Video URL */
	url: string;
	/** Video title */
	title: string;
	/** Video hosting platform */
	platform: 'youtube' | 'peertube' | 'vimeo';
	/** Optional thumbnail URL */
	thumbnailUrl?: string;
	/** Platform-specific video ID */
	videoId?: string;
}

/**
 * External reference/citation information
 */
export interface Reference {
	/** Reference title */
	title: string;
	/** Reference URL */
	url: string;
	/** Optional description of the reference */
	description?: string;
	/** Optional author name */
	author?: string;
}

/**
 * Blog post frontmatter interface
 * Defines all fields that can be specified in MDsveX frontmatter
 */
export interface BlogFrontmatter {
	// ============================================================================
	// Required Fields
	// ============================================================================

	/** Post title (required) */
	title: string;

	// ============================================================================
	// Date Fields
	// ============================================================================

	/** Publication date (ISO string) */
	date?: string;

	/** Alternative publication date field */
	publishedAt?: string;

	/** Last modification date (ISO string) */
	lastModified?: string;

	// ============================================================================
	// Identification
	// ============================================================================

	/** URL slug (auto-derived from filename if not specified) */
	slug?: string;

	// ============================================================================
	// Layout
	// ============================================================================

	/** MDsveX layout identifier */
	layout?: 'blog';

	// ============================================================================
	// Author Fields
	// ============================================================================

	/**
	 * Author reference object containing name, handle, and optional avatar.
	 * @deprecated String format is deprecated. Use AuthorReference object format.
	 * For backwards compatibility, string values are still accepted but
	 * will be treated as the author handle.
	 */
	author?: AuthorReference | string;

	/** Author email (not displayed for privacy) */
	authorEmail?: string;

	/** Author avatar image URL (legacy - prefer author.avatar) */
	authorAvatar?: string;

	// ============================================================================
	// Content Fields
	// ============================================================================

	/** Short excerpt/summary for previews */
	excerpt?: string;

	/** Longer description (fallback for excerpt) */
	description?: string;

	// ============================================================================
	// Image Fields
	// ============================================================================

	/** Featured image URL */
	featuredImage?: string;

	/** Hero image URL (alternative to featuredImage) */
	heroImage?: string;

	/** Cover image URL (third fallback option) */
	coverImage?: string;

	// ============================================================================
	// Publishing Status
	// ============================================================================

	/** Whether post is published (default: true) */
	published?: boolean;

	/** Whether post is a draft (default: false) */
	draft?: boolean;

	/** Whether post is featured/highlighted */
	featured?: boolean;

	// ============================================================================
	// Categorization
	// ============================================================================

	/** Post tags for filtering/search */
	tags?: string[];

	/** Post categories */
	categories?: string[];

	/** Series identifier if part of a series */
	series?: string;

	/** Order within series (1-based) */
	seriesOrder?: number;

	// ============================================================================
	// SEO Fields (meta tags only, not rendered in UI)
	// ============================================================================

	/** Override for <title> tag */
	seoTitle?: string;

	/** Override for meta description */
	seoDescription?: string;

	/** Open Graph image URL */
	ogImage?: string;

	/** Canonical URL override */
	canonicalUrl?: string;

	// ============================================================================
	// Computed Metadata
	// ============================================================================

	/** Estimated reading time in minutes */
	readingTime?: number;

	/** Word count of post content */
	wordCount?: number;

	// ============================================================================
	// Visibility
	// ============================================================================

	/** Content visibility (ActivityPub-compatible) */
	visibility?: ContentVisibility;

	// ============================================================================
	// Related Content
	// ============================================================================

	/** Slugs of related products */
	relatedProducts?: string[];

	/** Slugs of related blog posts */
	relatedPosts?: string[];

	/** Embedded videos */
	videos?: VideoEmbed[];

	/** External references and citations */
	references?: Reference[];
}

export interface BlogPost {
	frontmatter: BlogFrontmatter;
	content: string;
	slug: string;
	readingTime?: number;
	wordCount?: number;
}

export interface BlogPostWithStats extends BlogPost {
	views?: number;
	likes?: number;
	comments?: number;
}

export interface BlogCategory {
	name: string;
	slug: string;
	description?: string;
	postCount: number;
}

export interface BlogAuthor {
	name: string;
	email?: string;
	avatar?: string;
	bio?: string;
	social?: {
		twitter?: string;
		github?: string;
		linkedin?: string;
		website?: string;
	};
	postCount?: number;
}
