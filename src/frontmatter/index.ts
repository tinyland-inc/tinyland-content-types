/**
 * Frontmatter Type Exports
 * All frontmatter types for every content type
 */

// Base types
export type { FediverseVisibility, AuthorReference, BaseFrontmatter, ContactFrontmatter, UserPageFrontmatter } from './base.js';

// Blog types
export type { VideoEmbed, Reference, BlogFrontmatter, BlogPost, BlogPostWithStats, BlogCategory, BlogAuthor } from './blog.js';

// Product types
export type {
	ProductVariant,
	PhysicalProductDetails,
	ProductGalleryImage,
	StockStatus,
	ProductRelationshipType,
	ProductFrontmatter,
	ProductCategory,
	Product,
	ProductDisplay
} from './product.js';
export { getPrimaryTransaction } from './product.js';

// Profile types
export type { LegacyProfileVisibility, ProfileFrontmatter, Profile, ProfileWithStats, ProfileRole, ProfileConnection } from './profile.js';

// Event types
export type { EventFrontmatter, Event, EventDisplay, EventContent, XandikosEvent, EventWithCalendar } from './event.js';

// Note types
export type { NoteFrontmatter, Note, NoteDisplay } from './note.js';
export { noteToDisplay } from './note.js';

// Video types
export type { VideoFrontmatter, Video, VideoDisplay } from './video.js';
export { videoToDisplay, formatDuration, parseDuration } from './video.js';

// Gallery types
export type { GalleryImage, GalleryItemFrontmatter, GalleryItem, GalleryItemDisplay, GalleryCollection } from './gallery.js';
export { galleryItemToDisplay, getImageSrcset, getAspectRatio } from './gallery.js';
