import { describe, it, expect } from 'vitest';
import { test as fcTest } from '@fast-check/vitest';
import fc from 'fast-check';
import {
	migrateVisibility,
	isValidVisibility,
	getAddressingForVisibility,
	inferVisibilityFromAddressing,
	isVisibleTo,
	CONTENT_VISIBILITY_VALUES,
	VISIBILITY_LABELS,
	VISIBILITY_ICONS,
	ACTIVITYPUB_PUBLIC,
	type ContentVisibility,
	type ActivityPubAddressing
} from '../src/visibility/index.js';





const validVisibilityArb = fc.constantFrom(...CONTENT_VISIBILITY_VALUES);

const urlArb = fc.webUrl();





describe('migrateVisibility', () => {
	it('should fail closed to "private" for undefined input', () => {
		expect(migrateVisibility(undefined)).toBe('private');
	});

	it('should fail closed to "private" for null input', () => {
		expect(migrateVisibility(null)).toBe('private');
	});

	it('should fail closed to "private" for an empty string', () => {
		expect(migrateVisibility('')).toBe('private');
	});

	it('should map "public" to "public"', () => {
		expect(migrateVisibility('public')).toBe('public');
	});

	it('should map "published" to "public"', () => {
		expect(migrateVisibility('published')).toBe('public');
	});

	it('should map "unlisted" to "unlisted"', () => {
		expect(migrateVisibility('unlisted')).toBe('unlisted');
	});

	it('should map "members" to "followers"', () => {
		expect(migrateVisibility('members')).toBe('followers');
	});

	it('should map "followers" to "followers"', () => {
		expect(migrateVisibility('followers')).toBe('followers');
	});

	it('should map "admin" to "private"', () => {
		expect(migrateVisibility('admin')).toBe('private');
	});

	it('should map "private" to "private"', () => {
		expect(migrateVisibility('private')).toBe('private');
	});

	it('should map "draft" to "private"', () => {
		expect(migrateVisibility('draft')).toBe('private');
	});

	it('should map "direct" to "direct"', () => {
		expect(migrateVisibility('direct')).toBe('direct');
	});

	it('should be case-insensitive', () => {
		expect(migrateVisibility('PUBLIC')).toBe('public');
		expect(migrateVisibility('Members')).toBe('followers');
		expect(migrateVisibility('PRIVATE')).toBe('private');
		expect(migrateVisibility('Draft')).toBe('private');
	});

	it('should fail closed to "private" for unknown values, not "public"', () => {

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		expect(migrateVisibility('unknown-value')).toBe('private');
		expect(migrateVisibility('unknown-value')).not.toBe('public');
		expect(migrateVisibility('pubic')).toBe('private');
		expect(migrateVisibility('folowers')).toBe('private');
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Unknown visibility value: unknown-value')
		);
		warnSpy.mockRestore();
	});

	fcTest.prop([fc.string()])('never widens an unrecognized value to "public"', (value) => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const knownLegacy = ['public', 'published', 'unlisted', 'members', 'followers', 'admin', 'private', 'draft', 'direct'];
			fc.pre(value !== '' && !knownLegacy.includes(value.toLowerCase()));
			expect(migrateVisibility(value)).toBe('private');
		} finally {
			warnSpy.mockRestore();
		}
	});

	fcTest.prop([validVisibilityArb])('migrateVisibility is idempotent for valid values', (visibility) => {
		
		const result = migrateVisibility(visibility);
		expect(migrateVisibility(result)).toBe(result);
	});
});





describe('isValidVisibility', () => {
	it.each(CONTENT_VISIBILITY_VALUES)('should return true for "%s"', (v) => {
		expect(isValidVisibility(v)).toBe(true);
	});

	it('should return false for invalid values', () => {
		expect(isValidVisibility('members')).toBe(false);
		expect(isValidVisibility('admin')).toBe(false);
		expect(isValidVisibility('draft')).toBe(false);
		expect(isValidVisibility('')).toBe(false);
		expect(isValidVisibility('foo')).toBe(false);
	});
});





describe('getAddressingForVisibility', () => {
	const actorUrl = 'https://example.com/users/alice';
	const followersUrl = 'https://example.com/users/alice/followers';

	it('should return public addressing for "public"', () => {
		const result = getAddressingForVisibility('public', actorUrl, followersUrl);
		expect(result.to).toEqual([ACTIVITYPUB_PUBLIC]);
		expect(result.cc).toEqual([followersUrl]);
	});

	it('should return unlisted addressing for "unlisted"', () => {
		const result = getAddressingForVisibility('unlisted', actorUrl, followersUrl);
		expect(result.to).toEqual([followersUrl]);
		expect(result.cc).toEqual([ACTIVITYPUB_PUBLIC]);
	});

	it('should return followers-only addressing for "followers"', () => {
		const result = getAddressingForVisibility('followers', actorUrl, followersUrl);
		expect(result.to).toEqual([followersUrl]);
		expect(result.cc).toEqual([]);
	});

	it('should return private addressing for "private"', () => {
		const result = getAddressingForVisibility('private', actorUrl, followersUrl);
		expect(result.to).toEqual([actorUrl]);
		expect(result.cc).toEqual([]);
	});

	it('should return direct addressing for "direct" with recipients', () => {
		const recipients = ['https://example.com/users/bob', 'https://example.com/users/carol'];
		const result = getAddressingForVisibility('direct', actorUrl, followersUrl, recipients);
		expect(result.to).toEqual(recipients);
		expect(result.cc).toEqual([]);
	});

	it('should return empty "to" for "direct" without recipients', () => {
		const result = getAddressingForVisibility('direct', actorUrl, followersUrl);
		expect(result.to).toEqual([]);
		expect(result.cc).toEqual([]);
	});
});





