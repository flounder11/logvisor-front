export type AgentRecord = {
	agentId: string
	name: string
	host: string
	hostIp: string
	status: string
	lastSeen: string
	bufferedCount: number
	groupId: number
	groupName: string
}

export type AgentGroupRecord = {
	id: number
	name: string
	description: string
	createdAt: string
	updatedAt: string
	agentCount: number
	agents: AgentRecord[]
}

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function normalizeNumber(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function normalizeAgentRecord(raw: unknown): AgentRecord {
	const value = (raw ?? {}) as Record<string, unknown>

	return {
		agentId: normalizeText(value.agentId),
		name: normalizeText(value.name),
		host: normalizeText(value.host),
		hostIp: normalizeText(value.hostIp),
		status: normalizeText(value.status),
		lastSeen: normalizeText(value.lastSeen),
		bufferedCount: normalizeNumber(value.bufferedCount),
		groupId: normalizeNumber(value.groupId),
		groupName: normalizeText(value.groupName)
	}
}

export function normalizeAgentGroupRecord(raw: unknown): AgentGroupRecord {
	const value = (raw ?? {}) as Record<string, unknown>
	const agents = Array.isArray(value.agents)
		? value.agents.map(agent => normalizeAgentRecord(agent))
		: []

	return {
		id: normalizeNumber(value.id),
		name: normalizeText(value.name),
		description: normalizeText(value.description),
		createdAt: normalizeText(value.createdAt),
		updatedAt: normalizeText(value.updatedAt),
		agentCount:
			typeof value.agentCount === 'number' && Number.isFinite(value.agentCount)
				? value.agentCount
				: agents.length,
		agents
	}
}
