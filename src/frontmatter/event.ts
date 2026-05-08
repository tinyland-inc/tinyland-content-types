




import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';
import type { TinylandSchedulingReference } from '../scheduling/index.js';

export interface EventFrontmatter {
	
	title: string;
	date: string;
	startTime: string;
	endTime: string;
	location?: string;

	
	layout?: 'event';
	description?: string;
	excerpt?: string;

	
	



	organizer?: AuthorReference | string;
	organizerEmail?: string;

	



	author?: AuthorReference;
	calendarId?: string;
	category?: string;
	tags?: string[];

	
	image?: string;
	featuredImage?: string;
	bannerImage?: string;

	
	registrationUrl?: string;
	schedulingRef?: TinylandSchedulingReference;
	maxAttendees?: number;
	registrationDeadline?: string;

	
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	
	
	visibility?: ContentVisibility;

	
	seoTitle?: string;
	seoDescription?: string;
	canonicalUrl?: string;

	
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





export interface EventWithCalendar extends EventContent {
	xandikosEvent: XandikosEvent;
}