describe('inferVisibilityFromAddressing', () => {
	const followersUrl = 'https://example.com/users/alice/followers';

	it('should infer "public" when Public is in "to"', () => {
		expect(inferVisibilityFromAddressing(
			[ACTIVITYPUB_PUBLIC],
			[followersUrl],
			followersUrl
		)).toBe('public');
	});

	it('should infer "unlisted" when Public is in "cc"', () => {
		expect(inferVisibilityFromAddressing(
			[followersUrl],
			[ACTIVITYPUB_PUBLIC],
			followersUrl
		)).toBe('unlisted');
	});

	it('should infer "followers" when followers URL is in "to" with no public', () => {
		expect(inferVisibilityFromAddressing(
			[followersUrl],
			[],
			followersUrl
		)).toBe('followers');
	});

	it('should infer "direct" when specific recipients are in "to"', () => {
		expect(inferVisibilityFromAddressing(
			['https://example.com/users/bob'],
			[],
			followersUrl
		)).toBe('direct');
	});

	it('should infer "private" when no recipients', () => {
		expect(inferVisibilityFromAddressing(
			[],
			[],
			followersUrl
		)).toBe('private');
	});
});





describe('visibility addressing round-trip', () => {
	const actorUrl = 'https://example.com/users/alice';
	const followersUrl = 'https://example.com/users/alice/followers';

	fcTest.prop([
		fc.constantFrom('public', 'unlisted', 'followers' as ContentVisibility)
	])('round-trips for non-direct/non-private visibilities', (visibility) => {
		const addressing = getAddressingForVisibility(visibility, actorUrl, followersUrl);
		const inferred = inferVisibilityFromAddressing(addressing.to, addressing.cc, followersUrl);
		expect(inferred).toBe(visibility);
	});

	it('round-trips for "private" visibility', () => {
		const addressing = getAddressingForVisibility('private', actorUrl, followersUrl);
		const inferred = inferVisibilityFromAddressing(addressing.to, addressing.cc, followersUrl);
		
		
		expect(inferred).toBe('direct');
	});

	it('round-trips for "direct" with specific recipients', () => {
		const recipients = ['https://example.com/users/bob'];
		const addressing = getAddressingForVisibility('direct', actorUrl, followersUrl, recipients);
		const inferred = inferVisibilityFromAddressing(addressing.to, addressing.cc, followersUrl);
		expect(inferred).toBe('direct');
	});
});





describe('isVisibleTo', () => {
	const author = 'alice';

	it('public content is visible to everyone', () => {
		expect(isVisibleTo('public', null, author, false)).toBe(true);
		expect(isVisibleTo('public', 'bob', author, false)).toBe(true);
	});

	it('unlisted content is visible to everyone', () => {
		expect(isVisibleTo('unlisted', null, author, false)).toBe(true);
		expect(isVisibleTo('unlisted', 'bob', author, false)).toBe(true);
	});

	it('followers-only content is visible to author', () => {
		expect(isVisibleTo('followers', 'alice', author, false)).toBe(true);
	});

	it('followers-only content is visible to followers', () => {
		expect(isVisibleTo('followers', 'bob', author, true)).toBe(true);
	});

	it('followers-only content is NOT visible to non-followers', () => {
		expect(isVisibleTo('followers', 'bob', author, false)).toBe(false);
	});

	it('followers-only content is NOT visible to anonymous users', () => {
		expect(isVisibleTo('followers', null, author, false)).toBe(false);
	});

	it('private content is only visible to author', () => {
		expect(isVisibleTo('private', 'alice', author, false)).toBe(true);
		expect(isVisibleTo('private', 'bob', author, true)).toBe(false);
		expect(isVisibleTo('private', null, author, false)).toBe(false);
	});

	it('direct content is only visible to author (caller handles recipients)', () => {
		expect(isVisibleTo('direct', 'alice', author, false)).toBe(true);
		expect(isVisibleTo('direct', 'bob', author, true)).toBe(false);
	});

	fcTest.prop([validVisibilityArb])('author can always see their own content', (visibility) => {
		expect(isVisibleTo(visibility, 'alice', 'alice', false)).toBe(true);
	});
});





describe('VISIBILITY_LABELS', () => {
	it('should have labels for all visibility values', () => {
		for (const v of CONTENT_VISIBILITY_VALUES) {
			expect(VISIBILITY_LABELS[v]).toBeDefined();
			expect(typeof VISIBILITY_LABELS[v]).toBe('string');
		}
	});
});

describe('VISIBILITY_ICONS', () => {
	it('should have icons for all visibility values', () => {
		for (const v of CONTENT_VISIBILITY_VALUES) {
			expect(VISIBILITY_ICONS[v]).toBeDefined();
			expect(typeof VISIBILITY_ICONS[v]).toBe('string');
		}
	});
});
