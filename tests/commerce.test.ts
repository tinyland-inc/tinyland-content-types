import { describe, it, expect } from 'vitest';
import {
	getEnabledTransactions,
	getTransactionLabel,
	getTransactionMapping,
	requiresExternalUrl,
	isMonetary,
	getSupportedTransactionTypes,
	TRANSACTION_LABELS,
	TRANSACTION_ICONS,
	TRANSACTION_MAPPINGS,
	type TransactionMethod,
	type TransactionType
} from '../src/commerce/index.js';
import {
	getPrimaryTransaction,
	type ProductFrontmatter
} from '../src/frontmatter/product.js';





describe('getEnabledTransactions', () => {
	it('returns only enabled transactions', () => {
		const methods: TransactionMethod[] = [
			{ type: 'stripe', enabled: true, priority: 1 },
			{ type: 'ebay', enabled: false, priority: 2 },
			{ type: 'monero', enabled: true, priority: 3 }
		];
		const result = getEnabledTransactions(methods);
		expect(result).toHaveLength(2);
		expect(result.map(m => m.type)).toEqual(['stripe', 'monero']);
	});

	it('sorts by priority', () => {
		const methods: TransactionMethod[] = [
			{ type: 'monero', enabled: true, priority: 3 },
			{ type: 'stripe', enabled: true, priority: 1 },
			{ type: 'etsy', enabled: true, priority: 2 }
		];
		const result = getEnabledTransactions(methods);
		expect(result.map(m => m.type)).toEqual(['stripe', 'etsy', 'monero']);
	});

	it('handles missing priority (defaults to 99)', () => {
		const methods: TransactionMethod[] = [
			{ type: 'monero', enabled: true },
			{ type: 'stripe', enabled: true, priority: 1 }
		];
		const result = getEnabledTransactions(methods);
		expect(result[0].type).toBe('stripe');
		expect(result[1].type).toBe('monero');
	});

	it('returns empty array for no enabled transactions', () => {
		const methods: TransactionMethod[] = [
			{ type: 'stripe', enabled: false },
			{ type: 'ebay', enabled: false }
		];
		expect(getEnabledTransactions(methods)).toEqual([]);
	});

	it('returns empty array for empty input', () => {
		expect(getEnabledTransactions([])).toEqual([]);
	});
});





describe('getTransactionLabel', () => {
	it('returns custom label when provided', () => {
		const method: TransactionMethod = {
			type: 'stripe',
			enabled: true,
			label: 'Purchase Now'
		};
		expect(getTransactionLabel(method)).toBe('Purchase Now');
	});

	it('falls back to default label', () => {
		const method: TransactionMethod = { type: 'stripe', enabled: true };
		expect(getTransactionLabel(method)).toBe('Buy Now');
	});

	it('returns correct default labels for all types', () => {
		const types: TransactionType[] = [
			'inquiry', 'ebay', 'etsy', 'amazon', 'snail-mail',
			'monero', 'stripe', 'polar', 'taler', 'repository',
			'documentation', 'booking', 'liberapay', 'kofi', 'contribute-to-consume'
		];
		for (const type of types) {
			const method: TransactionMethod = { type, enabled: true };
			const label = getTransactionLabel(method);
			expect(label).toBeDefined();
			expect(typeof label).toBe('string');
			expect(label.length).toBeGreaterThan(0);
		}
	});
});





describe('TRANSACTION_MAPPINGS', () => {
	it('has mappings for all 15 transaction types', () => {
		expect(Object.keys(TRANSACTION_MAPPINGS)).toHaveLength(15);
	});

	it('each mapping has required fields', () => {
		for (const [key, mapping] of Object.entries(TRANSACTION_MAPPINGS)) {
			expect(mapping.transactionType).toBe(key);
			expect(typeof mapping.requiresExternalUrl).toBe('boolean');
			expect(typeof mapping.isMonetary).toBe('boolean');
			expect(typeof mapping.isCryptocurrency).toBe('boolean');
			expect(typeof mapping.isSubscription).toBe('boolean');
			expect(typeof mapping.isDonation).toBe('boolean');
			expect(Array.isArray(mapping.paymentMethods)).toBe(true);
		}
	});

	it('monero is classified as cryptocurrency', () => {
		expect(TRANSACTION_MAPPINGS['monero'].isCryptocurrency).toBe(true);
	});

	it('liberapay is classified as donation', () => {
		expect(TRANSACTION_MAPPINGS['liberapay'].isDonation).toBe(true);
	});

	it('polar is classified as subscription', () => {
		expect(TRANSACTION_MAPPINGS['polar'].isSubscription).toBe(true);
	});

	it('inquiry is not monetary', () => {
		expect(TRANSACTION_MAPPINGS['inquiry'].isMonetary).toBe(false);
	});
});





