/**
 * Product Type Definitions
 * For FOSS products, resources, guides, and merchandise
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';
import type { TransactionMethod, TransactionType } from '../commerce/index.js';

/**
 * Product variant for items with multiple options (size, color, etc.)
 */
export interface ProductVariant {
	/** Unique identifier for the variant */
	id: string;
	/** Display name (e.g., "Large / Blue") */
	name: string;
	/** Optional variant-specific SKU */
	sku?: string;
	/** Optional variant-specific price (overrides base price) */
	price?: number;
	/** Key-value attributes (e.g., { size: 'L', color: 'Blue' }) */
	attributes: Record<string, string>;
	/** Stock quantity for this specific variant */
	stockQuantity?: number;
	/** Whether this variant is available */
	available?: boolean;
}

/**
 * Physical product details for shippable goods
 */
export interface PhysicalProductDetails {
	/** Weight in grams */
	weight?: number;
	/** Dimensions in cm */
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
	/** Shipping classification */
	shippingClass?: 'standard' | 'fragile' | 'oversized' | 'digital';
	/** Country of origin (ISO 3166-1 alpha-2) */
	originCountry?: string;
	/** Requires signature on delivery */
	requiresSignature?: boolean;
}

/**
 * Image gallery item for product images
 */
export interface ProductGalleryImage {
	/** Image source URL */
	src: string;
	/** Alt text for accessibility */
	alt: string;
	/** Optional caption */
	caption?: string;
	/** Whether this is the primary/featured image */
	isPrimary?: boolean;
}

/**
 * Stock status enumeration
 */
export type StockStatus = 'in_stock' | 'out_of_stock' | 'preorder' | 'made_to_order' | 'discontinued';

/**
 * Relationship type between products and other content
 */
export type ProductRelationshipType = 'used-in' | 'mentioned-in' | 'case-study' | 'release-notes' | 'tutorial' | 'review';

export interface ProductFrontmatter {
	// Required fields
	name: string;
	slug: string;
	description: string;
	category: ProductCategory;

	// Author (required for products)
	/** Author reference object containing name, handle, and optional avatar */
	author?: AuthorReference;

	// Product details
	price?: number;
	currency?: 'USD' | 'EUR' | 'GBP' | 'free';
	license?: string; // LGPL-3.0, MIT, GPL-3.0, etc.
	version?: string;

	// ============================================================================
	// Inventory & SKU (Phase 2 Product Schema Expansion)
	// ============================================================================

	/** Stock Keeping Unit - unique product identifier */
	sku?: string;
	/** Current stock quantity (for physical goods) */
	stockQuantity?: number;
	/** Stock status */
	stockStatus?: StockStatus;
	/** Low stock threshold for alerts */
	lowStockThreshold?: number;

	// ============================================================================
	// Physical Product Details
	// ============================================================================

	/** Physical product details (weight, dimensions, shipping) */
	physical?: PhysicalProductDetails;

	// ============================================================================
	// Product Variants
	// ============================================================================

	/** Available variants (size, color, etc.) */
	variants?: ProductVariant[];
	/** Variant attribute names for UI (e.g., ['Size', 'Color']) */
	variantAttributes?: string[];

	// ============================================================================
	// Image Gallery
	// ============================================================================

	/** Additional product images */
	gallery?: ProductGalleryImage[];

	// ============================================================================
	// Content Relationships
	// ============================================================================

	/** Type of relationship when referenced from other content */
	relationshipType?: ProductRelationshipType;
	/** Related blog post slugs */
	relatedPosts?: string[];
	/** Related product slugs */
	relatedProducts?: string[];

	// Marketing & Display
	featured?: boolean;
	image?: string;
	excerpt?: string;
	tagline?: string;

	// Links
	purchaseUrl?: string;
	downloadUrl?: string;
	githubUrl?: string;
	docsUrl?: string;
	demoUrl?: string;
	websiteUrl?: string;

	// Technical stack
	techStack?: string[];

	// Organization
	tags?: string[];
	order?: number;
	published?: boolean;
	publishedAt?: string;
	updatedAt?: string;

	// SEO
	seoTitle?: string;
	seoDescription?: string;

	// Technical details
	platforms?: ('web' | 'linux' | 'windows' | 'macos' | 'android' | 'ios')[];
	requirements?: string[];
	languages?: string[];

	// Community
	maintainers?: string[];
	contributors?: number;
	stars?: number;

	// Transaction methods
	transactions?: TransactionMethod[];
	primaryTransaction?: TransactionType;

	// Federation (ActivityPub)
	activityPubId?: string;
	/** Content visibility (ActivityPub-compatible) */
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
	// Phase 2 Product Categories
	| 'hardware'           // Physical electronics, devices
	| 'accessories'        // Cables, covers, adapters
	| 'digital-download'   // Downloadable files, assets
	| 'external-listing'   // Links to external stores
	| 'booking-page';      // Service booking, consultations

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

/**
 * Get the primary transaction method for a product
 * Returns the explicitly set primary transaction, or the first enabled transaction,
 * or undefined if no transactions are available
 */
export function getPrimaryTransaction(
	product: ProductFrontmatter
): TransactionMethod | undefined {
	if (!product.transactions || product.transactions.length === 0) {
		return undefined;
	}

	// If primaryTransaction is explicitly set, find and return it
	if (product.primaryTransaction) {
		const primary = product.transactions.find(
			(t) => t.type === product.primaryTransaction && t.enabled
		);
		if (primary) {
			return primary;
		}
	}

	// Fall back to first enabled transaction sorted by priority
	const enabled = product.transactions
		.filter((t) => t.enabled)
		.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

	return enabled[0];
}
