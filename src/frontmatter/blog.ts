




import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';




export interface VideoEmbed {
	
	url: string;
	
	title: string;
	
	platform: 'youtube' | 'peertube' | 'vimeo';
	
	thumbnailUrl?: string;
	
	videoId?: string;
}




export interface Reference {
	
	title: string;
	
	url: string;
	
	description?: string;
	
	author?: string;
}





export interface BlogFrontmatter {
	
	
	

	
	title: string;

	
	
	

	
	date?: string;

	
	publishedAt?: string;

	
	lastModified?: string;

	
	
	

	
	slug?: string;

	
	
	

	
	layout?: 'blog';

	
	
	

	





	author?: AuthorReference | string;

	
	authorEmail?: string;

	
	authorAvatar?: string;

	
	
	

	
	excerpt?: string;

	
	description?: string;

	
	
	

	
	featuredImage?: string;

	
	heroImage?: string;

	
	coverImage?: string;

	
	
	

	
	published?: boolean;

	
	draft?: boolean;

	
	featured?: boolean;

	
	
	

	
	tags?: string[];

	
	categories?: string[];

	
	series?: string;

	
	seriesOrder?: number;

	
	
	

	
	seoTitle?: string;

	
	seoDescription?: string;

	
	ogImage?: string;

	
	canonicalUrl?: string;

	
	
	

	
	readingTime?: number;

	
	wordCount?: number;

	
	
	

	
	visibility?: ContentVisibility;

	
	
	

	
	relatedProducts?: string[];

	
	relatedPosts?: string[];

	
	videos?: VideoEmbed[];

	
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
