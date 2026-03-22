import { API_BASE_URL } from './api-client'

type WsPayload = string | ArrayBufferLike | Blob | ArrayBufferView
type QueryValue = string | number | boolean | null | undefined

export type WsConnection = {
	url: string
	socket: WebSocket
	send: (payload: WsPayload) => void
	sendJson: (payload: unknown) => void
	close: (code?: number, reason?: string) => void
}

type WsConnectParams<TMessage> = {
	path: string
	protocols?: string | string[]
	query?: Record<string, QueryValue>
	parseMessage?: (event: MessageEvent) => TMessage
	onOpen?: (event: Event, connection: WsConnection) => void
	onMessage?: (
		message: TMessage,
		event: MessageEvent,
		connection: WsConnection
	) => void
	onMessageError?: (
		error: Error,
		event: MessageEvent,
		connection: WsConnection
	) => void
	onClose?: (event: CloseEvent, connection: WsConnection) => void
	onError?: (event: Event, connection: WsConnection) => void
}

class WsClient {
	private static instance: WsClient

	private readonly baseUrl: string = API_BASE_URL

	static getClient(): WsClient {
		if (!WsClient.instance) {
			WsClient.instance = new WsClient()
		}

		return WsClient.instance
	}

	private buildUrl(path: string, query?: Record<string, QueryValue>): string {
		if (path.startsWith('ws://') || path.startsWith('wss://')) {
			const directUrl = new URL(path)

			Object.entries(query ?? {}).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					directUrl.searchParams.set(key, String(value))
				}
			})

			return directUrl.toString()
		}

		if (!this.baseUrl) {
			throw new Error('VITE_API_BASE_URL не задан для websocket подключения.')
		}

		const normalizedBaseUrl = this.baseUrl.replace(/\/$/, '')
		const wsOrigin = normalizedBaseUrl.startsWith('https://')
			? normalizedBaseUrl.replace(/^https:\/\//, 'wss://')
			: normalizedBaseUrl.startsWith('http://')
				? normalizedBaseUrl.replace(/^http:\/\//, 'ws://')
				: null

		if (!wsOrigin) {
			throw new Error('Не удалось собрать websocket URL из VITE_API_BASE_URL.')
		}

		const normalizedPath = path.startsWith('/')
			? path
			: `/api/v1/${path.replace(/^\/+/, '')}`

		const socketUrl = new URL(`${wsOrigin}${normalizedPath}`)

		Object.entries(query ?? {}).forEach(([key, value]) => {
			if (value !== null && value !== undefined) {
				socketUrl.searchParams.set(key, String(value))
			}
		})

		return socketUrl.toString()
	}

	private parseDefaultMessage<TMessage>(event: MessageEvent): TMessage {
		if (typeof event.data !== 'string') {
			return event.data as TMessage
		}

		return JSON.parse(event.data) as TMessage
	}

	connect<TMessage>({
		path,
		protocols,
		query,
		parseMessage,
		onOpen,
		onMessage,
		onMessageError,
		onClose,
		onError
	}: WsConnectParams<TMessage>): WsConnection {
		const url = this.buildUrl(path, query)
		const socket = new WebSocket(url, protocols)

		const connection: WsConnection = {
			url,
			socket,
			send: payload => {
				socket.send(payload)
			},
			sendJson: payload => {
				socket.send(JSON.stringify(payload))
			},
			close: (code, reason) => {
				socket.close(code, reason)
			}
		}

		socket.onopen = event => {
			onOpen?.(event, connection)
		}

		socket.onmessage = event => {
			if (!onMessage) {
				return
			}

			try {
				const parsedMessage = parseMessage
					? parseMessage(event)
					: this.parseDefaultMessage<TMessage>(event)

				onMessage(parsedMessage, event, connection)
			} catch (error) {
				const messageError =
					error instanceof Error
						? error
						: new Error(
								`Не удалось обработать websocket сообщение: ${String(error)}`
							)

				onMessageError?.(messageError, event, connection)
			}
		}

		socket.onerror = event => {
			onError?.(event, connection)
		}

		socket.onclose = event => {
			onClose?.(event, connection)
		}

		return connection
	}
}

export const wsClient = WsClient.getClient()
