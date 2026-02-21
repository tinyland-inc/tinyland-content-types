/**
 * Commerce & Transaction Types
 * Product transaction methods and Schema.org offer types
 */

// ============================================================================
// Product Transaction Types (15 supported methods)
// ============================================================================

/** All supported transaction types */
export type TransactionType =
	| 'inquiry'                // Contact form / email inquiry
	| 'ebay'                   // eBay listing link
	| 'etsy'                   // Etsy listing link
	| 'amazon'                 // Amazon listing link
	| 'snail-mail'             // Physical mail order
	| 'monero'                 // Monero cryptocurrency
	| 'stripe'                 // Stripe payment
	| 'polar'                  // Polar.sh subscription
	| 'taler'                  // GNU Taler payment
	| 'repository'             // Source code repository
	| 'documentation'          // Documentation link
	| 'booking'                // Appointment/booking system
	| 'liberapay'              // Liberapay donations
	| 'kofi'                   // Ko-fi donations
	| 'contribute-to-consume'; // Work-trade contribution

/** Transaction method configuration */
export interface TransactionMethod {
	type: TransactionType;
	enabled: boolean;
	label?: string;
	description?: string;
	url?: string;
	config?: TransactionConfig;
	priority?: number;
}

/** Type-specific configuration options */
export type TransactionConfig =
	| InquiryConfig
	| MarketplaceConfig
	| CryptoConfig
	| PaymentConfig
	| RepositoryConfig
	| BookingConfig
	| ContributeConfig;

export interface InquiryConfig {
	emailSubject?: string;
	formFields?: string[];
}

export interface MarketplaceConfig {
	listingId?: string;
	storeName?: string;
}

export interface CryptoConfig {
	address: string;
	network?: string;
}

export interface PaymentConfig {
	priceId?: string;
	amount?: number;
	currency?: string;
}

export interface RepositoryConfig {
	repoUrl: string;
	branch?: string;
	licenseSpdx?: string;
}

export interface BookingConfig {
	calendarUrl?: string;
	duration?: number;
	timezone?: string;
}

export interface ContributeConfig {
	requiredHours?: number;
	skills?: string[];
	instructions?: string;
}

/** Default labels for transaction types */
export const TRANSACTION_LABELS: Record<TransactionType, string> = {
	inquiry: 'Inquire',
	ebay: 'Buy on eBay',
	etsy: 'Buy on Etsy',
	amazon: 'Buy on Amazon',
	'snail-mail': 'Order by Mail',
	monero: 'Pay with Monero',
	stripe: 'Buy Now',
	polar: 'Subscribe',
	taler: 'Pay with Taler',
	repository: 'View Source',
	documentation: 'Read Docs',
	booking: 'Book Appointment',
	liberapay: 'Support on Liberapay',
	kofi: 'Buy me a Coffee',
	'contribute-to-consume': 'Contribute to Access'
};

/** Icons for transaction types (icon library names) */
export const TRANSACTION_ICONS: Record<TransactionType, string> = {
	inquiry: 'mdi:email-outline',
	ebay: 'simple-icons:ebay',
	etsy: 'simple-icons:etsy',
	amazon: 'simple-icons:amazon',
	'snail-mail': 'mdi:mailbox-outline',
	monero: 'simple-icons:monero',
	stripe: 'mdi:credit-card-outline',
	polar: 'mdi:polar',
	taler: 'mdi:currency-eur',
	repository: 'mdi:source-repository',
	documentation: 'mdi:file-document-outline',
	booking: 'mdi:calendar-clock',
	liberapay: 'simple-icons:liberapay',
	kofi: 'simple-icons:kofi',
	'contribute-to-consume': 'mdi:hand-heart-outline'
};

/** Helper to get enabled transactions sorted by priority */
export function getEnabledTransactions(methods: TransactionMethod[]): TransactionMethod[] {
	return methods
		.filter((m) => m.enabled)
		.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
}

/** Helper to get transaction label */
export function getTransactionLabel(method: TransactionMethod): string {
	return method.label ?? TRANSACTION_LABELS[method.type];
}

// ============================================================================
// Schema.org Offer Types (for ActivityPub commerce federation)
// ============================================================================

export type OfferAvailability =
	| 'InStock'
	| 'OutOfStock'
	| 'PreOrder'
	| 'SoldOut'
	| 'OnlineOnly'
	| 'LimitedAvailability'
	| 'Discontinued';

export type PaymentMethod =
	| 'Cash'
	| 'CreditCard'
	| 'Cryptocurrency'
	| 'BankTransfer'
	| 'PaymentService'
	| 'Subscription'
	| 'Donation'
	| 'Exchange'; // For contribute-to-consume

export interface PriceSpecification {
	'@type': 'PriceSpecification' | 'UnitPriceSpecification';
	price: number | string;
	priceCurrency: string; // ISO 4217 (USD, EUR, XMR)
	valueAddedTaxIncluded?: boolean;
	validFrom?: string; // ISO 8601
	validThrough?: string; // ISO 8601
	minPrice?: number;
	maxPrice?: number;
}

