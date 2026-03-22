import LiveControl from '@/components/LiveControl'
import LiveList from '@/components/LiveList'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { wsClient, type WsConnection } from '@/shared/api/ws-client'
import {
	isAgentStatusMessage,
	mapAgentStatusMessage,
	mapSocketLogToStreamEvent,
	type AgentRuntimeStatus,
	type AgentStatusSnapshot,
	type LiveConnectionState,
	type LiveLevel,
	type LiveSocketMessage,
	type StreamEvent
} from '@/shared/types/live'
import { Activity, Radio, RefreshCw, Search, Wifi } from 'lucide-react'
import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LIVE_ENDPOINT = 'live/ws'
const MAX_VISIBLE_EVENTS = 150
const AGENT_STALE_AFTER_MS = 30000

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function prependEvent(events: StreamEvent[], nextEvent: StreamEvent) {
	return [nextEvent, ...events].slice(0, MAX_VISIBLE_EVENTS)
}

function formatMetadataValue(metadata: Record<string, string>) {
	const entries = Object.entries(metadata)

	if (entries.length === 0) {
		return 'none'
	}

	return entries.map(([key, value]) => `${key}=${value}`).join(', ')
}

function getConnectionBadgeClass(connectionState: LiveConnectionState) {
	if (connectionState === 'connected') {
		return 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/20'
	}

	if (connectionState === 'connecting') {
		return 'bg-amber-500/12 text-amber-700 ring-amber-500/20'
	}

	return 'bg-red-500/12 text-red-700 ring-red-500/20'
}

function getConnectionDotClass(connectionState: LiveConnectionState) {
	if (connectionState === 'connected') {
		return 'bg-emerald-500'
	}

	if (connectionState === 'connecting') {
		return 'bg-amber-500'
	}

	return 'bg-red-500'
}

