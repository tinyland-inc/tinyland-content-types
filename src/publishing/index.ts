
















export type PublishingStatus =
	| 'draft'        
	| 'pending'      
	| 'scheduled'    
	| 'published'    
	| 'archived';    






export type PublishingRole =
	| 'viewer'
	| 'member'
	| 'contributor'
	| 'event_manager'
	| 'editor'
	| 'moderator'
	| 'admin'
	| 'super_admin';




export interface ScheduledPublishing {
	scheduledAt: string;          
	timezone?: string;            
	publishedBy?: string;         
	autoFederate?: boolean;       
}




export interface ContentVersion {
	version: number;              
	createdAt: string;            
	createdBy: string;            
	changeType: 'create' | 'edit' | 'status' | 'restore';
	changeSummary?: string;       
}




export interface PublishingMetadata {
	status: PublishingStatus;
	scheduling?: ScheduledPublishing;
	versions?: ContentVersion[];
	currentVersion?: number;
	lastEditedAt?: string;
	lastEditedBy?: string;
}









export const STATUS_TRANSITIONS: Record<PublishingStatus, PublishingStatus[]> = {
	draft: ['pending', 'scheduled', 'published'],
	pending: ['draft', 'scheduled', 'published'],
	scheduled: ['draft', 'pending', 'published'],
	published: ['draft', 'archived'],
	archived: ['draft', 'published']
};





export const TRANSITION_PERMISSIONS: Record<PublishingStatus, PublishingRole[]> = {
	draft: ['contributor', 'member', 'editor', 'moderator', 'admin', 'super_admin'],
	pending: ['contributor', 'member', 'editor', 'moderator', 'admin', 'super_admin'],
	scheduled: ['editor', 'moderator', 'admin', 'super_admin'],
	published: ['editor', 'moderator', 'admin', 'super_admin'],
	archived: ['moderator', 'admin', 'super_admin']
};








export const STATUS_LABELS: Record<PublishingStatus, string> = {
	draft: 'Draft',
	pending: 'Pending Review',
	scheduled: 'Scheduled',
	published: 'Published',
	archived: 'Archived'
};





export const STATUS_COLORS: Record<PublishingStatus, string> = {
	draft: 'warning',
	pending: 'info',
	scheduled: 'secondary',
	published: 'success',
	archived: 'surface'
};





export const STATUS_ICONS: Record<PublishingStatus, string> = {
	draft: 'mdi:pencil',
	pending: 'mdi:clock-outline',
	scheduled: 'mdi:calendar-clock',
	published: 'mdi:check-circle',
	archived: 'mdi:archive'
};











export function canTransition(from: PublishingStatus, to: PublishingStatus): boolean {
	return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}







export function canUserTransitionTo(userRole: PublishingRole, targetStatus: PublishingStatus): boolean {
	return TRANSITION_PERMISSIONS[targetStatus]?.includes(userRole) ?? false;
}








export function canUserTransition(
	user: { role: PublishingRole },
	from: PublishingStatus,
	to: PublishingStatus
): boolean {
	
	if (!canTransition(from, to)) {
		return false;
	}

	
	return canUserTransitionTo(user.role, to);
}







export function getAvailableTransitions(
	current: PublishingStatus,
	userRole: PublishingRole
): PublishingStatus[] {
	const possibleTransitions = STATUS_TRANSITIONS[current] ?? [];
	return possibleTransitions.filter(status => canUserTransitionTo(userRole, status));
}






export function validateScheduling(scheduling: ScheduledPublishing): string | null {
	
	const scheduledDate = new Date(scheduling.scheduledAt);
	const now = new Date();

	if (isNaN(scheduledDate.getTime())) {
		return 'Invalid scheduled date format';
	}

	if (scheduledDate <= now) {
		return 'Scheduled date must be in the future';
	}

	
	if (scheduling.timezone) {
		try {
			
			Intl.DateTimeFormat('en-US', { timeZone: scheduling.timezone });
		} catch {
			return `Invalid timezone: ${scheduling.timezone}`;
		}
	}

	return null;
}









export function createVersion(
	version: number,
	createdBy: string,
	changeType: ContentVersion['changeType'],
	changeSummary?: string
): ContentVersion {
	return {
		version,
		createdAt: new Date().toISOString(),
		createdBy,
		changeType,
		changeSummary
	};
}






export function getStatusDescription(status: PublishingStatus): string {
	const descriptions: Record<PublishingStatus, string> = {
		draft: 'Content is being edited and is not visible to the public',
		pending: 'Content is submitted for review by an editor or moderator',
		scheduled: 'Content is approved and will be published at a scheduled time',
		published: 'Content is live and visible according to its visibility settings',
		archived: 'Content is hidden but preserved in the archive'
	};

	return descriptions[status];
}






export function isPubliclyVisible(status: PublishingStatus): boolean {
	return status === 'published';
}






export function isEditable(status: PublishingStatus): boolean {
	
	return status !== 'archived';
}






export function getNextStatus(current: PublishingStatus): PublishingStatus | null {
	const workflow: Partial<Record<PublishingStatus, PublishingStatus>> = {
		draft: 'pending',
		pending: 'published',
		scheduled: 'published'
	};

	return workflow[current] ?? null;
}








export function isPublishingStatus(value: string): value is PublishingStatus {
	return ['draft', 'pending', 'scheduled', 'published', 'archived'].includes(value);
}




export function isPublishingMetadata(obj: unknown): obj is PublishingMetadata {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const meta = obj as Partial<PublishingMetadata>;
	return (
		typeof meta.status === 'string' &&
		isPublishingStatus(meta.status)
	);
}




export function isScheduledPublishing(obj: unknown): obj is ScheduledPublishing {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const sched = obj as Partial<ScheduledPublishing>;
	return typeof sched.scheduledAt === 'string';
}
