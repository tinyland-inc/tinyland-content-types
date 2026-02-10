/**
 * @tinyland-inc/tinyland-content-types
 *
 * Shared content type definitions for content management and ActivityPub federation.
 * This package provides the type layer used by both content services and ActivityPub services.
 *
 * Sub-entry points:
 * - `@tinyland-inc/tinyland-content-types/visibility` - Visibility types and AP addressing
 * - `@tinyland-inc/tinyland-content-types/activitypub` - AP federation content types
 */

// ============================================================================
// Visibility (core)
// ============================================================================
export {
	type ContentVisibility,
	type LegacyRBACVisibility,
	type ActivityPubAddressing,
	CONTENT_VISIBILITY_VALUES,
	ACTIVITYPUB_PUBLIC,
	VISIBILITY_LABELS,
	VISIBILITY_ICONS,
	migrateVisibility,
	isValidVisibility,
	getAddressingForVisibility,
	inferVisibilityFromAddressing,
	isVisibleTo
} from './visibility/index.js';

// ============================================================================
// Frontmatter types (all content types)
// ============================================================================
export {
	// Base
	type FediverseVisibility,
	type AuthorReference,
	type BaseFrontmatter,
	type ContactFrontmatter,
	type UserPageFrontmatter,
	// Blog
	type VideoEmbed,
	type Reference,
	type BlogFrontmatter,
	type BlogPost,
	type BlogPostWithStats,
	type BlogCategory,
	type BlogAuthor,
	// Product
	type ProductVariant,
	type PhysicalProductDetails,
	type ProductGalleryImage,
	type StockStatus,
	type ProductRelationshipType,
	type ProductFrontmatter,
	type ProductCategory,
	type Product,
	type ProductDisplay,
	getPrimaryTransaction,
	// Profile
	type LegacyProfileVisibility,
	type ProfileFrontmatter,
	type Profile,
	type ProfileWithStats,
	type ProfileRole,
	type ProfileConnection,
	// Event
	type EventFrontmatter,
	type Event,
	type EventDisplay,
	type EventContent,
	type XandikosEvent,
	type EventWithCalendar,
	// Note
	type NoteFrontmatter,
	type Note,
	type NoteDisplay,
	noteToDisplay,
	// Video
	type VideoFrontmatter,
	type Video,
	type VideoDisplay,
	videoToDisplay,
	formatDuration,
	parseDuration,
	// Gallery
	type GalleryImage,
	type GalleryItemFrontmatter,
	type GalleryItem,
	type GalleryItemDisplay,
	type GalleryCollection,
	galleryItemToDisplay,
	getImageSrcset,
	getAspectRatio
} from './frontmatter/index.js';

// ============================================================================
// Unified content model (cross-content operations)
// ============================================================================
export {
	type ContentType,
	type ActivityPubObjectType,
	type ProgramFrontmatter,
	type AnyFrontmatter,
	type UnifiedContentItem,
	type ExtendedProductFrontmatter,
	type ExtendedBlogFrontmatter,
	type ContentWithRelations,
	// Type guards
	isBlogContent,
	isNoteContent,
	isProductContent,
	isEventContent,
	isProgramContent,
	isVideoContent,
	isProfileContent,
	// AP type mapping
	getContentActivityPubType,
	getActivityPubContentType,
	// URL helpers
	getContentUrl,
	getContentActivityPubId,
	// Display helpers
	getContentTitle,
	getContentExcerpt,
	getContentImage,
	getContentAuthor
} from './unified/index.js';

// ============================================================================
// Commerce types
// ============================================================================
export {
	type TransactionType,
	type TransactionMethod,
	type TransactionConfig,
	type InquiryConfig,
	type MarketplaceConfig,
	type CryptoConfig,
	type PaymentConfig,
	type RepositoryConfig,
	type BookingConfig,
	type ContributeConfig,
	type OfferAvailability,
	type PaymentMethod,
	type PriceSpecification,
	type SchemaOffer,
	type TransactionMapping,
	TRANSACTION_LABELS,
	TRANSACTION_ICONS,
	TRANSACTION_MAPPINGS,
	getEnabledTransactions,
	getTransactionLabel,
	getTransactionMapping,
	requiresExternalUrl,
	isMonetary,
	getSupportedTransactionTypes
} from './commerce/index.js';

// ============================================================================
// Content component types
// ============================================================================
export {
	type ProgressVariant,
	type SeriesPost,
	type ContentAuthor,
	type AuthorCardProps,
	type MetaBadgesProps,
	type HeroImageProps,
	type ContentBadge,
	type ContentTitleProps,
	type NormalizedFrontmatter,
	normalizeFrontmatter
} from './components/index.js';

// ============================================================================
// Publishing workflow
// ============================================================================
export {
	type PublishingStatus,
	type PublishingRole,
	type ScheduledPublishing,
	type ContentVersion,
	type PublishingMetadata,
	STATUS_TRANSITIONS,
	TRANSITION_PERMISSIONS,
	STATUS_LABELS,
	STATUS_COLORS,
	STATUS_ICONS,
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
	isScheduledPublishing
} from './publishing/index.js';
