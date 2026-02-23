








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








export type ContentType =
	| 'blog'
	| 'note'
	| 'product'
	| 'event'
	| 'program'
	| 'video'
	| 'profile';




export type ActivityPubObjectType =
	| 'Article'
	| 'Note'
	| 'Page'
	| 'Event'
	| 'Video'
	| 'Person'
	| 'Group';








export interface ProgramFrontmatter {
	
	title: string;
	slug?: string;

	
	excerpt?: string;
	coverImage?: string;
	coordinator?: {
		name: string;
		handle: string;
	};

	
	schedule?: string;
	startDate?: string;
	endDate?: string;
	duration?: string;

	
	location?: string;

	
	capacity?: number;
	registrationRequired?: boolean;

	
	categories?: string[];
	tags?: string[];

	
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	
	visibility?: ContentVisibility;
	fediverseVisibility?: ContentVisibility;

	
	activityPubId?: string;
}








export type AnyFrontmatter =
	| BlogFrontmatter
	| NoteFrontmatter
	| ProductFrontmatter
	| EventFrontmatter
	| ProgramFrontmatter
	| VideoFrontmatter
	| ProfileFrontmatter;





export interface UnifiedContentItem<T extends AnyFrontmatter = AnyFrontmatter> {
	
	type: ContentType;

	
	slug: string;

	
	authorHandle: string;

	
	frontmatter: T;

	
	content: string;

	
	visibility: ContentVisibility;

	
	fediverseId?: string;

	
	fediverseVisibility?: ContentVisibility;

	
	publishedAt: string;

	
	updatedAt?: string;

	
	filePath?: string;
}








export interface ExtendedProductFrontmatter {
	
	name: string;
	slug: string;
	description: string;
	category: string;

	
	transactions?: TransactionMethod[];
	primaryTransaction?: TransactionType;

	
	relatedPosts?: string[];
	relatedProducts?: string[];

	
	visibility?: FediverseVisibility;
	activityPubId?: string;

	
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




export interface ExtendedBlogFrontmatter {
	
	title: string;

	
	date?: string;
	publishedAt?: string;
	published?: boolean;
	draft?: boolean;
	featured?: boolean;

	
	author?: {
		name: string;
		handle?: string;
		avatar?: string;
	};

	
	excerpt?: string;
	coverImage?: string;
	readingTime?: number;
	wordCount?: number;

	
	categories?: string[];
	tags?: string[];
	series?: string;
	seriesOrder?: number;

	
	relatedProducts?: string[];
	relatedPosts?: string[];

	
	videos?: VideoEmbed[];

	
	references?: Reference[];

	
	visibility?: FediverseVisibility;
	activityPubId?: string;

	
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
}




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








export function isBlogContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<BlogFrontmatter> {
	return item.type === 'blog';
}




export function isNoteContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<NoteFrontmatter> {
	return item.type === 'note';
}




export function isProductContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProductFrontmatter> {
	return item.type === 'product';
}




export function isEventContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<EventFrontmatter> {
	return item.type === 'event';
}




export function isProgramContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProgramFrontmatter> {
	return item.type === 'program';
}




export function isVideoContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<VideoFrontmatter> {
	return item.type === 'video';
}




export function isProfileContent(
	item: UnifiedContentItem
): item is UnifiedContentItem<ProfileFrontmatter> {
	return item.type === 'profile';
}








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




export function getContentActivityPubId(item: UnifiedContentItem, baseUrl: string): string {
	
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








export function getContentTitle(item: UnifiedContentItem): string {
	const fm = item.frontmatter as Record<string, unknown>;
	return (fm.title as string) || (fm.name as string) || (fm.displayName as string) || item.slug;
}




export function getContentExcerpt(item: UnifiedContentItem): string | undefined {
	const fm = item.frontmatter as Record<string, unknown>;
	return (fm.excerpt as string) || (fm.description as string) || (fm.bio as string);
}




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




export function getContentAuthor(item: UnifiedContentItem): {
	handle: string;
	name?: string;
	avatar?: string;
} {
	const fm = item.frontmatter as Record<string, unknown>;

	
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

	
	if (item.type === 'profile') {
		return {
			handle: item.slug,
			name: (fm.name as string) || (fm.displayName as string),
			avatar: (fm.avatar as string) || (fm.image as string)
		};
	}

	return { handle: item.authorHandle };
}