describe('getTransactionMapping', () => {
	it('returns mapping for valid type', () => {
		const mapping = getTransactionMapping('stripe');
		expect(mapping).toBeDefined();
		expect(mapping!.transactionType).toBe('stripe');
	});

	it('returns undefined for unknown type', () => {
		expect(getTransactionMapping('nonexistent')).toBeUndefined();
	});
});

describe('requiresExternalUrl', () => {
	it('returns true for marketplace types', () => {
		expect(requiresExternalUrl('ebay')).toBe(true);
		expect(requiresExternalUrl('etsy')).toBe(true);
		expect(requiresExternalUrl('amazon')).toBe(true);
	});

	it('returns false for direct payment types', () => {
		expect(requiresExternalUrl('stripe')).toBe(false);
		expect(requiresExternalUrl('monero')).toBe(false);
	});

	it('returns false for unknown types', () => {
		expect(requiresExternalUrl('nonexistent')).toBe(false);
	});
});

describe('isMonetary', () => {
	it('returns true for payment types', () => {
		expect(isMonetary('stripe')).toBe(true);
		expect(isMonetary('monero')).toBe(true);
		expect(isMonetary('ebay')).toBe(true);
	});

	it('returns false for non-monetary types', () => {
		expect(isMonetary('inquiry')).toBe(false);
		expect(isMonetary('repository')).toBe(false);
		expect(isMonetary('documentation')).toBe(false);
	});
});

describe('getSupportedTransactionTypes', () => {
	it('returns all 15 types', () => {
		const types = getSupportedTransactionTypes();
		expect(types).toHaveLength(15);
		expect(types).toContain('stripe');
		expect(types).toContain('monero');
		expect(types).toContain('contribute-to-consume');
	});
});





describe('TRANSACTION_LABELS', () => {
	it('has labels for all transaction types', () => {
		const types = getSupportedTransactionTypes();
		for (const type of types) {
			expect(TRANSACTION_LABELS[type as TransactionType]).toBeDefined();
		}
	});
});

describe('TRANSACTION_ICONS', () => {
	it('has icons for all transaction types', () => {
		const types = getSupportedTransactionTypes();
		for (const type of types) {
			expect(TRANSACTION_ICONS[type as TransactionType]).toBeDefined();
		}
	});
});





describe('getPrimaryTransaction', () => {
	it('returns undefined when no transactions', () => {
		const product = { name: 'Test', slug: 'test', description: 'desc', category: 'tool' } as ProductFrontmatter;
		expect(getPrimaryTransaction(product)).toBeUndefined();
	});

	it('returns undefined for empty transactions array', () => {
		const product = {
			name: 'Test', slug: 'test', description: 'desc', category: 'tool',
			transactions: []
		} as ProductFrontmatter;
		expect(getPrimaryTransaction(product)).toBeUndefined();
	});

	it('returns explicitly set primary transaction', () => {
		const product = {
			name: 'Test', slug: 'test', description: 'desc', category: 'tool',
			primaryTransaction: 'monero' as TransactionType,
			transactions: [
				{ type: 'stripe' as TransactionType, enabled: true, priority: 1 },
				{ type: 'monero' as TransactionType, enabled: true, priority: 2 }
			]
		} as ProductFrontmatter;
		const result = getPrimaryTransaction(product);
		expect(result).toBeDefined();
		expect(result!.type).toBe('monero');
	});

	it('falls back to first enabled transaction by priority', () => {
		const product = {
			name: 'Test', slug: 'test', description: 'desc', category: 'tool',
			transactions: [
				{ type: 'monero' as TransactionType, enabled: true, priority: 5 },
				{ type: 'stripe' as TransactionType, enabled: true, priority: 1 },
				{ type: 'ebay' as TransactionType, enabled: false, priority: 0 }
			]
		} as ProductFrontmatter;
		const result = getPrimaryTransaction(product);
		expect(result).toBeDefined();
		expect(result!.type).toBe('stripe');
	});

	it('skips disabled primary transaction', () => {
		const product = {
			name: 'Test', slug: 'test', description: 'desc', category: 'tool',
			primaryTransaction: 'monero' as TransactionType,
			transactions: [
				{ type: 'stripe' as TransactionType, enabled: true, priority: 1 },
				{ type: 'monero' as TransactionType, enabled: false, priority: 2 }
			]
		} as ProductFrontmatter;
		const result = getPrimaryTransaction(product);
		expect(result).toBeDefined();
		expect(result!.type).toBe('stripe');
	});
});
