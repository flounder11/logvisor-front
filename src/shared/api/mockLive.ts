import type { LogEvent, LogLevel } from './types'

const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR']
const hosts = ['srv-app-01', 'srv-worker-02', 'srv-db-01', 'srv-auth-01']
const services = ['api-gateway', 'worker', 'auth-service', 'backup-service']

const messagesByLevel: Record<LogLevel, string[]> = {
	INFO: [
		'Heartbeat received from agent',
		'Background job finished successfully',
		'User session refreshed'
	],
	WARN: [
		'Retrying request after upstream timeout',
		'Memory usage exceeded soft threshold',
		'Buffered log queue is growing'
	],
	ERROR: [
		'Database connection failed',
		'Unhandled exception in request pipeline',
		'WebSocket reconnect failed'
	]
}

function pick<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)]
}

export function makeMockLiveEvent(): LogEvent {
	const level = pick(levels)

	return {
		id: crypto.randomUUID(),
		timestamp: new Date().toISOString(),
		level,
		message: pick(messagesByLevel[level]),
		host: pick(hosts),
		service: pick(services),
		sourcePath: '/var/log/app/runtime.log',
		metadata: {
			env: 'prod',
			mock: true
		}
	}
}
