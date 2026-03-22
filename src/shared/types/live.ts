export type LiveLevel = 'ERROR' | 'WARN' | 'INFO'

export type SocketLogPayload = {
	timestamp: string
	level: LiveLevel
	message: string
	host: string
	service: string
	sourceType: string
	sourcePath: string
	tags: string[]
	metadata: Record<string, string>
	agentId: string
}

export type SocketLogMessage = {
	type: string
	payload: SocketLogPayload
}

export type AgentRuntimeStatus = 'online' | 'offline' | 'stale'

export type AgentStatusPayload = {
	agentId: string
	host: string
	status: string
	lastSeen: number | string
	bufferedCount: number
}

export type AgentStatusMessage = {
	type: 'agent_status'
	payload: AgentStatusPayload
}

export type LiveSocketMessage = SocketLogMessage | AgentStatusMessage

export type StreamEvent = {
	id: string
	level: LiveLevel
	time: string
	host: string
	service: string
	message: string
	status: string
	sourceType: string
	sourcePath: string
	tags: string[]
	metadata: Record<string, string>
	agentId: string
}

export type AgentStatusSnapshot = {
	agentId: string
	host: string
	status: AgentRuntimeStatus
	lastSeenLabel: string
	lastSeenTs: number | null
	bufferedCount: number
}

export type LiveConnectionState =
	| 'connecting'
	| 'connected'
	| 'disconnected'
	| 'error'

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function normalizeNumber(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function parseLastSeenTs(value: number | string): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value < 1e12 ? value * 1000 : value
	}

	if (typeof value === 'string') {
		const parsed = Date.parse(value)

		return Number.isNaN(parsed) ? null : parsed
	}

	return null
}

export function isAgentStatusMessage(
	message: LiveSocketMessage
): message is AgentStatusMessage {
	return message.type === 'agent_status'
}

export function mapAgentStatusMessage(
	message: AgentStatusMessage
): AgentStatusSnapshot {
	const lastSeenTs = parseLastSeenTs(message.payload.lastSeen)

	return {
		agentId: normalizeText(message.payload.agentId),
		host: normalizeText(message.payload.host),
		status:
			message.payload.status === 'offline'
				? 'offline'
				: message.payload.status === 'online'
					? 'online'
					: 'stale',
		lastSeenLabel:
			lastSeenTs !== null
				? new Date(lastSeenTs).toLocaleString()
				: normalizeText(message.payload.lastSeen),
		lastSeenTs,
		bufferedCount: normalizeNumber(message.payload.bufferedCount)
	}
}

export function mapSocketLogToStreamEvent(data: SocketLogMessage): StreamEvent {
	return {
		id:
			data.payload.agentId && data.payload.timestamp
				? `${data.payload.agentId}-${data.payload.timestamp}`
				: crypto.randomUUID(),
		level: data.payload.level,
		time: normalizeText(data.payload.timestamp),
		host: normalizeText(data.payload.host),
		service: normalizeText(data.payload.service),
		message: normalizeText(data.payload.message),
		status: normalizeText(data.type),
		sourceType: normalizeText(data.payload.sourceType),
		sourcePath: normalizeText(data.payload.sourcePath),
		tags: data.payload.tags ?? [],
		metadata: data.payload.metadata ?? {},
		agentId: normalizeText(data.payload.agentId)
	}
}
