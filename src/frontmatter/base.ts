/**
 * Base Frontmatter Types
 * Shared across all content types
 */

import type { ContentVisibility } from '../visibility/index.js';

/**
 * Fediverse visibility (maps to ActivityPub addressing)
 * Alias for ContentVisibility for semantic clarity
 */
export type FediverseVisibility = ContentVisibility;

/**
 * Standardized author reference for all content types.
 * Used to identify content creators consistently across blog posts,
 * products, events, notes, and videos.
 */
export interface AuthorReference {
	/** Display name of the author */
	name: string;
	/** Unique handle/username (without @ prefix) */
	handle: string;
	/** Optional avatar image URL */
	avatar?: string;
}

/**
 * Base frontmatter fields shared across all content types
 */
export interface BaseFrontmatter {
	/** Content title */
	title?: string;
	/** Short description */
	description?: string;
	/** URL-friendly slug */
	slug?: string;
	/** Publication date */
	publishedAt?: string;
	/** Last update date */
	updatedAt?: string;
	/** Fediverse/ActivityPub visibility */
	visibility?: FediverseVisibility;
	/** Author handle */
	author?: string;
	/** Tags for categorization */
	tags?: string[];
}

/**
 * Contact page frontmatter
 */
export interface ContactFrontmatter extends BaseFrontmatter {
	/** User handle this contact info belongs to */
	handle: string;
	/** Email address (optional) */
	email?: string;
	/** Preferred contact method */
	preferredContact?: 'email' | 'fediverse' | 'matrix' | 'signal' | 'other';
	/** Fediverse/Mastodon handle */
	fediverseHandle?: string;
	/** Matrix ID */
	matrixId?: string;
	/** Whether public key is available */
	publicKey?: boolean;
	/** PGP key fingerprint */
	pgpFingerprint?: string;
	/** URL to download public key */
	publicKeyUrl?: string;
}

/**
 * User page frontmatter
 */
export interface UserPageFrontmatter extends BaseFrontmatter {
	/** User handle */
	handle: string;
	/** Page type (about, portfolio, etc.) */
	type?: 'page' | 'about' | 'portfolio' | 'resume';
	/** Featured content flag */
	featured?: boolean;
}