export default function LiveTailPage() {
	const navigate = useNavigate()

	const [events, setEvents] = useState<StreamEvent[]>([])
	const [bufferedEvents, setBufferedEvents] = useState<StreamEvent[]>([])
	const [agentSnapshots, setAgentSnapshots] = useState<
		Record<string, AgentStatusSnapshot>
	>({})
	const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [selectedHost, setSelectedHost] = useState('all-hosts')
	const [selectedLevel, setSelectedLevel] = useState('all-levels')
	const [autoScroll, setAutoScroll] = useState(true)
	const [isPaused, setIsPaused] = useState(false)
	const [connectionState, setConnectionState] =
		useState<LiveConnectionState>('connecting')
	const [error, setError] = useState<string | null>(null)
	const [clock, setClock] = useState(() => Date.now())

	const connectionRef = useRef<WsConnection | null>(null)
	const connectionAttemptRef = useRef(0)
	const pausedRef = useRef(isPaused)
	const autoScrollRef = useRef(autoScroll)
	const manualSelectionRef = useRef(false)
	const bufferedEventsRef = useRef<StreamEvent[]>([])
	const seenIdsRef = useRef<Set<string>>(new Set())

	useEffect(() => {
		pausedRef.current = isPaused
	}, [isPaused])

	useEffect(() => {
		autoScrollRef.current = autoScroll
	}, [autoScroll])

	useEffect(() => {
		bufferedEventsRef.current = bufferedEvents
	}, [bufferedEvents])

	useEffect(() => {
		const timer = window.setInterval(() => {
			setClock(Date.now())
		}, 5000)

		return () => {
			window.clearInterval(timer)
		}
	}, [])

	const hostOptions = useMemo(
		() => [...new Set(events.map(event => event.host))].sort(),
		[events]
	)

	const levelOptions = useMemo<LiveLevel[]>(() => ['ERROR', 'WARN', 'INFO'], [])

	const trackedAgents = useMemo(() => {
		return Object.values(agentSnapshots)
			.map(agent => {
				const isStale =
					agent.status !== 'offline' &&
					agent.lastSeenTs !== null &&
					clock - agent.lastSeenTs > AGENT_STALE_AFTER_MS

				return {
					...agent,
					status: isStale ? ('stale' as AgentRuntimeStatus) : agent.status
				}
			})
			.sort((left, right) => {
				const priority: Record<AgentRuntimeStatus, number> = {
					offline: 0,
					stale: 1,
					online: 2
				}

				return (
					priority[left.status] - priority[right.status] ||
					left.host.localeCompare(right.host) ||
					left.agentId.localeCompare(right.agentId)
				)
			})
	}, [agentSnapshots, clock])

	const onlineAgentsCount = trackedAgents.filter(
		agent => agent.status === 'online'
	).length
	const degradedAgentsCount = trackedAgents.filter(
		agent => agent.status !== 'online'
	).length

	const filteredEvents = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase()

		return events.filter(event => {
			const message = normalizeText(event.message).toLowerCase()
			const host = normalizeText(event.host).toLowerCase()
			const service = normalizeText(event.service).toLowerCase()
			const agentId = normalizeText(event.agentId).toLowerCase()

			const matchesQuery =
				normalizedQuery.length === 0 ||
				message.includes(normalizedQuery) ||
				host.includes(normalizedQuery) ||
				service.includes(normalizedQuery) ||
				agentId.includes(normalizedQuery)

			const matchesHost =
				selectedHost === 'all-hosts' ||
				normalizeText(event.host) === selectedHost

			const matchesLevel =
				selectedLevel === 'all-levels' || event.level === selectedLevel

			return matchesQuery && matchesHost && matchesLevel
		})
	}, [events, query, selectedHost, selectedLevel])

	const selectedEvent = useMemo(() => {
		if (selectedEventId) {
			const foundSelectedEvent = events.find(
				event => event.id === selectedEventId
			)

			if (foundSelectedEvent) {
				return foundSelectedEvent
			}
		}

		return filteredEvents[0] ?? events[0] ?? null
	}, [events, filteredEvents, selectedEventId])

	useEffect(() => {
		if (!selectedEvent && selectedEventId) {
			setSelectedEventId(null)
			manualSelectionRef.current = false
		}
	}, [selectedEvent, selectedEventId])

	const flushBufferedEvents = () => {
		const pendingEvents = bufferedEventsRef.current

		if (pendingEvents.length === 0) {
			return
		}

		startTransition(() => {
			setEvents(currentEvents =>
				[...pendingEvents, ...currentEvents].slice(0, MAX_VISIBLE_EVENTS)
			)
			setBufferedEvents([])

			if (autoScrollRef.current || !manualSelectionRef.current) {
				setSelectedEventId(pendingEvents[0]?.id ?? null)
			}
		})
	}

	const connectLiveStream = () => {
		const currentAttempt = connectionAttemptRef.current + 1
		connectionAttemptRef.current = currentAttempt

		connectionRef.current?.close(1000, 'Reconnect requested')
		connectionRef.current = null

		setConnectionState('connecting')
		setError(null)

		try {
			const connection = wsClient.connect<LiveSocketMessage>({
				path: LIVE_ENDPOINT,
				onOpen: () => {
					if (connectionAttemptRef.current !== currentAttempt) {
						return
					}

					setConnectionState('connected')
					setError(null)
				},
				onMessage: message => {
					if (connectionAttemptRef.current !== currentAttempt) {
						return
					}

					if (isAgentStatusMessage(message)) {
						const mappedAgentStatus = mapAgentStatusMessage(message)
						const agentKey = mappedAgentStatus.agentId || mappedAgentStatus.host

						if (!agentKey) {
							return
						}

						setAgentSnapshots(currentAgents => ({
							...currentAgents,
							[agentKey]: mappedAgentStatus
						}))
						return
					}

					const mappedEvent = mapSocketLogToStreamEvent(message)

					if (seenIdsRef.current.has(mappedEvent.id)) {
						return
					}

					seenIdsRef.current.add(mappedEvent.id)

					startTransition(() => {
						if (pausedRef.current) {
							setBufferedEvents(currentEvents =>
								prependEvent(currentEvents, mappedEvent)
							)
							return
						}

						setEvents(currentEvents => prependEvent(currentEvents, mappedEvent))

						if (autoScrollRef.current || !manualSelectionRef.current) {
							setSelectedEventId(mappedEvent.id)
						}
					})
				},
				onMessageError: messageError => {
					if (connectionAttemptRef.current !== currentAttempt) {
						return
					}

					setError(messageError.message)
				},
				onError: () => {
					if (connectionAttemptRef.current !== currentAttempt) {
						return
					}

					setConnectionState('error')
					setError('WebSocket соединение отклонено или оборвалось.')
				},
				onClose: event => {
					if (connectionAttemptRef.current !== currentAttempt) {
						return
					}

					if (event.code !== 1000) {
						setConnectionState('error')
						setError(
							event.reason || 'Сервер закрыл websocket-соединение неожиданно.'
						)
						return
					}

					setConnectionState('disconnected')
				}
			})

			connectionRef.current = connection
		} catch (connectionError) {
			setConnectionState('error')
			setError(
				connectionError instanceof Error
					? connectionError.message
					: 'Не удалось открыть websocket соединение.'
			)
		}
	}

	useEffect(() => {
		connectLiveStream()

		return () => {
			connectionAttemptRef.current += 1
			connectionRef.current?.close(1000, 'Live page unmounted')
			connectionRef.current = null
		}
	}, [])

	const handlePause = () => {
		setIsPaused(true)
	}

	const handleResume = () => {
		setIsPaused(false)
		flushBufferedEvents()
	}

	const handleSelectEvent = (event: StreamEvent) => {
		manualSelectionRef.current = true
		setAutoScroll(false)
		setSelectedEventId(event.id)
	}

	const handleReconnect = () => {
		connectLiveStream()
	}

	const connectionBadgeClass = getConnectionBadgeClass(connectionState)
	const connectionDotClass = getConnectionDotClass(connectionState)

	const connectionStats = [
		{
			title: 'Socket status',
			value: connectionState,
			description: 'Текущее состояние websocket-соединения.'
		},
		{
			title: 'Endpoint',
			value: `/api/v1/${LIVE_ENDPOINT}`,
			description:
				'Backend endpoint, который отвечает `101 Switching Protocols`.'
		},
		{
			title: 'Events',
			value: `${events.length + bufferedEvents.length}`,
			description:
				'Сколько уникальных сообщений уже пришло в текущую live-сессию.'
		},
		{
			title: 'Agents online',
			value: `${onlineAgentsCount}/${trackedAgents.length || 0}`
		}
	]

	const detailRows = [
		{ label: 'Timestamp', value: selectedEvent?.time ?? 'waiting for event' },
		{ label: 'Host', value: selectedEvent?.host ?? 'waiting for event' },
		{ label: 'Service', value: selectedEvent?.service ?? 'waiting for event' },
		{ label: 'Source type', value: selectedEvent?.sourceType ?? 'waiting' },
		{ label: 'Source path', value: selectedEvent?.sourcePath ?? 'waiting' },
		{ label: 'Agent ID', value: selectedEvent?.agentId ?? 'waiting' }
	]

	const overallAgentHealthTone =
		degradedAgentsCount === 0 ? 'text-emerald-700' : 'text-red-700'

	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs font-medium text-red-700">
								<Radio className="size-3.5" />
								LIVE websocket stream
							</div>
							<div className="space-y-3">
								<h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
									Realtime поток
								</h1>
								<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
									Страница подключается фильтрует события и показывает детали
									выбранной записи.
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Connection
								</p>
								<p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
									<span
										className={`size-2.5 rounded-full ${connectionDotClass}`}
									/>
									{connectionState.toUpperCase()}
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									{connectionState === 'connected'
										? 'Соединение активно, новые события приходят сразу в ленту.'
										: 'Если handshake не проходит, ошибка появится в правой панели.'}
								</p>
							</div>

							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 text-slate-50 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Agents
								</p>
								<p
									className={`mt-3 text-2xl font-semibold ${overallAgentHealthTone}`}
								>
									{onlineAgentsCount}/{trackedAgents.length || 0}
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									Количество агентов, которые сейчас онлайн. Отвалившиеся и
									устаревшие статусы будут подсвечены справа.
								</p>
							</div>
						</div>
					</div>
				</div>

				<LiveControl
					query={query}
					onQueryChange={setQuery}
					selectedHost={selectedHost}
					onHostChange={setSelectedHost}
					selectedLevel={selectedLevel}
					onLevelChange={setSelectedLevel}
					hostOptions={hostOptions}
					levelOptions={levelOptions}
					autoScroll={autoScroll}
					onAutoScrollChange={checked => {
						setAutoScroll(checked)

						if (checked) {
							manualSelectionRef.current = false
							setSelectedEventId(filteredEvents[0]?.id ?? events[0]?.id ?? null)
						}
					}}
					isPaused={isPaused}
					onPause={handlePause}
					onResume={handleResume}
					connectionState={connectionState}
				/>

				<div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
					<LiveList
						liveData={filteredEvents}
						selectedEventId={selectedEvent?.id ?? null}
						onSelectEvent={handleSelectEvent}
						bufferedCount={bufferedEvents.length}
					/>

					<div className="space-y-5">
						<Card className="flex h-[420px] min-h-0 flex-col border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">Connection state</CardTitle>
										<CardDescription>
											Правая панель под socket health, endpoint и stream stats.
										</CardDescription>
									</div>
									<div
										className={`rounded-2xl px-3 py-2 text-xs font-medium ring-1 ${connectionBadgeClass}`}
									>
										{connectionState}
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-3 pt-5">
								{error ? (
									<div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-700">
										{error}
									</div>
								) : null}

								{connectionStats.map(item => (
									<div
										key={item.title}
										className="rounded-2xl border border-border/60 bg-background/80 p-4"
									>
										<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
											{item.title}
										</p>
										<p className="mt-2 text-lg font-semibold text-foreground">
											{item.value}
										</p>
										<p className="mt-1 text-sm leading-6 text-muted-foreground">
											{item.description}
										</p>
									</div>
								))}

								<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
									<Button
										size="lg"
										variant="outline"
										className="justify-start"
										onClick={handleReconnect}
									>
										<RefreshCw className="size-4" />
										Reconnect socket
									</Button>
									<Button
										size="lg"
										variant="secondary"
										className="justify-start"
										onClick={() => navigate('/search')}
									>
										<Search className="size-4" />
										Open in search
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">Agents status</CardTitle>
										<CardDescription>
											Табло подключённых серверов и агентов.
										</CardDescription>
									</div>
									<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
										{trackedAgents.length} tracked
									</div>
								</div>
							</CardHeader>

							<CardContent className="flex-1 space-y-3 overflow-y-auto pt-5 pr-2">
								{trackedAgents.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
										Ожидаем первые `agent_status` сообщения от backend.
									</div>
								) : null}

								{trackedAgents.map(agent => {
									const statusTone =
										agent.status === 'online'
											? 'bg-emerald-500/12 text-emerald-700 ring-emerald-500/20'
											: agent.status === 'stale'
												? 'bg-amber-500/12 text-amber-700 ring-amber-500/20'
												: 'bg-red-500/12 text-red-700 ring-red-500/20'

									return (
										<div
											key={`${agent.agentId}-${agent.host}`}
											className="rounded-2xl border border-border/60 bg-background/80 p-4"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="space-y-1">
													<p className="text-sm font-semibold text-foreground">
														{agent.host || 'unknown host'}
													</p>
													<p className="text-xs text-muted-foreground">
														{agent.agentId || 'unknown agent'}
													</p>
												</div>
												<span
													className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusTone}`}
												>
													{agent.status}
												</span>
											</div>
											<div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
												<div>Last seen: {agent.lastSeenLabel || 'unknown'}</div>
												<div>Buffered: {agent.bufferedCount}</div>
											</div>
										</div>
									)
								})}
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="space-y-1">
									<CardTitle className="text-xl">Selected event</CardTitle>
									<CardDescription>
										Последнее событие или вручную выбранная запись из
										live-ленты.
									</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="space-y-5 pt-5">
								<div className="rounded-3xl border border-border/60 bg-background/80 p-5">
									<div className="flex flex-wrap items-center gap-2">
										<span
											className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${connectionBadgeClass}`}
										>
											<Wifi className="size-3.5" />
											{connectionState}
										</span>
										<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
											<Activity className="size-3.5" />
											{selectedEvent?.service ?? 'waiting for event'}
										</span>
									</div>

									<div className="mt-4 space-y-3">
										<h3 className="text-lg font-semibold text-foreground">
											{selectedEvent?.message ??
												'Ожидаем первое сообщение из websocket'}
										</h3>
										<p className="text-sm leading-6 text-muted-foreground">
											{selectedEvent
												? 'Справа показаны детали последнего принятого websocket-события.'
												: 'Как только backend отправит первое сообщение, здесь появится его краткая сводка.'}
										</p>
									</div>
								</div>

								<div className="grid gap-3">
									{detailRows.map(row => (
										<div
											key={row.label}
											className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
										>
											<span className="text-sm text-muted-foreground">
												{row.label}
											</span>
											<span className="text-right text-sm font-medium text-foreground">
												{row.value}
											</span>
										</div>
									))}
								</div>

								<div className="space-y-3">
									<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
										Context tags
									</p>
									<div className="flex flex-wrap gap-2">
										{(selectedEvent?.tags.length ?? 0) > 0 ? (
											selectedEvent?.tags.map(tag => (
												<span
													key={tag}
													className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground"
												>
													{tag}
												</span>
											))
										) : (
											<span className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
												no tags
											</span>
										)}
									</div>
								</div>

								<div className="space-y-3">
									<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
										Metadata
									</p>
									<div className="rounded-3xl border border-border/60 bg-background/80 p-4 text-sm leading-6 text-muted-foreground">
										{selectedEvent
											? formatMetadataValue(selectedEvent.metadata)
											: 'metadata will appear after the first event'}
									</div>
								</div>

								<div className="rounded-3xl border border-border/60 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
									{selectedEvent
										? `${selectedEvent.time} level=${selectedEvent.level} host=${selectedEvent.host} service=${selectedEvent.service} source=${selectedEvent.sourceType} path=${selectedEvent.sourcePath} agent=${selectedEvent.agentId} event=${selectedEvent.status} transport=websocket message="${selectedEvent.message}"`
										: `transport=websocket endpoint=/api/v1/${LIVE_ENDPOINT} status="waiting for first event"`}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	)
}
