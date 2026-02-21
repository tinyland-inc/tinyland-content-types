/**
 * Gallery Type Definitions
 * For image collections (ActivityPub Image objects)
 * Compatible with Pixelfed federation
 */

import type { ContentVisibility } from '../visibility/index.js';

/**
 * Single image in a gallery
 */
export interface GalleryImage {
	url: string;
	alt?: string;
	title?: string;
	width?: number;
	height?: number;
	blurhash?: string;
	thumbnailUrl?: string;
	focalPoint?: [number, number]; // x, y coordinates for cropping
}

/**
 * Gallery item frontmatter for MDsveX
 */
export interface GalleryItemFrontmatter {
	// Required
	title: string;

	// Images
	images: GalleryImage[];
	coverImage?: string; // Primary image URL

	// Publishing
	publishedAt?: string;
	updatedAt?: string;
	visibility?: ContentVisibility;
	published?: boolean;

	// Author
	author?: string; // Handle

	// Content
	description?: string;
	excerpt?: string;

	// Categorization
	tags?: string[];
	categories?: string[];

	// Location (for geotagged photos)
	location?: {
		name?: string;
		latitude?: number;
		longitude?: number;
	};

	// Camera/EXIF data
	camera?: string;
	lens?: string;
	aperture?: string;
	shutterSpeed?: string;
	iso?: number;
	takenAt?: string;

	// Engagement
	likes?: number;
	comments?: number;

	// ActivityPub
	activityPubId?: string;
}

export interface GalleryItem {
	frontmatter: GalleryItemFrontmatter;
	content: string; // Full description
	slug: string;
	filePath?: string;
}

export interface GalleryItemDisplay {
	slug: string;
	title: string;
	images: GalleryImage[];
	coverImage?: string;
	publishedAt: string;
	author: string;
	description?: string;
	tags: string[];
	visibility: ContentVisibility;
	likes: number;
}

/**
 * Gallery collection (album)
 */
export interface GalleryCollection {
	name: string;
	slug: string;
	description?: string;
	coverImage?: string;
	items: GalleryItemDisplay[];
	totalItems: number;
	visibility: ContentVisibility;
}

/**
 * Convert GalleryItem to display format
 */
export function galleryItemToDisplay(item: GalleryItem): GalleryItemDisplay {
	const { frontmatter } = item;

	return {
		slug: item.slug,
		title: frontmatter.title,
		images: frontmatter.images || [],
		coverImage: frontmatter.coverImage || frontmatter.images?.[0]?.url,
		publishedAt: frontmatter.publishedAt || new Date().toISOString(),
		author: frontmatter.author || 'unknown',
		description: frontmatter.description || frontmatter.excerpt,
		tags: frontmatter.tags || [],
		visibility: frontmatter.visibility || 'public',
		likes: frontmatter.likes || 0
	};
}

/**
 * Get responsive image srcset
 */
export function getImageSrcset(image: GalleryImage, widths: number[] = [320, 640, 1024, 1920]): string {
	// This would normally generate different sized URLs
	// For now, return the original URL
	return widths.map((w) => `${image.url} ${w}w`).join(', ');
}

/**
 * Calculate aspect ratio from dimensions
 */
export function getAspectRatio(width: number, height: number): string {
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
	const divisor = gcd(width, height);
	return `${width / divisor}:${height / divisor}`;
}
