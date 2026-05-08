import { describe, expect, it } from 'vitest';
import {
	SCHEDULING_BACKENDS,
	SCHEDULING_AVAILABILITY_MODES,
	SCHEDULING_REGISTRATION_MODES,
	isManagedSchedulingMode,
	schedulingReferenceRequiresManagedCapability,
	type TinylandSchedulingInstance,
	type TinylandSchedulingReference
} from '../src/index.js';

describe('scheduling content types', () => {
	it('exports the scheduling modes needed by Tinyland service surfaces', () => {
		expect(SCHEDULING_BACKENDS).toContain('vagaro');
		expect(SCHEDULING_AVAILABILITY_MODES).toContain('inquiry-only');
		expect(SCHEDULING_AVAILABILITY_MODES).toContain('managed-booking');
		expect(SCHEDULING_REGISTRATION_MODES).toContain('managed-registration');
	});

	it('identifies managed scheduling modes', () => {
		expect(isManagedSchedulingMode('managed-booking')).toBe(true);
		expect(isManagedSchedulingMode('managed-registration')).toBe(true);
		expect(isManagedSchedulingMode('inquiry')).toBe(false);
		expect(isManagedSchedulingMode('external-url')).toBe(false);
	});

	it('keeps scheduling references adapter-neutral', () => {
		const ref: TinylandSchedulingReference = {
			instanceId: 'boots-consult-dropoff',
			localServiceId: 'dropoff-consult',
			registrationMode: 'inquiry',
			required: true
		};

		expect(schedulingReferenceRequiresManagedCapability(ref)).toBe(false);
	});

	it('models public scheduling instances without booking runtime ownership', () => {
		const instance: TinylandSchedulingInstance<{ kind: 'brand'; slug: string }> = {
			id: 'software-discovery',
			slug: 'software-discovery',
			status: 'draft',
			owner: {
				kind: 'brand',
				slug: 'software-tinyland-dev'
			},
			kind: 'consultation',
			authority: {
				provider: 'scheduling-kit',
				backend: 'homegrown',
				runtime: 'tinyland-dev',
				packageTuple: {
					schedulingKit: '@tummycrypt/scheduling-kit'
				}
			},
			publicSurface: {
				label: 'Software discovery call',
				availabilityMode: 'inquiry-only',
				inquiryUrl: '/contact',
				responseSla: 'same business day'
			},
			projection: {
				public: false,
				spokeTargets: ['software.tinyland.dev']
			}
		};

		expect(instance.authority.backend).toBe('homegrown');
		expect(instance.publicSurface.availabilityMode).toBe('inquiry-only');
	});
});
