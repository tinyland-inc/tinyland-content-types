




import type { ContentVisibility } from '../visibility/index.js';








export type ProgressVariant = 'circular' | 'bar';








export interface SeriesPost {
	
	slug: string;
	
	title: string;
	
	order: number;
}









export interface ContentAuthor {
	
	name: string;
	
	handle?: string;
	
	avatar?: string;
	
	url?: string;
	
	actorUrl?: string;
	
	bio?: string;
}




export interface AuthorCardProps {
	
	author: ContentAuthor;
	
	variant?: 'compact' | 'full';
	
	showAvatar?: boolean;
	
	showHandle?: boolean;
	
	class?: string;
}








export interface MetaBadgesProps {
	
	publishedAt?: string;
	
	updatedAt?: string;
	
	readingTime?: number;
	
	visibility?: ContentVisibility;
	
	showDate?: boolean;
	
	showReadingTime?: boolean;
	
	showVisibility?: boolean;
	
	showUpdatedAt?: boolean;
	
	size?: 'sm' | 'md' | 'lg';
	
	class?: string;
}








export interface HeroImageProps {
	
	src: string;
	
	alt: string;
	
	blurHash?: string;
	
	aspectRatio?: string;
	
	showOverlay?: boolean;
	
	overlayDirection?: 'top' | 'bottom' | 'left' | 'right';
	
	priority?: boolean;
	
	class?: string;
}








export interface ContentBadge {
	
	label: string;
	
	preset?: string;
	
	icon?: string;
}




export interface ContentTitleProps {
	
	title: string;
	
	subtitle?: string;
	
	badges?: ContentBadge[];
	
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	
	class?: string;
}









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




export function normalizeFrontmatter(
	frontmatter: Record<string, unknown>
): NormalizedFrontmatter {
	
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

	
	const heroImage =
		(frontmatter.heroImage as string) ||
		(frontmatter.featuredImage as string) ||
		(frontmatter.coverImage as string) ||
		(frontmatter.image as string);

	
	const publishedAt =
		(frontmatter.publishedAt as string) ||
		(frontmatter.date as string) ||
		(frontmatter.createdAt as string);

	const updatedAt =
		(frontmatter.updatedAt as string) || (frontmatter.lastModified as string);

	
	const visibility = frontmatter.visibility as ContentVisibility | undefined;

	
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
