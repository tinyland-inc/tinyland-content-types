/**
 * Event Type Definitions
 * For MDsveX frontmatter
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';

export interface EventFrontmatter {
	// Required fields
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	location?: string;

	// Optional fields
	layout?: 'event';
	description?: string;
	excerpt?: string;

	// Event details
	/**
	 * Event organizer - can be AuthorReference object or legacy string format.
	 * @deprecated String format is deprecated. Use AuthorReference object format.
	 */
	organizer?: AuthorReference | string;
	organizerEmail?: string;

	/**
	 * Author reference (alias for organizer, for consistency across content types).
	 * If both author and organizer are provided, author takes precedence.
	 */
	author?: AuthorReference;
	calendarId?: string;
	category?: string;
	tags?: string[];

	// Display
	image?: string;
	featuredImage?: string;
	bannerImage?: string;

	// Registration
	registrationUrl?: string;
	maxAttendees?: number;
	registrationDeadline?: string;

	// Publishing
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	// Visibility (ActivityPub-compatible)
	// MIGRATION: 'members' -> 'followers'
	visibility?: ContentVisibility;

	// SEO
	seoTitle?: string;
	seoDescription?: string;
	canonicalUrl?: string;

	// Additional metadata
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	zip?: string;
	latitude?: number;
	longitude?: number;
}

export interface Event {
	frontmatter: EventFrontmatter;
	content: string;
	slug: string;
	filePath?: string;
}

export interface EventDisplay {
	title: string;
	slug: string;
	date: string;
	startTime: string;
	endTime: string;
	location?: string;
	description?: string;
	excerpt?: string;
	image?: string;
	featuredImage?: string;
	organizer?: string;
	category?: string;
	tags: string[];
	registrationUrl?: string;
	maxAttendees?: number;
	registrationDeadline?: string;
	published: boolean;
	publishedAt?: string;
	visibility?: string;
}

/**
 * Event content loaded from markdown files
 * Extended from base Event with computed properties
 */
export interface EventContent {
	frontmatter: EventFrontmatter & {
		slug?: string;
		layout?: string;
		visibility?: string;
		authorId?: string | null;
		startDate?: string;
		startDateTime?: string;
		date?: string;
		endDate?: string;
		endDateTime?: string;
		featured?: boolean;
		categories?: string[];
		tags?: string[];
		calendarUid?: string;
		excerpt?: string;
		contactEmail?: string;
		recurrence?: string;
		organizer?: string | { name: string; email?: string };
		location?: string | { name: string; address?: string };
	};
	content: string;
	slug: string;
	readingTime: number;
	wordCount: number;
}

/**
 * Xandikos calendar event format
 * Standard iCalendar/CalDAV properties
 */
export interface XandikosEvent {
	uid: string;
	summary: string;
	description?: string;
	dtstart: string;
	dtend?: string;
	location?: string;
	organizer?: string;
	categories?: string[];
	url?: string;
	rrule?: string;
	created?: string;
	lastModified?: string;
}

/**
 * Event with calendar integration data
 * Combines EventContent with Xandikos calendar event
 */
export interface EventWithCalendar extends EventContent {
	xandikosEvent: XandikosEvent;
}