export interface SchemaOffer {
	'@context': 'https://schema.org';
	'@type': 'Offer';
	'@id': string; // ActivityPub ID
	name: string;
	description?: string;
	url?: string;
	price?: number | string;
	priceCurrency?: string;
	priceSpecification?: PriceSpecification;
	availability: OfferAvailability;
	availabilityStarts?: string;
	availabilityEnds?: string;
	seller?: {
		'@type': 'Person' | 'Organization';
		name: string;
		url?: string;
	};
	itemOffered?: {
		'@type': 'Product' | 'Service' | 'CreativeWork';
		name: string;
		description?: string;
		url?: string;
		image?: string;
	};
	acceptedPaymentMethod?: PaymentMethod[];
	// Extension fields for federation
	transactionType: string; // Our internal type
	externalUrl?: string; // Link to external platform
	requiresAction?: string; // e.g., "contact", "subscribe", "contribute"
}

/**
 * Transaction type to schema.org mapping configuration
 */
export interface TransactionMapping {
	transactionType: string;
	schemaType: 'Offer' | 'DonateAction' | 'BuyAction' | 'ReserveAction';
	paymentMethods: PaymentMethod[];
	defaultAvailability: OfferAvailability;
	requiresExternalUrl: boolean;
	isMonetary: boolean;
	isCryptocurrency: boolean;
	isSubscription: boolean;
	isDonation: boolean;
}

/**
 * Mapping configuration for all 15 transaction types
 */
export const TRANSACTION_MAPPINGS: Record<string, TransactionMapping> = {
	inquiry: {
		transactionType: 'inquiry',
		schemaType: 'Offer',
		paymentMethods: [],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: false,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	ebay: {
		transactionType: 'ebay',
		schemaType: 'Offer',
		paymentMethods: ['CreditCard', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	etsy: {
		transactionType: 'etsy',
		schemaType: 'Offer',
		paymentMethods: ['CreditCard', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	amazon: {
		transactionType: 'amazon',
		schemaType: 'Offer',
		paymentMethods: ['CreditCard', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	'snail-mail': {
		transactionType: 'snail-mail',
		schemaType: 'Offer',
		paymentMethods: ['Cash', 'BankTransfer'],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	monero: {
		transactionType: 'monero',
		schemaType: 'Offer',
		paymentMethods: ['Cryptocurrency'],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: true,
		isCryptocurrency: true,
		isSubscription: false,
		isDonation: false
	},
	stripe: {
		transactionType: 'stripe',
		schemaType: 'Offer',
		paymentMethods: ['CreditCard', 'PaymentService'],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	polar: {
		transactionType: 'polar',
		schemaType: 'Offer',
		paymentMethods: ['Subscription', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: true,
		isDonation: false
	},
	taler: {
		transactionType: 'taler',
		schemaType: 'Offer',
		paymentMethods: ['BankTransfer', 'PaymentService'],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	repository: {
		transactionType: 'repository',
		schemaType: 'Offer',
		paymentMethods: [],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: false,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	documentation: {
		transactionType: 'documentation',
		schemaType: 'Offer',
		paymentMethods: [],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: false,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	booking: {
		transactionType: 'booking',
		schemaType: 'ReserveAction',
		paymentMethods: ['PaymentService', 'CreditCard'],
		defaultAvailability: 'LimitedAvailability',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	},
	liberapay: {
		transactionType: 'liberapay',
		schemaType: 'DonateAction',
		paymentMethods: ['Donation', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: true,
		isDonation: true
	},
	kofi: {
		transactionType: 'kofi',
		schemaType: 'DonateAction',
		paymentMethods: ['Donation', 'PaymentService'],
		defaultAvailability: 'OnlineOnly',
		requiresExternalUrl: true,
		isMonetary: true,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: true
	},
	'contribute-to-consume': {
		transactionType: 'contribute-to-consume',
		schemaType: 'Offer',
		paymentMethods: ['Exchange'],
		defaultAvailability: 'InStock',
		requiresExternalUrl: false,
		isMonetary: false,
		isCryptocurrency: false,
		isSubscription: false,
		isDonation: false
	}
};

/**
 * Get transaction mapping configuration
 */
export function getTransactionMapping(type: string): TransactionMapping | undefined {
	return TRANSACTION_MAPPINGS[type];
}

/**
 * Check if transaction type requires external URL
 */
export function requiresExternalUrl(type: string): boolean {
	return TRANSACTION_MAPPINGS[type]?.requiresExternalUrl ?? false;
}

/**
 * Check if transaction type is monetary
 */
export function isMonetary(type: string): boolean {
	return TRANSACTION_MAPPINGS[type]?.isMonetary ?? false;
}

/**
 * Get all supported transaction types
 */
export function getSupportedTransactionTypes(): string[] {
	return Object.keys(TRANSACTION_MAPPINGS);
}
