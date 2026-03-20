export type LogLevel = 'INFO' | 'WARN' | 'ERROR'
export type AgentStatusType = 'online' | 'offline' | 'degraded'
export type AlertConditionType =
	| 'count_gt'
	| 'contains_pattern'
	| 'error_rate_gt'
export type UserRole = 'admin' | 'viewer'

export type ApiError = {
	message: string
	code?: string
	details?: Record<string, unknown>
}

export type AuthLoginRequest = {
	login: string
	password: string
}

export type AuthLoginResponse = {
	token: string
	expiresAt: string
}

export type MeResponse = {
	id: string
	name: string
	email: string
	role: UserRole
}

export type LogEvent = {
	id: string
	timestamp: string
	level: LogLevel
	message: string
	host: string
	service: string
	sourcePath?: string
	metadata?: Record<string, unknown>
}

export type SearchLogsRequest = {
	q?: string
	host?: string
	service?: string
	level?: LogLevel | ''
	from?: string
	to?: string
	page: number
	size: number
}

export type SearchResponse = {
	items: LogEvent[]
	total: number
	page: number
	size: number
	aggregations?: {
		levels?: Record<string, number>
		hosts?: Record<string, number>
		services?: Record<string, number>
	}
}

export type DashboardSummary = {
	totalLogs: number
	errors: number
	warnings: number
	activeAgents: number
	triggeredAlerts: number
}

export type TimeseriesPoint = {
	timestamp: string
	errors: number
	warnings: number
}

export type DashboardTimeseriesResponse = {
	items: TimeseriesPoint[]
}

export type TopHostItem = {
	host: string
	count: number
}

export type TopHostsResponse = {
	items: TopHostItem[]
}

export type TopServiceItem = {
	service: string
	count: number
}

export type TopServicesResponse = {
	items: TopServiceItem[]
}

export type AlertRule = {
	id: string
	name: string
	enabled: boolean
	query: string
	conditionType: AlertConditionType
	threshold: number
	windowSec: number
	cooldownSec: number
}

export type CreateAlertRuleRequest = Omit<AlertRule, 'id'>
export type UpdateAlertRuleRequest = Partial<Omit<AlertRule, 'id'>>

export type AlertHistoryItem = {
	id: string
	ruleId: string
	ruleName: string
	triggeredAt: string
	message: string
	severity: LogLevel
}

export type AlertHistoryResponse = {
	items: AlertHistoryItem[]
	total: number
}

export type AgentStatus = {
	id: string
	name: string
	hostName: string
	status: AgentStatusType
	lastSeenAt?: string
	bufferedCount?: number
}

export type AgentsResponse = {
	items: AgentStatus[]
	total: number
}

export type LiveConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export type LiveEventMessage = {
	type: 'log_event'
	payload: LogEvent
}

export type AlertTriggeredMessage = {
	type: 'alert_triggered'
	payload: AlertHistoryItem
}

export type AgentStatusMessage = {
	type: 'agent_status'
	payload: AgentStatus
}

export type LiveWsMessage =
	| LiveEventMessage
	| AlertTriggeredMessage
	| AgentStatusMessage
