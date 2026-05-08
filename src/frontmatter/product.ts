




import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';
import type { TransactionMethod, TransactionType } from '../commerce/index.js';
import type { TinylandSchedulingReference } from '../scheduling/index.js';




export interface ProductVariant {
	
	id: string;
	
	name: string;
	
	sku?: string;
	
	price?: number;
	
	attributes: Record<string, string>;
	
	stockQuantity?: number;
	
	available?: boolean;
}




export interface PhysicalProductDetails {
	
	weight?: number;
	
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
	
	shippingClass?: 'standard' | 'fragile' | 'oversized' | 'digital';
	
	originCountry?: string;
	
	requiresSignature?: boolean;
}




export interface ProductGalleryImage {
	
	src: string;
	
	alt: string;
	
	caption?: string;
	
	isPrimary?: boolean;
}




export type StockStatus = 'in_stock' | 'out_of_stock' | 'preorder' | 'made_to_order' | 'discontinued';




export type ProductRelationshipType = 'used-in' | 'mentioned-in' | 'case-study' | 'release-notes' | 'tutorial' | 'review';

export interface ProductFrontmatter {
	
	name: string;
	slug: string;
	description: string;
	category: ProductCategory;

	
	
	author?: AuthorReference;

	
	price?: number;
	currency?: 'USD' | 'EUR' | 'GBP' | 'free';
	license?: string; 
	version?: string;

	
	
	

	
	sku?: string;
	
	stockQuantity?: number;
	
	stockStatus?: StockStatus;
	
	lowStockThreshold?: number;

	
	
	

	
	physical?: PhysicalProductDetails;

	
	
	

	
	variants?: ProductVariant[];
	
	variantAttributes?: string[];

	
	
	

	
	gallery?: ProductGalleryImage[];

	
	
	

	
	relationshipType?: ProductRelationshipType;
	
	relatedPosts?: string[];
	
	relatedProducts?: string[];

	
	featured?: boolean;
	image?: string;
	excerpt?: string;
	tagline?: string;

	
	purchaseUrl?: string;
	downloadUrl?: string;
	githubUrl?: string;
	docsUrl?: string;
	demoUrl?: string;
	websiteUrl?: string;

	
	techStack?: string[];

	
	tags?: string[];
	order?: number;
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	
	seoTitle?: string;
	seoDescription?: string;

	
	platforms?: ('web' | 'linux' | 'windows' | 'macos' | 'android' | 'ios')[];
	requirements?: string[];
	languages?: string[];

	
	maintainers?: string[];
	contributors?: number;
	stars?: number;

	
	transactions?: TransactionMethod[];
	primaryTransaction?: TransactionType;
	schedulingRef?: TinylandSchedulingReference;

	
	activityPubId?: string;
	
	visibility?: ContentVisibility;
}

export type ProductCategory =
	| 'guide'
	| 'tool'
	| 'resource'
	| 'merchandise'
	| 'software'
	| 'service'
	| 'template'
	| 'library'
	
	| 'hardware'           
	| 'accessories'        
	| 'digital-download'   
	| 'external-listing'   
	| 'booking-page';      

export interface Product {
	frontmatter: ProductFrontmatter;
	content: string;
	slug: string;
	filePath?: string;
}

export interface ProductDisplay {
	name: string;
	slug: string;
	description: string;
	excerpt: string;
	category: ProductCategory;
	image?: string;
	price?: number;
	currency?: string;
	license?: string;
	featured: boolean;
	publishedAt?: string;
	tags: string[];
	purchaseUrl?: string;
	downloadUrl?: string;
	githubUrl?: string;
}






export function getPrimaryTransaction(
	product: ProductFrontmatter
): TransactionMethod | undefined {
	if (!product.transactions || product.transactions.length === 0) {
		return undefined;
	}

	
	if (product.primaryTransaction) {
		const primary = product.transactions.find(
			(t) => t.type === product.primaryTransaction && t.enabled
		);
		if (primary) {
			return primary;
		}
	}

	
	const enabled = product.transactions
		.filter((t) => t.enabled)
		.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

	return enabled[0];
}
