/**
 * Note Type Definitions
 * For microblog posts (ActivityPub Note objects)
 */

import type { ContentVisibility } from '../visibility/index.js';
import type { AuthorReference } from './base.js';
import type { VideoEmbed } from './blog.js';

/**
 * Note frontmatter for MDsveX
 */
export interface NoteFrontmatter {
	// Content
	content?: string; // Short-form content (can also be in body)

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

	// Conversation threading
	inReplyTo?: string; // URL of parent note/post
	conversation?: string; // Conversation/thread ID

	// Content warnings
	sensitive?: boolean;
	spoilerText?: string;

	// Attachments
	images?: string[];
	videos?: VideoEmbed[];

	// Mentions and tags
	mentions?: string[]; // @handle references
	hashtags?: string[];

	// Engagement (federated)
	likes?: number;
	boosts?: number;
	replies?: number;

	// ActivityPub
	activityPubId?: string;
	url?: string;
}

export interface Note {
	frontmatter: NoteFrontmatter;
	content: string;
	slug: string;
	filePath?: string;
}

export interface NoteDisplay {
	slug: string;
	content: string;
	publishedAt: string;
	author: string;
	visibility: ContentVisibility;
	inReplyTo?: string;
	sensitive: boolean;
	spoilerText?: string;
	images: string[];
	hashtags: string[];
	mentions: string[];
	likes: number;
	boosts: number;
	replies: number;
}

/**
 * Convert Note to display format
 */
export function noteToDisplay(note: Note): NoteDisplay {
	const { frontmatter } = note;

	return {
		slug: note.slug,
		content: note.content || frontmatter.content || '',
		publishedAt: frontmatter.publishedAt || new Date().toISOString(),
		author: typeof frontmatter.author === 'string'
			? frontmatter.author
			: frontmatter.author?.handle || 'unknown',
		visibility: frontmatter.visibility || 'public',
		inReplyTo: frontmatter.inReplyTo,
		sensitive: frontmatter.sensitive || false,
		spoilerText: frontmatter.spoilerText,
		images: frontmatter.images || [],
		hashtags: frontmatter.hashtags || [],
		mentions: frontmatter.mentions || [],
		likes: frontmatter.likes || 0,
		boosts: frontmatter.boosts || 0,
		replies: frontmatter.replies || 0
	};
}
