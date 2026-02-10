/**
 * Unified Visibility Types
 * Standardized visibility model across all content types
 * Maps directly to ActivityPub addressing
 *
 * MIGRATION NOTE (Phase 1):
 * This file is THE single source of truth for content visibility.
 * All content types (blog, event, product, profile, note, video) must use ContentVisibility.
 * Legacy RBAC values ('members', 'admin') are deprecated and will be migrated.
 */

/**
 * Content visibility options (ActivityPub-compatible)
 * Maps to ActivityPub addressing:
 * - public: to: [as:Public], cc: [followers] - Visible to everyone, appears in timelines
 * - unlisted: cc: [as:Public], to: [followers] - Visible to everyone, hidden from timelines
 * - followers: to: [followers] - Visible only to followers
 * - private: to: [author only] - Visible only to author
 * - direct: to: [specific recipients] - Direct message to specific users
 */
export type ContentVisibility = 'public' | 'unlisted' | 'followers' | 'private' | 'direct';

/**
 * Visibility values as const array for Zod schemas
 */
export const CONTENT_VISIBILITY_VALUES = ['public', 'unlisted', 'followers', 'private', 'direct'] as const;

/**
 * Legacy RBAC visibility values (deprecated - use ContentVisibility instead)
 * These are retained only for migration purposes.
 * @deprecated Use ContentVisibility instead
 */
export type LegacyRBACVisibility = 'public' | 'members' | 'admin' | 'private';

/**
 * Migrate legacy RBAC visibility to ActivityPub-compatible ContentVisibility
 * @param legacy - Legacy RBAC visibility value
 * @returns ActivityPub-compatible ContentVisibility
 *
 * Migration mapping:
 * - 'public' -> 'public' (no change)
 * - 'members' -> 'followers' (authenticated members become followers)
 * - 'admin' -> 'private' (admin-only becomes private, admin access via RBAC layer)
 * - 'private' -> 'private' (no change)
 * - 'draft' -> 'private' (drafts are private)
 * - 'published' -> 'public' (published profiles are public)
 */
export function migrateVisibility(legacy: string | undefined): ContentVisibility {
	if (!legacy) return 'public';

	const normalized = legacy.toLowerCase();

	switch (normalized) {
		case 'public':
		case 'published':
			return 'public';
		case 'unlisted':
			return 'unlisted';
		case 'members':
		case 'followers':
			return 'followers';
		case 'admin':
		case 'private':
		case 'draft':
			return 'private';
		case 'direct':
			return 'direct';
		default:
			// Unknown values default to public for safety
			console.warn(`[Visibility] Unknown visibility value: ${legacy}, defaulting to 'public'`);
			return 'public';
	}
}

/**
 * Check if a visibility value is a valid ContentVisibility
 */
export function isValidVisibility(value: string): value is ContentVisibility {
	return CONTENT_VISIBILITY_VALUES.includes(value as ContentVisibility);
}

/**
 * ActivityPub addressing based on visibility
 */
export interface ActivityPubAddressing {
	to: string[];
	cc: string[];
	bto?: string[];
	bcc?: string[];
}

/** The ActivityPub public collection URI */
export const ACTIVITYPUB_PUBLIC = 'https://www.w3.org/ns/activitystreams#Public';

/**
 * Get ActivityPub addressing for a visibility level
 */
export function getAddressingForVisibility(
	visibility: ContentVisibility,
	actorUrl: string,
	followersUrl: string,
	directRecipients?: string[]
): ActivityPubAddressing {
	switch (visibility) {
		case 'public':
			return {
				to: [ACTIVITYPUB_PUBLIC],
				cc: [followersUrl]
			};

		case 'unlisted':
			return {
				to: [followersUrl],
				cc: [ACTIVITYPUB_PUBLIC]
			};

		case 'followers':
			return {
				to: [followersUrl],
				cc: []
			};

		case 'private':
			return {
				to: [actorUrl],
				cc: []
			};

		case 'direct':
			return {
				to: directRecipients || [],
				cc: []
			};

		default:
			// Default to public
			return {
				to: [ACTIVITYPUB_PUBLIC],
				cc: [followersUrl]
			};
	}
}

/**
 * Infer visibility from ActivityPub addressing
 */
export function inferVisibilityFromAddressing(
	to: string[],
	cc: string[],
	followersUrl: string
): ContentVisibility {
	const toSet = new Set(to);
	const ccSet = new Set(cc);

	// Public: Public in 'to'
	if (toSet.has(ACTIVITYPUB_PUBLIC)) {
		return 'public';
	}

	// Unlisted: Public in 'cc'
	if (ccSet.has(ACTIVITYPUB_PUBLIC)) {
		return 'unlisted';
	}

	// Followers: followers collection in 'to', no public
	if (toSet.has(followersUrl) && !ccSet.has(ACTIVITYPUB_PUBLIC)) {
		return 'followers';
	}

	// Direct: specific recipients only
	if (to.length > 0 && !toSet.has(followersUrl) && !toSet.has(ACTIVITYPUB_PUBLIC)) {
		return 'direct';
	}

	// Private: no recipients or only self
	return 'private';
}

/**
 * Check if content should be visible to a user
 */
export function isVisibleTo(
	visibility: ContentVisibility,
	viewerHandle: string | null,
	authorHandle: string,
	isFollower: boolean
): boolean {
	switch (visibility) {
		case 'public':
		case 'unlisted':
			return true;

		case 'followers':
			return viewerHandle === authorHandle || isFollower;

		case 'private':
			return viewerHandle === authorHandle;

		case 'direct':
			// Direct visibility requires explicit recipient check
			// This should be handled by the caller with recipient list
			return viewerHandle === authorHandle;

		default:
			return false;
	}
}

/**
 * Human-readable visibility labels
 */
export const VISIBILITY_LABELS: Record<ContentVisibility, string> = {
	public: 'Public',
	unlisted: 'Unlisted',
	followers: 'Followers Only',
	private: 'Private',
	direct: 'Direct Message'
};

/**
 * Visibility icons (using Iconify names)
 */
export const VISIBILITY_ICONS: Record<ContentVisibility, string> = {
	public: 'mdi:earth',
	unlisted: 'mdi:lock-open-outline',
	followers: 'mdi:account-multiple',
	private: 'mdi:lock',
	direct: 'mdi:email-outline'
};
