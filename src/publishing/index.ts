/**
 * Publishing Workflow Types
 * Lifecycle management for content: draft -> review -> scheduled -> published -> archived
 *
 * NOTE: Role-based permission checking (canUserTransitionTo, canUserTransition,
 * getAvailableTransitions) uses a string-based role type rather than importing
 * from tinyland-auth, to keep this package dependency-free. The consuming
 * application should use its own AdminRole type when calling these functions.
 */

// ============================================================================
// Publishing Status Types
// ============================================================================

/**
 * Publishing status for content lifecycle
 */
export type PublishingStatus =
	| 'draft'        // Work in progress, not visible
	| 'pending'      // Submitted for review
	| 'scheduled'    // Approved, waiting for publish date
	| 'published'    // Live and visible (per visibility rules)
	| 'archived';    // Soft-deleted, hidden but preserved

/**
 * Role type for publishing permission checks.
 * This is a standalone type that mirrors the auth system's AdminRole
 * to keep this package free of auth dependencies.
 */
export type PublishingRole =
	| 'viewer'
	| 'member'
	| 'contributor'
	| 'event_manager'
	| 'editor'
	| 'moderator'
	| 'admin'
	| 'super_admin';

/**
 * Scheduling configuration
 */
export interface ScheduledPublishing {
	scheduledAt: string;          // ISO 8601 datetime
	timezone?: string;            // IANA timezone (default: UTC)
	publishedBy?: string;         // handle of scheduler
	autoFederate?: boolean;       // Auto-send to ActivityPub on publish
}

/**
 * Version tracking metadata
 */
export interface ContentVersion {
	version: number;              // Incrementing version number
	createdAt: string;            // When this version was created
	createdBy: string;            // Handle of editor
	changeType: 'create' | 'edit' | 'status' | 'restore';
	changeSummary?: string;       // Optional description of changes
}

/**
 * Publishing metadata for frontmatter
 */
export interface PublishingMetadata {
	status: PublishingStatus;
	scheduling?: ScheduledPublishing;
	versions?: ContentVersion[];
	currentVersion?: number;
	lastEditedAt?: string;
	lastEditedBy?: string;
}

// ============================================================================
// Status Transition Rules
// ============================================================================

/**
 * Valid status transitions
 * Defines which status changes are allowed
 */
export const STATUS_TRANSITIONS: Record<PublishingStatus, PublishingStatus[]> = {
	draft: ['pending', 'scheduled', 'published'],
	pending: ['draft', 'scheduled', 'published'],
	scheduled: ['draft', 'pending', 'published'],
	published: ['draft', 'archived'],
	archived: ['draft', 'published']
};

/**
 * Role requirements for status transitions
 * Maps which roles can transition content to each status
 */
export const TRANSITION_PERMISSIONS: Record<PublishingStatus, PublishingRole[]> = {
	draft: ['contributor', 'member', 'editor', 'moderator', 'admin', 'super_admin'],
	pending: ['contributor', 'member', 'editor', 'moderator', 'admin', 'super_admin'],
	scheduled: ['editor', 'moderator', 'admin', 'super_admin'],
	published: ['editor', 'moderator', 'admin', 'super_admin'],
	archived: ['moderator', 'admin', 'super_admin']
};

// ============================================================================
// Status Display Configuration
// ============================================================================

/**
 * Human-readable labels for each status
 */
export const STATUS_LABELS: Record<PublishingStatus, string> = {
	draft: 'Draft',
	pending: 'Pending Review',
	scheduled: 'Scheduled',
	published: 'Published',
	archived: 'Archived'
};

/**
 * Color schemes for status badges
 * Using Skeleton preset colors
 */
export const STATUS_COLORS: Record<PublishingStatus, string> = {
	draft: 'warning',
	pending: 'info',
	scheduled: 'secondary',
	published: 'success',
	archived: 'surface'
};

/**
 * Icon names for status indicators
 * Using Iconify mdi icons
 */
