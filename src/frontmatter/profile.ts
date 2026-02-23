




import type { ContentVisibility } from '../visibility/index.js';








export type LegacyProfileVisibility = 'private' | 'draft' | 'published';

export interface ProfileFrontmatter {
	
	name?: string;
	displayName?: string; 
	layout?: 'profile'; 

	
	pronouns?: string;
	role?: string;
	roles?: string[]; 
	title?: string;
	department?: string;

	
	email?: string;
	phone?: string;
	discord?: string;

	
	website?: string;
	twitter?: string;
	linkedin?: string;
	mastodon?: string;
	instagram?: string;
	github?: string;

	
	avatar?: string;
	coverImage?: string;
	bio?: string;
	location?: string;
	joinedDate?: string;
	birthDate?: string; 

	
	social?: {
		twitter?: string;
		instagram?: string;
		facebook?: string;
		linkedin?: string;
		github?: string;
		website?: string;
		tiktok?: string;
		email?: string; 
	};

	
	interests?: string[];
	expertise?: string[];
	skills?: string[]; 
	tags?: string[];
	categories?: string[]; 

	
	featured?: boolean;
	




	visibility?: ContentVisibility | LegacyProfileVisibility;
	displayOrder?: number;
	slug?: string; 
	published?: boolean; 
	hidden?: boolean; 

	
	publishedAt?: string; 
	updatedAt?: string; 
	imageUrl?: string; 

	
	availability?: {
		mentoring?: boolean;
		volunteering?: boolean;
		speaking?: boolean;
		collaboration?: boolean;
		
		status?: 'available' | 'limited' | 'unavailable';
		hours?: string;
		details?: string;
	};

	
	certifications?: string[];
	languages?: string[];
	achievements?: string[];

	
	image?: string; 
	experience?: string; 
	services?: Array<string | {
		name: string;
		description?: string;
		price?: string;
	}>; 
	testimonials?: Array<{
		quote?: string; 
		text?: string; 
		author: string;
		role?: string;
		date?: string;
	}>;
	contactEmail?: string; 
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
