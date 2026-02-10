/**
 * Profile Type Definitions
 * For MDsveX frontmatter
 */

import type { ContentVisibility } from '../visibility/index.js';

/**
 * Profile-specific visibility values
 * @deprecated Use ContentVisibility instead. Migration:
 * - 'published' -> 'public'
 * - 'draft' -> 'private'
 * - 'private' -> 'private'
 */
export type LegacyProfileVisibility = 'private' | 'draft' | 'published';

export interface ProfileFrontmatter {
	// Required fields
	name?: string;
	displayName?: string; // Alternative to name
	layout?: 'profile'; // MDsveX layout

	// Basic information
	pronouns?: string;
	role?: string;
	roles?: string[]; // For multiple roles
	title?: string;
	department?: string;

	// Contact information
	email?: string;
	phone?: string;
	discord?: string;

	// Direct social links (alternatives to social.* nested object)
	website?: string;
	twitter?: string;
	linkedin?: string;
	mastodon?: string;
	instagram?: string;
	github?: string;

	// Profile details
	avatar?: string;
	coverImage?: string;
	bio?: string;
	location?: string;
	joinedDate?: string;
	birthDate?: string; // For birthday celebrations

	// Social media
	social?: {
		twitter?: string;
		instagram?: string;
		facebook?: string;
		linkedin?: string;
		github?: string;
		website?: string;
		tiktok?: string;
		email?: string; // Contact email via social
	};

	// Interests and expertise
	interests?: string[];
	expertise?: string[];
	skills?: string[]; // Alias for expertise
	tags?: string[];
	categories?: string[]; // Profile categories

	// Display options
	featured?: boolean;
	/**
	 * Profile visibility (ActivityPub-compatible)
	 * MIGRATION: 'published' -> 'public', 'draft' -> 'private'
	 * Legacy values are still accepted but will be migrated at runtime
	 */
	visibility?: ContentVisibility | LegacyProfileVisibility;
	displayOrder?: number;
	slug?: string; // URL slug - can override filename
	published?: boolean; // Legacy: for backwards compatibility
	hidden?: boolean; // Legacy: for backwards compatibility

	// Additional date fields
	publishedAt?: string; // Publication date
	updatedAt?: string; // Last update date
	imageUrl?: string; // Alternative to avatar

	// Availability (flexible structure)
	availability?: {
		mentoring?: boolean;
		volunteering?: boolean;
		speaking?: boolean;
		collaboration?: boolean;
		// Extended availability fields used by profile pages
		status?: 'available' | 'limited' | 'unavailable';
		hours?: string;
		details?: string;
	};

	// Additional fields
	certifications?: string[];
	languages?: string[];
	achievements?: string[];

	// Extended profile fields
	image?: string; // Alias for avatar
	experience?: string; // Work experience summary
	services?: Array<string | {
		name: string;
		description?: string;
		price?: string;
	}>; // Services offered (flexible: string[] or objects)
	testimonials?: Array<{
		quote?: string; // Legacy field
		text?: string; // Preferred field for testimonial content
		author: string;
		role?: string;
		date?: string;
	}>;
	contactEmail?: string; // Alias for email
}

export interface Profile {
	frontmatter: ProfileFrontmatter;
	content: string;
	slug: string;
}

export interface ProfileWithStats extends Profile {
	viewCount?: number;
	connectionCount?: number;
	lastActive?: Date;
}

export interface ProfileRole {
	name: string;
	description?: string;
	memberCount?: number;
}

export interface ProfileConnection {
	profileId: string;
	connectedProfileId: string;
	connectionType: 'mentor' | 'mentee' | 'peer' | 'friend';
	connectedAt: Date;
}
