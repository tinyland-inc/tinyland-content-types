import { describe, it, expect } from 'vitest';
import {
	canTransition,
	canUserTransitionTo,
	canUserTransition,
	getAvailableTransitions,
	validateScheduling,
	createVersion,
	getStatusDescription,
	isPubliclyVisible,
	isEditable,
	getNextStatus,
	isPublishingStatus,
	isPublishingMetadata,
	isScheduledPublishing,
	STATUS_TRANSITIONS,
	STATUS_LABELS,
	STATUS_COLORS,
	STATUS_ICONS,
	type PublishingStatus,
	type PublishingRole
} from '../src/publishing/index.js';





describe('canTransition', () => {
	it('allows draft -> pending', () => {
		expect(canTransition('draft', 'pending')).toBe(true);
	});

	it('allows draft -> published', () => {
		expect(canTransition('draft', 'published')).toBe(true);
	});

	it('allows draft -> scheduled', () => {
		expect(canTransition('draft', 'scheduled')).toBe(true);
	});

	it('does NOT allow draft -> archived', () => {
		expect(canTransition('draft', 'archived')).toBe(false);
	});

	it('allows published -> draft', () => {
		expect(canTransition('published', 'draft')).toBe(true);
	});

	it('allows published -> archived', () => {
		expect(canTransition('published', 'archived')).toBe(true);
	});

	it('does NOT allow published -> pending', () => {
		expect(canTransition('published', 'pending')).toBe(false);
	});

	it('allows archived -> draft', () => {
		expect(canTransition('archived', 'draft')).toBe(true);
	});

	it('allows archived -> published', () => {
		expect(canTransition('archived', 'published')).toBe(true);
	});
});





describe('canUserTransitionTo', () => {
	it('allows contributor to transition to draft', () => {
		expect(canUserTransitionTo('contributor', 'draft')).toBe(true);
	});

	it('does NOT allow contributor to transition to published', () => {
		expect(canUserTransitionTo('contributor', 'published')).toBe(false);
	});

	it('allows editor to transition to published', () => {
		expect(canUserTransitionTo('editor', 'published')).toBe(true);
	});

	it('allows moderator to transition to archived', () => {
		expect(canUserTransitionTo('moderator', 'archived')).toBe(true);
	});

	it('does NOT allow editor to transition to archived', () => {
		expect(canUserTransitionTo('editor', 'archived')).toBe(false);
	});

	it('allows super_admin to transition to anything', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const status of statuses) {
			expect(canUserTransitionTo('super_admin', status)).toBe(true);
		}
	});
});





describe('canUserTransition', () => {
	it('allows editor to transition from draft to published', () => {
		expect(canUserTransition({ role: 'editor' }, 'draft', 'published')).toBe(true);
	});

	it('does NOT allow contributor to transition from draft to published', () => {
		expect(canUserTransition({ role: 'contributor' }, 'draft', 'published')).toBe(false);
	});

	it('does NOT allow editor to make invalid transition', () => {
		expect(canUserTransition({ role: 'editor' }, 'draft', 'archived')).toBe(false);
	});
});





describe('getAvailableTransitions', () => {
	it('returns correct transitions for contributor from draft', () => {
		const transitions = getAvailableTransitions('draft', 'contributor');
		expect(transitions).toContain('pending');
		expect(transitions).not.toContain('published');
		expect(transitions).not.toContain('scheduled');
	});

	it('returns more transitions for editor from draft', () => {
		const transitions = getAvailableTransitions('draft', 'editor');
		expect(transitions).toContain('pending');
		expect(transitions).toContain('scheduled');
		expect(transitions).toContain('published');
	});

	it('returns empty array for viewer', () => {
		const transitions = getAvailableTransitions('draft', 'viewer');
		expect(transitions).toEqual([]);
	});
});





describe('validateScheduling', () => {
	it('returns null for valid future scheduling', () => {
		const futureDate = new Date(Date.now() + 86400000).toISOString();
		const result = validateScheduling({ scheduledAt: futureDate });
		expect(result).toBeNull();
	});

	it('returns error for invalid date format', () => {
		const result = validateScheduling({ scheduledAt: 'not-a-date' });
		expect(result).toBe('Invalid scheduled date format');
	});

	it('returns error for past date', () => {
		const pastDate = new Date('2020-01-01').toISOString();
		const result = validateScheduling({ scheduledAt: pastDate });
		expect(result).toBe('Scheduled date must be in the future');
	});

	it('returns null for valid timezone', () => {
		const futureDate = new Date(Date.now() + 86400000).toISOString();
		const result = validateScheduling({
			scheduledAt: futureDate,
			timezone: 'America/New_York'
		});
		expect(result).toBeNull();
	});

	it('returns error for invalid timezone', () => {
		const futureDate = new Date(Date.now() + 86400000).toISOString();
		const result = validateScheduling({
			scheduledAt: futureDate,
			timezone: 'Invalid/Timezone'
		});
		expect(result).toContain('Invalid timezone');
	});
});





