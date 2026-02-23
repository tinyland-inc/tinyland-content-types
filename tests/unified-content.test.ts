import { describe, it, expect } from 'vitest';
import { test as fcTest } from '@fast-check/vitest';
import fc from 'fast-check';
import {
	isBlogContent,
	isNoteContent,
	isProductContent,
	isEventContent,
	isProgramContent,
	isVideoContent,
	isProfileContent,
	getContentActivityPubType,
	getActivityPubContentType,
	getContentUrl,
	getContentActivityPubId,
	getContentTitle,
	getContentExcerpt,
	getContentImage,
	getContentAuthor,
	type UnifiedContentItem,
	type ContentType,
	type BlogFrontmatter,
	type NoteFrontmatter,
	type ProductFrontmatter,
	type ProfileFrontmatter
} from '../src/index.js';





function makeItem(overrides: Partial<UnifiedContentItem> = {}): UnifiedContentItem {
	return {
		type: 'blog',
		slug: 'test-post',
		authorHandle: 'alice',
		frontmatter: { title: 'Test Post' } as BlogFrontmatter,
		content: 'Hello world',
		visibility: 'public',
		publishedAt: '2024-01-01T00:00:00Z',
		...overrides
	};
}





describe('type guards', () => {
	const contentTypes: ContentType[] = ['blog', 'note', 'product', 'event', 'program', 'video', 'profile'];
	const guards = [
		{ guard: isBlogContent, type: 'blog' },
		{ guard: isNoteContent, type: 'note' },
		{ guard: isProductContent, type: 'product' },
		{ guard: isEventContent, type: 'event' },
		{ guard: isProgramContent, type: 'program' },
		{ guard: isVideoContent, type: 'video' },
		{ guard: isProfileContent, type: 'profile' }
	];

	for (const { guard, type } of guards) {
		it(`${guard.name} returns true for type "${type}"`, () => {
			const item = makeItem({ type: type as ContentType });
			expect(guard(item)).toBe(true);
		});

		it(`${guard.name} returns false for other types`, () => {
			for (const otherType of contentTypes) {
				if (otherType !== type) {
					const item = makeItem({ type: otherType });
					expect(guard(item)).toBe(false);
				}
			}
		});
	}
});





describe('getContentActivityPubType', () => {
	it('maps blog to Article', () => {
		expect(getContentActivityPubType('blog')).toBe('Article');
	});

	it('maps note to Note', () => {
		expect(getContentActivityPubType('note')).toBe('Note');
	});

	it('maps product to Page', () => {
		expect(getContentActivityPubType('product')).toBe('Page');
	});

	it('maps event to Event', () => {
		expect(getContentActivityPubType('event')).toBe('Event');
	});

	it('maps program to Event', () => {
		expect(getContentActivityPubType('program')).toBe('Event');
	});

	it('maps video to Video', () => {
		expect(getContentActivityPubType('video')).toBe('Video');
	});

	it('maps profile to Person', () => {
		expect(getContentActivityPubType('profile')).toBe('Person');
	});
});

describe('getActivityPubContentType', () => {
	it('maps Article to blog', () => {
		expect(getActivityPubContentType('Article')).toBe('blog');
	});

	it('maps Note to note', () => {
		expect(getActivityPubContentType('Note')).toBe('note');
	});

	it('maps Page to product', () => {
		expect(getActivityPubContentType('Page')).toBe('product');
	});

	it('maps Event to event', () => {
		expect(getActivityPubContentType('Event')).toBe('event');
	});

	it('maps Video to video', () => {
		expect(getActivityPubContentType('Video')).toBe('video');
	});

	it('maps Person to profile', () => {
		expect(getActivityPubContentType('Person')).toBe('profile');
	});

	it('maps Group to profile', () => {
		expect(getActivityPubContentType('Group')).toBe('profile');
	});

	it('maps Organization to profile', () => {
		expect(getActivityPubContentType('Organization')).toBe('profile');
	});

	it('returns null for unknown types', () => {
		expect(getActivityPubContentType('Unknown')).toBeNull();
		expect(getActivityPubContentType('Image')).toBeNull();
	});
});





