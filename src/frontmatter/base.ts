




import type { ContentVisibility } from '../visibility/index.js';





export type FediverseVisibility = ContentVisibility;






export interface AuthorReference {
	
	name: string;
	
	handle: string;
	
	avatar?: string;
}




export interface BaseFrontmatter {
	
	title?: string;
	
	description?: string;
	
	slug?: string;
	
	publishedAt?: string;
	
	updatedAt?: string;
	
	visibility?: FediverseVisibility;
	
	author?: string;
	
	tags?: string[];
}




export interface ContactFrontmatter extends BaseFrontmatter {
	
	handle: string;
	
	email?: string;
	
	preferredContact?: 'email' | 'fediverse' | 'matrix' | 'signal' | 'other';
	
	fediverseHandle?: string;
	
	matrixId?: string;
	
	publicKey?: boolean;
	
	pgpFingerprint?: string;
	
	publicKeyUrl?: string;
}




export interface UserPageFrontmatter extends BaseFrontmatter {
	
	handle: string;
	
	type?: 'page' | 'about' | 'portfolio' | 'resume';
	
	featured?: boolean;
}
