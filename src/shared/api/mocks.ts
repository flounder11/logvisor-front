import type {
	AgentStatus,
	AgentsResponse,
	AlertHistoryResponse,
	AlertRule,
	AuthLoginResponse,
	DashboardSummary,
	DashboardTimeseriesResponse,
	LogEvent,
	MeResponse,
	SearchResponse,
	TopHostsResponse,
	TopServicesResponse
} from './types'

export const mockAuthLoginResponse: AuthLoginResponse = {
	token: 'mock-jwt-token',
	expiresAt: '2026-03-21T12:00:00.000Z'
}

export const mockMeResponse: MeResponse = {
	id: 'u_1',
	name: 'Valters',
	email: 'valtersdf112@proton.me',
	role: 'admin'
}

export const mockLogs: LogEvent[] = [
	{
		id: 'log_1',
		timestamp: '2026-03-20T09:12:11.000Z',
		level: 'ERROR',
		message: 'PostgreSQL connection failed: timeout while acquiring client',
		host: 'srv-app-01',
		service: 'api-gateway',
		sourcePath: '/var/log/app/api-gateway.log',
		metadata: { traceId: 'tr_101', env: 'prod', region: 'eu-central' }
	},
	{
		id: 'log_2',
		timestamp: '2026-03-20T09:12:18.000Z',
		level: 'WARN',
		message: 'High memory usage detected: 82%',
		host: 'srv-worker-02',
		service: 'worker',
		sourcePath: '/var/log/app/worker.log',
		metadata: { env: 'prod', pod: 'worker-7fdc9' }
	},
	{
		id: 'log_3',
		timestamp: '2026-03-20T09:13:02.000Z',
		level: 'INFO',
		message: 'User login succeeded',
		host: 'srv-auth-01',
		service: 'auth-service',
		sourcePath: '/var/log/app/auth.log',
		metadata: { userId: '42', ip: '192.168.1.10' }
	},
	{
		id: 'log_4',
		timestamp: '2026-03-20T09:14:44.000Z',
		level: 'ERROR',
		message: 'Disk pressure warning escalated to critical threshold',
		host: 'srv-storage-01',
		service: 'node-exporter',
		sourcePath: '/var/log/syslog',
		metadata: { disk: '/dev/sda1', usagePercent: 96 }
	},
	{
		id: 'log_5',
		timestamp: '2026-03-20T09:15:28.000Z',
		level: 'INFO',
		message: 'Scheduled backup completed successfully',
		host: 'srv-db-01',
		service: 'backup-service',
		sourcePath: '/var/log/app/backup.log',
		metadata: { durationSec: 124, sizeMb: 812 }
	}
]

export const mockSearchResponse: SearchResponse = {
	items: mockLogs,
	total: 245,
	page: 1,
	size: 20,
	aggregations: {
		levels: {
			INFO: 120,
			WARN: 78,
			ERROR: 47
		},
		hosts: {
			'srv-app-01': 42,
			'srv-worker-02': 37,
			'srv-db-01': 28
		},
		services: {
			'api-gateway': 51,
			worker: 39,
			'auth-service': 22
		}
	}
}

export const mockDashboardSummary: DashboardSummary = {
	totalLogs: 18234,
	errors: 342,
	warnings: 917,
	activeAgents: 14,
	triggeredAlerts: 7
}

export const mockDashboardTimeseries: DashboardTimeseriesResponse = {
	items: [
		{ timestamp: '2026-03-20T08:00:00.000Z', errors: 12, warnings: 26 },
		{ timestamp: '2026-03-20T08:15:00.000Z', errors: 18, warnings: 31 },
		{ timestamp: '2026-03-20T08:30:00.000Z', errors: 9, warnings: 22 },
		{ timestamp: '2026-03-20T08:45:00.000Z', errors: 24, warnings: 40 },
		{ timestamp: '2026-03-20T09:00:00.000Z', errors: 29, warnings: 52 },
		{ timestamp: '2026-03-20T09:15:00.000Z', errors: 21, warnings: 36 }
	]
}

export const mockTopHosts: TopHostsResponse = {
	items: [
		{ host: 'srv-app-01', count: 420 },
		{ host: 'srv-worker-02', count: 371 },
		{ host: 'srv-db-01', count: 288 },
		{ host: 'srv-auth-01', count: 214 }
	]
}

export const mockTopServices: TopServicesResponse = {
	items: [
		{ service: 'api-gateway', count: 502 },
		{ service: 'worker', count: 411 },
		{ service: 'auth-service', count: 250 },
		{ service: 'backup-service', count: 190 }
	]
}

export const mockAlertRules: AlertRule[] = [
	{
		id: 'rule_1',
		name: 'Too many API errors',
		enabled: true,
		query: 'service:api-gateway level:ERROR',
		conditionType: 'count_gt',
		threshold: 20,
		windowSec: 300,
		cooldownSec: 600
	},
	{
		id: 'rule_2',
		name: 'OOM pattern detected',
		enabled: true,
		query: 'message:"out of memory"',
		conditionType: 'contains_pattern',
		threshold: 1,
		windowSec: 60,
		cooldownSec: 300
	},
	{
		id: 'rule_3',
		name: 'High error rate on workers',
		enabled: false,
		query: 'service:worker',
		conditionType: 'error_rate_gt',
		threshold: 15,
		windowSec: 300,
		cooldownSec: 900
	}
]

export const mockAlertHistory: AlertHistoryResponse = {
	items: [
		{
			id: 'hist_1',
			ruleId: 'rule_1',
			ruleName: 'Too many API errors',
			triggeredAt: '2026-03-20T09:10:00.000Z',
			message: '25 errors detected for api-gateway in 5m window',
			severity: 'ERROR'
		},
		{
			id: 'hist_2',
			ruleId: 'rule_2',
			ruleName: 'OOM pattern detected',
			triggeredAt: '2026-03-20T08:52:00.000Z',
			message: 'Pattern "out of memory" found in worker logs',
			severity: 'WARN'
		}
	],
	total: 2
}

export const mockAgents: AgentStatus[] = [
	{
		id: 'agent_1',
		name: 'agent-prod-01',
		hostName: 'srv-app-01',
		status: 'online',
		lastSeenAt: '2026-03-20T09:15:22.000Z',
		bufferedCount: 0
	},
	{
		id: 'agent_2',
		name: 'agent-prod-02',
		hostName: 'srv-worker-02',
		status: 'degraded',
		lastSeenAt: '2026-03-20T09:14:58.000Z',
		bufferedCount: 17
	},
	{
		id: 'agent_3',
		name: 'agent-prod-03',
		hostName: 'srv-db-01',
		status: 'offline',
		lastSeenAt: '2026-03-20T08:58:11.000Z',
		bufferedCount: 134
	}
]

export const mockAgentsResponse: AgentsResponse = {
	items: mockAgents,
	total: mockAgents.length
}
