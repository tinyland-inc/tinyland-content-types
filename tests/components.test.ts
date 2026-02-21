import { describe, it, expect } from 'vitest';
import {
	normalizeFrontmatter,
	type NormalizedFrontmatter
} from '../src/components/index.js';

describe('normalizeFrontmatter', () => {
	it('normalizes basic frontmatter', () => {
		const result = normalizeFrontmatter({
			title: 'My Post',
			excerpt: 'A summary',
			publishedAt: '2024-01-01',
			tags: ['test']
		});
		expect(result.title).toBe('My Post');
		expect(result.excerpt).toBe('A summary');
		expect(result.publishedAt).toBe('2024-01-01');
		expect(result.tags).toEqual(['test']);
	});

	it('defaults title to "Untitled"', () => {
		const result = normalizeFrontmatter({});
		expect(result.title).toBe('Untitled');
	});

	it('extracts author from object', () => {
		const result = normalizeFrontmatter({
			title: 'Test',
			author: { name: 'Alice', handle: 'alice', avatar: '/img/a.jpg' }
		});
		expect(result.author).toBeDefined();
		expect(result.author!.name).toBe('Alice');
		expect(result.author!.handle).toBe('alice');
		expect(result.author!.avatar).toBe('/img/a.jpg');
	});

	it('extracts author from string', () => {
		const result = normalizeFrontmatter({
			title: 'Test',
			author: 'Bob'
		});
		expect(result.author).toBeDefined();
		expect(result.author!.name).toBe('Bob');
	});

	it('falls back to organizer for author', () => {
		const result = normalizeFrontmatter({
			title: 'Test',
			organizer: { name: 'Carol', handle: 'carol' }
		});
		expect(result.author).toBeDefined();
		expect(result.author!.name).toBe('Carol');
		expect(result.author!.handle).toBe('carol');
	});

	it('falls back to coordinator for author', () => {
		const result = normalizeFrontmatter({
			title: 'Test',
			coordinator: { name: 'Dave', handle: 'dave' }
		});
		expect(result.author).toBeDefined();
		expect(result.author!.name).toBe('Dave');
	});

	it('extracts hero image from multiple fallback fields', () => {
		expect(normalizeFrontmatter({ heroImage: '/h.jpg' }).heroImage).toBe('/h.jpg');
		expect(normalizeFrontmatter({ featuredImage: '/f.jpg' }).heroImage).toBe('/f.jpg');
		expect(normalizeFrontmatter({ coverImage: '/c.jpg' }).heroImage).toBe('/c.jpg');
		expect(normalizeFrontmatter({ image: '/i.jpg' }).heroImage).toBe('/i.jpg');
	});

	it('extracts publishedAt from fallback fields', () => {
		expect(normalizeFrontmatter({ publishedAt: '2024-01-01' }).publishedAt).toBe('2024-01-01');
		expect(normalizeFrontmatter({ date: '2024-02-01' }).publishedAt).toBe('2024-02-01');
		expect(normalizeFrontmatter({ createdAt: '2024-03-01' }).publishedAt).toBe('2024-03-01');
	});

	it('extracts updatedAt from lastModified fallback', () => {
		expect(normalizeFrontmatter({ updatedAt: '2024-06-01' }).updatedAt).toBe('2024-06-01');
		expect(normalizeFrontmatter({ lastModified: '2024-07-01' }).updatedAt).toBe('2024-07-01');
	});

	it('detects draft status from draft flag', () => {
		expect(normalizeFrontmatter({ draft: true }).isDraft).toBe(true);
	});

	it('detects draft status from published=false', () => {
		expect(normalizeFrontmatter({ published: false }).isDraft).toBe(true);
	});

	it('detects draft status from status field', () => {
		expect(normalizeFrontmatter({ status: 'draft' }).isDraft).toBe(true);
	});

	it('detects non-draft by default', () => {
		expect(normalizeFrontmatter({}).isDraft).toBe(false);
	});

	it('detects scheduled from status field', () => {
		expect(normalizeFrontmatter({ status: 'scheduled' }).isScheduled).toBe(true);
	});

	it('extracts subtitle from tagline fallback', () => {
		expect(normalizeFrontmatter({ subtitle: 'Sub' }).subtitle).toBe('Sub');
		expect(normalizeFrontmatter({ tagline: 'Tag' }).subtitle).toBe('Tag');
	});

	it('extracts excerpt from description fallback', () => {
		expect(normalizeFrontmatter({ description: 'Desc' }).excerpt).toBe('Desc');
	});

	it('extracts visibility', () => {
		expect(normalizeFrontmatter({ visibility: 'followers' }).visibility).toBe('followers');
	});
});
