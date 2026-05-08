export const SCHEDULING_BACKENDS = [
	'homegrown',
	'acuity',
	'calcom',
	'glossgenius',
	'vagaro',
	'manual',
	'external-url'
] as const;

export const SCHEDULING_AVAILABILITY_MODES = [
	'inquiry-only',
	'external-url',
	'managed-booking',
	'managed-registration',
	'operator-policy'
] as const;

export const SCHEDULING_REGISTRATION_MODES = [
	'inquiry',
	'external-url',
	'managed-booking',
	'managed-registration',
	'operator-policy'
] as const;

export const SCHEDULING_INSTANCE_KINDS = [
	'consultation',
	'service-booking',
	'dropoff',
	'shoot-booking',
	'class-registration',
	'program-registration'
] as const;

export const SCHEDULING_INSTANCE_STATUSES = [
	'draft',
	'active',
	'paused',
	'retired'
] as const;

export const SCHEDULING_PAYMENT_MODES = [
	'none',
	'operator-policy',
	'external',
	'capability-gated'
] as const;

export const SCHEDULING_PROVIDERS = [
	'scheduling-kit'
] as const;

export const SCHEDULING_RUNTIMES = [
	'tinyland-dev',
	'massageithaca',
	'blahaj-k8s',
	'external'
] as const;

export type TinylandSchedulingBackend = typeof SCHEDULING_BACKENDS[number];
export type TinylandSchedulingAvailabilityMode = typeof SCHEDULING_AVAILABILITY_MODES[number];
export type TinylandSchedulingRegistrationMode = typeof SCHEDULING_REGISTRATION_MODES[number];
export type TinylandSchedulingInstanceKind = typeof SCHEDULING_INSTANCE_KINDS[number];
export type TinylandSchedulingInstanceStatus = typeof SCHEDULING_INSTANCE_STATUSES[number];
export type TinylandSchedulingPaymentMode = typeof SCHEDULING_PAYMENT_MODES[number];
export type TinylandSchedulingProvider = typeof SCHEDULING_PROVIDERS[number];
export type TinylandSchedulingRuntime = typeof SCHEDULING_RUNTIMES[number];

export interface TinylandSchedulingReference {
	instanceId: string;
	localServiceId?: string;
	registrationMode: TinylandSchedulingRegistrationMode;
	required?: boolean;
}

export interface TinylandSchedulingAuthority {
	provider: TinylandSchedulingProvider;
	backend: TinylandSchedulingBackend;
	runtime: TinylandSchedulingRuntime;
	packageTuple?: {
		schedulingKit?: string;
		schedulingBridge?: string;
	};
}

export interface TinylandSchedulingPublicSurface {
	label: string;
	availabilityMode: TinylandSchedulingAvailabilityMode;
	inquiryUrl?: string;
	bookingUrl?: string;
	responseSla?: string;
}

export interface TinylandSchedulingServiceMapping {
	localServiceId: string;
	schedulingKitServiceId?: string;
	providerServiceId?: string;
	durationMinutes?: number;
	priceCents?: number;
	currency?: string;
}

export interface TinylandSchedulingPaymentPolicy {
	mode: TinylandSchedulingPaymentMode;
	capabilitiesRef?: string;
	publicMethodLabels?: string[];
}

export interface TinylandSchedulingProjection {
	public: boolean;
	spokeTargets: string[];
}

export interface TinylandSchedulingOperations {
	runbookRef?: string;
	incidentLabel?: string;
	recoveryOwnerHandles?: string[];
}

export interface TinylandSchedulingRepresentedBy<TActorRef = unknown> {
	brand?: TActorRef;
	project?: TActorRef;
	organization?: TActorRef;
}

export interface TinylandSchedulingInstance<TActorRef = unknown> {
	id: string;
	slug: string;
	status: TinylandSchedulingInstanceStatus;
	owner: TActorRef;
	representedBy?: TinylandSchedulingRepresentedBy<TActorRef>;
	kind: TinylandSchedulingInstanceKind;
	authority: TinylandSchedulingAuthority;
	publicSurface: TinylandSchedulingPublicSurface;
	serviceMappings?: TinylandSchedulingServiceMapping[];
	payment?: TinylandSchedulingPaymentPolicy;
	projection: TinylandSchedulingProjection;
	operations?: TinylandSchedulingOperations;
}

export function isManagedSchedulingMode(
	mode: TinylandSchedulingRegistrationMode | TinylandSchedulingAvailabilityMode
): boolean {
	return mode === 'managed-booking' || mode === 'managed-registration';
}

export function schedulingReferenceRequiresManagedCapability(
	ref: TinylandSchedulingReference
): boolean {
	return isManagedSchedulingMode(ref.registrationMode);
}