describe('createVersion', () => {
	it('creates a version with correct fields', () => {
		const version = createVersion(1, 'alice', 'create', 'Initial draft');
		expect(version.version).toBe(1);
		expect(version.createdBy).toBe('alice');
		expect(version.changeType).toBe('create');
		expect(version.changeSummary).toBe('Initial draft');
		expect(version.createdAt).toBeDefined();
	});

	it('creates version without summary', () => {
		const version = createVersion(2, 'bob', 'edit');
		expect(version.changeSummary).toBeUndefined();
	});
});





describe('getStatusDescription', () => {
	it('returns descriptions for all statuses', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const status of statuses) {
			const desc = getStatusDescription(status);
			expect(desc).toBeDefined();
			expect(typeof desc).toBe('string');
			expect(desc.length).toBeGreaterThan(0);
		}
	});
});

describe('isPubliclyVisible', () => {
	it('returns true only for published', () => {
		expect(isPubliclyVisible('published')).toBe(true);
		expect(isPubliclyVisible('draft')).toBe(false);
		expect(isPubliclyVisible('pending')).toBe(false);
		expect(isPubliclyVisible('scheduled')).toBe(false);
		expect(isPubliclyVisible('archived')).toBe(false);
	});
});

describe('isEditable', () => {
	it('returns false only for archived', () => {
		expect(isEditable('archived')).toBe(false);
		expect(isEditable('draft')).toBe(true);
		expect(isEditable('pending')).toBe(true);
		expect(isEditable('scheduled')).toBe(true);
		expect(isEditable('published')).toBe(true);
	});
});

describe('getNextStatus', () => {
	it('returns pending for draft', () => {
		expect(getNextStatus('draft')).toBe('pending');
	});

	it('returns published for pending', () => {
		expect(getNextStatus('pending')).toBe('published');
	});

	it('returns published for scheduled', () => {
		expect(getNextStatus('scheduled')).toBe('published');
	});

	it('returns null for published', () => {
		expect(getNextStatus('published')).toBeNull();
	});

	it('returns null for archived', () => {
		expect(getNextStatus('archived')).toBeNull();
	});
});





describe('isPublishingStatus', () => {
	it('returns true for valid statuses', () => {
		expect(isPublishingStatus('draft')).toBe(true);
		expect(isPublishingStatus('pending')).toBe(true);
		expect(isPublishingStatus('scheduled')).toBe(true);
		expect(isPublishingStatus('published')).toBe(true);
		expect(isPublishingStatus('archived')).toBe(true);
	});

	it('returns false for invalid values', () => {
		expect(isPublishingStatus('active')).toBe(false);
		expect(isPublishingStatus('')).toBe(false);
		expect(isPublishingStatus('public')).toBe(false);
	});
});

describe('isPublishingMetadata', () => {
	it('returns true for valid metadata', () => {
		expect(isPublishingMetadata({ status: 'draft' })).toBe(true);
		expect(isPublishingMetadata({ status: 'published', currentVersion: 3 })).toBe(true);
	});

	it('returns false for invalid metadata', () => {
		expect(isPublishingMetadata(null)).toBe(false);
		expect(isPublishingMetadata(undefined)).toBe(false);
		expect(isPublishingMetadata({})).toBe(false);
		expect(isPublishingMetadata({ status: 'invalid' })).toBe(false);
		expect(isPublishingMetadata('draft')).toBe(false);
	});
});

describe('isScheduledPublishing', () => {
	it('returns true for valid scheduling', () => {
		expect(isScheduledPublishing({ scheduledAt: '2024-01-01T00:00:00Z' })).toBe(true);
	});

	it('returns false for invalid scheduling', () => {
		expect(isScheduledPublishing(null)).toBe(false);
		expect(isScheduledPublishing({})).toBe(false);
		expect(isScheduledPublishing({ scheduledAt: 123 })).toBe(false);
	});
});





describe('STATUS_LABELS', () => {
	it('has labels for all statuses', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const s of statuses) {
			expect(STATUS_LABELS[s]).toBeDefined();
		}
	});
});

describe('STATUS_COLORS', () => {
	it('has colors for all statuses', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const s of statuses) {
			expect(STATUS_COLORS[s]).toBeDefined();
		}
	});
});

describe('STATUS_ICONS', () => {
	it('has icons for all statuses', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const s of statuses) {
			expect(STATUS_ICONS[s]).toBeDefined();
		}
	});
});

describe('STATUS_TRANSITIONS', () => {
	it('has transitions for all statuses', () => {
		const statuses: PublishingStatus[] = ['draft', 'pending', 'scheduled', 'published', 'archived'];
		for (const s of statuses) {
			expect(STATUS_TRANSITIONS[s]).toBeDefined();
			expect(Array.isArray(STATUS_TRANSITIONS[s])).toBe(true);
		}
	});
});