export const STATUS_ICONS: Record<PublishingStatus, string> = {
	draft: 'mdi:pencil',
	pending: 'mdi:clock-outline',
	scheduled: 'mdi:calendar-clock',
	published: 'mdi:check-circle',
	archived: 'mdi:archive'
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a status transition is valid
 * @param from - Current status
 * @param to - Target status
 * @returns True if transition is allowed
 */
export function canTransition(from: PublishingStatus, to: PublishingStatus): boolean {
	return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Check if user has permission to transition to a status
 * @param userRole - User's role
 * @param targetStatus - Target status
 * @returns True if user can transition to status
 */
export function canUserTransitionTo(userRole: PublishingRole, targetStatus: PublishingStatus): boolean {
	return TRANSITION_PERMISSIONS[targetStatus]?.includes(userRole) ?? false;
}

/**
 * Check if user can perform a specific transition
 * @param user - User object with role
 * @param from - Current status
 * @param to - Target status
 * @returns True if user can perform transition
 */
export function canUserTransition(
	user: { role: PublishingRole },
	from: PublishingStatus,
	to: PublishingStatus
): boolean {
	// Check if transition is valid
	if (!canTransition(from, to)) {
		return false;
	}

	// Check if user has permission for target status
	return canUserTransitionTo(user.role, to);
}

/**
 * Get available transitions for current status and user role
 * @param current - Current status
 * @param userRole - User's role
 * @returns Array of available target statuses
 */
export function getAvailableTransitions(
	current: PublishingStatus,
	userRole: PublishingRole
): PublishingStatus[] {
	const possibleTransitions = STATUS_TRANSITIONS[current] ?? [];
	return possibleTransitions.filter(status => canUserTransitionTo(userRole, status));
}

/**
 * Validate scheduled publishing configuration
 * @param scheduling - Scheduling config
 * @returns Error message if invalid, null if valid
 */
export function validateScheduling(scheduling: ScheduledPublishing): string | null {
	// Check if scheduledAt is in the future
	const scheduledDate = new Date(scheduling.scheduledAt);
	const now = new Date();

	if (isNaN(scheduledDate.getTime())) {
		return 'Invalid scheduled date format';
	}

	if (scheduledDate <= now) {
		return 'Scheduled date must be in the future';
	}

	// Validate timezone if provided
	if (scheduling.timezone) {
		try {
			// Test if timezone is valid by creating a date formatter
			Intl.DateTimeFormat('en-US', { timeZone: scheduling.timezone });
		} catch {
			return `Invalid timezone: ${scheduling.timezone}`;
		}
	}

	return null;
}

/**
 * Create a new version entry
 * @param version - Version number
 * @param createdBy - Editor handle
 * @param changeType - Type of change
 * @param changeSummary - Optional description
 * @returns ContentVersion object
 */
export function createVersion(
	version: number,
	createdBy: string,
	changeType: ContentVersion['changeType'],
	changeSummary?: string
): ContentVersion {
	return {
		version,
		createdAt: new Date().toISOString(),
		createdBy,
		changeType,
		changeSummary
	};
}

/**
 * Get status description for UI
 * @param status - Publishing status
 * @returns Description text
 */
export function getStatusDescription(status: PublishingStatus): string {
	const descriptions: Record<PublishingStatus, string> = {
		draft: 'Content is being edited and is not visible to the public',
		pending: 'Content is submitted for review by an editor or moderator',
		scheduled: 'Content is approved and will be published at a scheduled time',
		published: 'Content is live and visible according to its visibility settings',
		archived: 'Content is hidden but preserved in the archive'
	};

	return descriptions[status];
}

/**
 * Check if content is publicly visible based on status
 * @param status - Publishing status
 * @returns True if content should be visible
 */
export function isPubliclyVisible(status: PublishingStatus): boolean {
	return status === 'published';
}

/**
 * Check if content can be edited
 * @param status - Publishing status
 * @returns True if content is editable
 */
export function isEditable(status: PublishingStatus): boolean {
	// Archived content should not be edited directly (must restore first)
	return status !== 'archived';
}

/**
 * Get next logical status for workflow
 * @param current - Current status
 * @returns Suggested next status
 */
export function getNextStatus(current: PublishingStatus): PublishingStatus | null {
	const workflow: Partial<Record<PublishingStatus, PublishingStatus>> = {
		draft: 'pending',
		pending: 'published',
		scheduled: 'published'
	};

	return workflow[current] ?? null;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a string is a valid publishing status
 */
export function isPublishingStatus(value: string): value is PublishingStatus {
	return ['draft', 'pending', 'scheduled', 'published', 'archived'].includes(value);
}

/**
 * Check if object is valid publishing metadata
 */
export function isPublishingMetadata(obj: unknown): obj is PublishingMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const meta = obj as Partial<PublishingMetadata>;
	return (
		typeof meta.status === 'string' &&
		isPublishingStatus(meta.status)
	);
}

/**
 * Check if object is valid scheduled publishing config
 */
export function isScheduledPublishing(obj: unknown): obj is ScheduledPublishing {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const sched = obj as Partial<ScheduledPublishing>;
	return typeof sched.scheduledAt === 'string';
}
