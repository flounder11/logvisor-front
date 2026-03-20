import {
	mockAgentsResponse,
	mockAlertHistory,
	mockAlertRules,
	mockAuthLoginResponse,
	mockDashboardSummary,
	mockDashboardTimeseries,
	mockMeResponse,
	mockSearchResponse,
	mockTopHosts,
	mockTopServices
} from './mocks'
import type {
	AgentsResponse,
	AlertHistoryResponse,
	AlertRule,
	AuthLoginRequest,
	AuthLoginResponse,
	DashboardSummary,
	DashboardTimeseriesResponse,
	MeResponse,
	SearchLogsRequest,
	SearchResponse,
	TopHostsResponse,
	TopServicesResponse
} from './types'

const sleep = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms))

export const apiClient = {
	async login(_: AuthLoginRequest): Promise<AuthLoginResponse> {
		await sleep()
		return mockAuthLoginResponse
	},

	async me(): Promise<MeResponse> {
		await sleep()
		return mockMeResponse
	},

	async searchLogs(_: SearchLogsRequest): Promise<SearchResponse> {
		await sleep()
		return mockSearchResponse
	},

	async getDashboardSummary(): Promise<DashboardSummary> {
		await sleep()
		return mockDashboardSummary
	},

	async getDashboardTimeseries(): Promise<DashboardTimeseriesResponse> {
		await sleep()
		return mockDashboardTimeseries
	},

	async getTopHosts(): Promise<TopHostsResponse> {
		await sleep()
		return mockTopHosts
	},

	async getTopServices(): Promise<TopServicesResponse> {
		await sleep()
		return mockTopServices
	},

	async getAlertRules(): Promise<AlertRule[]> {
		await sleep()
		return mockAlertRules
	},

	async getAlertHistory(): Promise<AlertHistoryResponse> {
		await sleep()
		return mockAlertHistory
	},

	async getAgents(): Promise<AgentsResponse> {
		await sleep()
		return mockAgentsResponse
	}
}
