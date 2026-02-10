/**
 * Video Type Definitions
 * For standalone video content (ActivityPub Video objects)
 * Compatible with PeerTube federation
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';

/**
 * Video frontmatter for MDsveX
 */
export interface VideoFrontmatter {
	// Required
	title: string;
	url: string; // Video file URL or embed URL

	// Publishing
	publishedAt?: string;
	updatedAt?: string;
	visibility?: ContentVisibility;
	published?: boolean;

	// Author
	/**
	 * Author reference object containing name, handle, and optional avatar.
	 * @deprecated String format (handle only) is deprecated. Use AuthorReference object format.
	 * For backwards compatibility, string values are still accepted but
	 * will be treated as the author handle.
	 */
	author?: AuthorReference | string;

	// Video metadata
	duration?: string; // ISO 8601 duration (PT5M30S)
	durationSeconds?: number;
	width?: number;
	height?: number;
	aspectRatio?: string; // e.g., "16:9"

	// Thumbnails
	thumbnailUrl?: string;
	previewUrl?: string; // Animated preview
	blurhash?: string;

	// Platform info
	platform?: 'youtube' | 'peertube' | 'vimeo' | 'self-hosted';
	videoId?: string; // Platform-specific ID
	embedUrl?: string;

	// Content
	description?: string;
	excerpt?: string;

	// Categorization
	tags?: string[];
	categories?: string[];
	language?: string;

	// Licensing
	license?: string;
	licenseUrl?: string;

	// Engagement
	views?: number;
	likes?: number;
	comments?: number;

	// PeerTube-specific
	commentsEnabled?: boolean;
	downloadEnabled?: boolean;
	support?: string; // Support/donation info

	// ActivityPub
	activityPubId?: string;
}

export interface Video {
	frontmatter: VideoFrontmatter;
	content: string; // Full description/transcript
	slug: string;
	filePath?: string;
}

export interface VideoDisplay {
	slug: string;
	title: string;
	url: string;
	thumbnailUrl?: string;
	duration?: string;
	durationSeconds?: number;
	platform: string;
	publishedAt: string;
	author: string;
	description?: string;
	views: number;
	visibility: ContentVisibility;
}

/**
 * Convert Video to display format
 */
export function videoToDisplay(video: Video): VideoDisplay {
	const { frontmatter } = video;

	return {
		slug: video.slug,
		title: frontmatter.title,
		url: frontmatter.url,
		thumbnailUrl: frontmatter.thumbnailUrl,
		duration: frontmatter.duration,
		durationSeconds: frontmatter.durationSeconds,
		platform: frontmatter.platform || 'unknown',
		publishedAt: frontmatter.publishedAt || new Date().toISOString(),
		author: typeof frontmatter.author === 'string'
			? frontmatter.author
			: frontmatter.author?.handle || 'unknown',
		description: frontmatter.description || frontmatter.excerpt,
		views: frontmatter.views || 0,
		visibility: frontmatter.visibility || 'public'
	};
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse ISO 8601 duration to seconds
 */
export function parseDuration(duration: string): number {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return 0;

	const hours = parseInt(match[1] || '0', 10);
	const minutes = parseInt(match[2] || '0', 10);
	const seconds = parseInt(match[3] || '0', 10);

	return hours * 3600 + minutes * 60 + seconds;
}