describe('getContentUrl', () => {
	const baseUrl = 'https://example.com';

	it('generates blog URL', () => {
		const item = makeItem({ type: 'blog', slug: 'my-post' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/blog/my-post');
	});

	it('generates note URL with author handle', () => {
		const item = makeItem({ type: 'note', slug: 'abc123', authorHandle: 'alice' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/@alice/notes/abc123');
	});

	it('generates product URL', () => {
		const item = makeItem({ type: 'product', slug: 'my-tool' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/products/my-tool');
	});

	it('generates event URL', () => {
		const item = makeItem({ type: 'event', slug: 'my-event' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/events/my-event');
	});

	it('generates program URL', () => {
		const item = makeItem({ type: 'program', slug: 'my-program' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/programs/my-program');
	});

	it('generates video URL', () => {
		const item = makeItem({ type: 'video', slug: 'my-video' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/videos/my-video');
	});

	it('generates profile URL with @ prefix', () => {
		const item = makeItem({ type: 'profile', slug: 'alice' });
		expect(getContentUrl(item, baseUrl)).toBe('https://example.com/@alice');
	});

	it('strips trailing slash from baseUrl', () => {
		const item = makeItem({ type: 'blog', slug: 'test' });
		expect(getContentUrl(item, 'https://example.com/')).toBe('https://example.com/blog/test');
	});
});

describe('getContentActivityPubId', () => {
	const baseUrl = 'https://example.com';

	it('returns existing fediverseId if present', () => {
		const item = makeItem({ fediverseId: 'https://other.com/ap/articles/old-id' });
		expect(getContentActivityPubId(item, baseUrl)).toBe('https://other.com/ap/articles/old-id');
	});

	it('generates AP ID for blog posts', () => {
		const item = makeItem({ type: 'blog', slug: 'my-post' });
		expect(getContentActivityPubId(item, baseUrl)).toBe('https://example.com/ap/articles/my-post');
	});

	it('generates AP ID for notes', () => {
		const item = makeItem({ type: 'note', slug: 'abc', authorHandle: 'alice' });
		expect(getContentActivityPubId(item, baseUrl)).toBe('https://example.com/ap/users/alice/notes/abc');
	});

	it('generates AP ID for profiles', () => {
		const item = makeItem({ type: 'profile', slug: 'alice' });
		expect(getContentActivityPubId(item, baseUrl)).toBe('https://example.com/ap/users/alice');
	});
});





describe('getContentTitle', () => {
	it('returns title from frontmatter', () => {
		const item = makeItem({ frontmatter: { title: 'My Title' } as BlogFrontmatter });
		expect(getContentTitle(item)).toBe('My Title');
	});

	it('falls back to name', () => {
		const item = makeItem({
			type: 'product',
			frontmatter: { name: 'My Product', slug: 'my-product', description: 'desc', category: 'tool' } as ProductFrontmatter
		});
		expect(getContentTitle(item)).toBe('My Product');
	});

	it('falls back to displayName', () => {
		const item = makeItem({
			type: 'profile',
			frontmatter: { displayName: 'Alice Smith' } as ProfileFrontmatter
		});
		expect(getContentTitle(item)).toBe('Alice Smith');
	});

	it('falls back to slug', () => {
		const item = makeItem({ slug: 'my-slug', frontmatter: {} as BlogFrontmatter });
		expect(getContentTitle(item)).toBe('my-slug');
	});
});

describe('getContentExcerpt', () => {
	it('returns excerpt from frontmatter', () => {
		const item = makeItem({
			frontmatter: { title: 'Test', excerpt: 'Short summary' } as BlogFrontmatter
		});
		expect(getContentExcerpt(item)).toBe('Short summary');
	});

	it('falls back to description', () => {
		const item = makeItem({
			frontmatter: { title: 'Test', description: 'A description' } as BlogFrontmatter
		});
		expect(getContentExcerpt(item)).toBe('A description');
	});

	it('returns undefined when no excerpt fields exist', () => {
		const item = makeItem({ frontmatter: { title: 'Test' } as BlogFrontmatter });
		expect(getContentExcerpt(item)).toBeUndefined();
	});
});

describe('getContentImage', () => {
	it('returns coverImage', () => {
		const item = makeItem({
			frontmatter: { title: 'Test', coverImage: '/img/cover.jpg' } as BlogFrontmatter
		});
		expect(getContentImage(item)).toBe('/img/cover.jpg');
	});

	it('falls back to featuredImage', () => {
		const item = makeItem({
			frontmatter: { title: 'Test', featuredImage: '/img/featured.jpg' } as BlogFrontmatter
		});
		expect(getContentImage(item)).toBe('/img/featured.jpg');
	});

	it('returns undefined when no image fields exist', () => {
		const item = makeItem({ frontmatter: { title: 'Test' } as BlogFrontmatter });
		expect(getContentImage(item)).toBeUndefined();
	});
});

describe('getContentAuthor', () => {
	it('returns author from object field', () => {
		const item = makeItem({
			frontmatter: {
				title: 'Test',
				author: { name: 'Alice', handle: 'alice', avatar: '/img/alice.jpg' }
			} as BlogFrontmatter
		});
		const author = getContentAuthor(item);
		expect(author.handle).toBe('alice');
		expect(author.name).toBe('Alice');
		expect(author.avatar).toBe('/img/alice.jpg');
	});

	it('falls back to authorHandle', () => {
		const item = makeItem({
			authorHandle: 'bob',
			frontmatter: { title: 'Test' } as BlogFrontmatter
		});
		const author = getContentAuthor(item);
		expect(author.handle).toBe('bob');
	});

	it('returns profile as its own author', () => {
		const item = makeItem({
			type: 'profile',
			slug: 'alice',
			frontmatter: {
				name: 'Alice Smith',
				avatar: '/img/alice.jpg'
			} as ProfileFrontmatter
		});
		const author = getContentAuthor(item);
		expect(author.handle).toBe('alice');
		expect(author.name).toBe('Alice Smith');
		expect(author.avatar).toBe('/img/alice.jpg');
	});
});





describe('URL generation properties', () => {
	const contentTypeArb = fc.constantFrom<ContentType>('blog', 'note', 'product', 'event', 'program', 'video', 'profile');
	const slugArb = fc.stringMatching(/^[a-z0-9][a-z0-9-]{0,49}$/);

	fcTest.prop([contentTypeArb, slugArb])('getContentUrl never has double slashes in path', (type, slug) => {
		const item = makeItem({ type, slug, authorHandle: 'testuser' });
		const url = getContentUrl(item, 'https://example.com');
		
		const pathPart = url.replace('https://', '');
		expect(pathPart).not.toContain('//');
	});

	fcTest.prop([contentTypeArb, slugArb])('getContentActivityPubId starts with base URL', (type, slug) => {
		const item = makeItem({ type, slug, authorHandle: 'testuser' });
		const id = getContentActivityPubId(item, 'https://example.com');
		expect(id.startsWith('https://example.com/')).toBe(true);
	});
});
