import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
	Activity,
	Clock3,
	Filter,
	Pause,
	Play,
	Radio,
	RefreshCw,
	Search,
	Server,
	Wifi
} from 'lucide-react'

type LiveLevel = 'ERROR' | 'WARN' | 'INFO'

const levelTone: Record<LiveLevel, string> = {
	ERROR: 'bg-red-500/12 text-red-700 ring-red-500/20',
	WARN: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
	INFO: 'bg-sky-500/12 text-sky-700 ring-sky-500/20'
}

const streamEvents = [
	{
		id: 'live-1',
		level: 'ERROR' as LiveLevel,
		time: '09:31:22',
		host: 'srv-app-01',
		service: 'api-gateway',
		message: 'Upstream request failed while streaming response to client',
		status: 'Newest event'
	},
	{
		id: 'live-2',
		level: 'WARN' as LiveLevel,
		time: '09:31:18',
		host: 'srv-worker-02',
		service: 'worker',
		message: 'Job retry counter increased after transient queue timeout',
		status: 'Buffered'
	},
	{
		id: 'live-3',
		level: 'INFO' as LiveLevel,
		time: '09:31:12',
		host: 'srv-auth-01',
		service: 'auth-service',
		message: 'Websocket client authenticated and subscribed to live stream',
		status: 'Normal'
	},
	{
		id: 'live-4',
		level: 'ERROR' as LiveLevel,
		time: '09:31:06',
		host: 'srv-db-01',
		service: 'postgres',
		message: 'Replication lag exceeded threshold during background vacuum',
		status: 'Investigate'
	},
	{
		id: 'live-5',
		level: 'WARN' as LiveLevel,
		time: '09:30:58',
		host: 'srv-cache-01',
		service: 'redis',
		message: 'Memory pressure rising while eviction policy is active',
		status: 'Watch'
	},
	{
		id: 'live-6',
		level: 'INFO' as LiveLevel,
		time: '09:30:51',
		host: 'srv-nginx-01',
		service: 'edge-proxy',
		message: 'Live tail stream delivered 150 events in the current minute',
		status: 'Stream ok'
	}
]

const connectionStats = [
	{
		title: 'Socket status',
		value: 'Connected',
		description: 'Сюда можно потом прокинуть реальный connection state.'
	},
	{
		title: 'Endpoint',
		value: '/api/v1/live/ws',
		description: 'WebSocket endpoint для realtime событий.'
	},
	{
		title: 'Throughput',
		value: '150 evt/min',
		description: 'Текущая скорость входящего потока.'
	}
]

const detailRows = [
	{ label: 'Timestamp', value: '2026-03-21 09:31:22 UTC' },
	{ label: 'Host', value: 'srv-app-01' },
	{ label: 'Service', value: 'api-gateway' },
	{ label: 'Stream mode', value: 'live / auto-scroll' },
	{ label: 'Socket state', value: 'connected' },
	{ label: 'Trace ID', value: 'trace-live-4a91dc' }
]

const quickNotes = [
	'Поток можно ограничить client-side filters по host, service и level.',
	'Правая панель хорошо подходит под детали выбранного live event.',
	'Кнопки pause/resume потом можно связать с store или ws-client hook.'
]

export default function LiveTailPage() {
	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs font-medium text-red-700">
								<Radio className="size-3.5" />
								LIVE socket stream
							</div>
							<div className="space-y-3">
								<h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
									Realtime поток логов для live troubleshooting
								</h1>
								<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
									UI под WebSocket stream: заметный live-status, control bar,
									лента событий и правая панель под состояние соединения и
									детали выбранного события.
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									Connection
								</p>
								<p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-foreground">
									<span className="size-2.5 rounded-full bg-emerald-500" />
									LIVE
								</p>
								<p className="mt-1 text-sm leading-6 text-muted-foreground">
									Соединение активно, поток событий открыт.
								</p>
							</div>

							<div className="rounded-2xl border border-border/60 bg-slate-950 p-4 text-slate-50 shadow-sm">
								<p className="text-xs uppercase tracking-[0.18em] text-slate-300">
									Mode
								</p>
								<p className="mt-3 text-2xl font-semibold">WS / auto-scroll</p>
								<p className="mt-1 text-sm leading-6 text-slate-300">
									Каркас под `pause/resume`, reconnect и stream buffering.
								</p>
							</div>
						</div>
					</div>
				</div>

				<Card className="border border-border/60 bg-card/95 shadow-sm">
					<CardHeader className="gap-5">
						<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="space-y-1">
								<CardTitle className="text-xl">Live controls</CardTitle>
								<CardDescription>
									Панель управления для client-side filters и состояния live
									подключения.
								</CardDescription>
							</div>
							<div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
								<Filter className="size-3.5" />
								Static websocket controls
							</div>
						</div>

						<div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.7fr))_auto_auto]">
							<Field>
								<Input
									className="h-11 bg-background/80"
									placeholder="Filter stream by message, trace id or service..."
								/>
							</Field>

							<Field>
								<Select defaultValue="all-hosts">
									<SelectTrigger className="h-11 w-full bg-background/80">
										<SelectValue placeholder="Host" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectGroup>
											<SelectItem value="all-hosts">All hosts</SelectItem>
											<SelectItem value="srv-app-01">srv-app-01</SelectItem>
											<SelectItem value="srv-worker-02">
												srv-worker-02
											</SelectItem>
											<SelectItem value="srv-db-01">srv-db-01</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>

							<Field>
								<Select defaultValue="all-levels">
									<SelectTrigger className="h-11 w-full bg-background/80">
										<SelectValue placeholder="Level" />
									</SelectTrigger>
									<SelectContent position="popper">
										<SelectGroup>
											<SelectItem value="all-levels">All levels</SelectItem>
											<SelectItem value="error">ERROR</SelectItem>
											<SelectItem value="warn">WARN</SelectItem>
											<SelectItem value="info">INFO</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>

							<div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
								<Switch
									defaultChecked
									aria-label="Auto scroll"
								/>
								<div className="space-y-0.5">
									<p className="text-sm font-medium text-foreground">
										Auto-scroll
									</p>
									<p className="text-xs text-muted-foreground">
										Следить за новым событием
									</p>
								</div>
							</div>

							<div className="flex flex-wrap gap-3">
								<Button size="lg">
									<Pause className="size-4" />
									Pause
								</Button>
								<Button
									size="lg"
									variant="outline"
								>
									<Play className="size-4" />
									Resume
								</Button>
							</div>
						</div>
					</CardHeader>
				</Card>

				<div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
					<Card className="min-h-[680px] border border-border/60 bg-card/95 shadow-sm">
						<CardHeader className="gap-4 border-b border-border/60 pb-5">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="space-y-1">
									<CardTitle className="text-xl">Live stream</CardTitle>
									<CardDescription>
										Основная лента входящих событий из socket stream. Сюда потом
										можно подключить append новых записей и max rows guard.
									</CardDescription>
								</div>
								<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
									6 events buffered
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-3 pt-5">
							{streamEvents.map((event, index) => (
								<div
									key={event.id}
									className={`rounded-2xl border p-4 transition-colors ${
										index === 0
											? 'border-foreground/15 bg-muted/55 shadow-sm'
											: 'border-border/60 bg-background/75'
									}`}
								>
									<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
										<div className="space-y-3">
											<div className="flex flex-wrap items-center gap-2">
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${levelTone[event.level]}`}
												>
													{event.level}
												</span>
												<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
													<Clock3 className="size-3.5" />
													{event.time}
												</span>
												<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
													<Server className="size-3.5" />
													{event.host}
												</span>
												<span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
													{event.service}
												</span>
											</div>

											<div className="space-y-2">
												<p className="text-sm font-semibold text-foreground sm:text-base">
													{event.message}
												</p>
												<p className="text-sm leading-6 text-muted-foreground">
													Потоковая строка лога с минимальным контекстом. Хорошо
													подходит под realtime append без тяжёлой табличной
													разметки.
												</p>
											</div>
										</div>

										<div className="flex shrink-0 items-center gap-2">
											<span className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground">
												{event.status}
											</span>
										</div>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<div className="space-y-5">
						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<CardTitle className="text-xl">Connection state</CardTitle>
										<CardDescription>
											Правая панель под socket health, endpoint и stream stats.
										</CardDescription>
									</div>
									<div className="rounded-2xl bg-emerald-500/12 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/20">
										Connected
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-3 pt-5">
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
									>
										<RefreshCw className="size-4" />
										Reconnect socket
									</Button>
									<Button
										size="lg"
										variant="secondary"
										className="justify-start"
									>
										<Search className="size-4" />
										Open in search
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader className="gap-4 border-b border-border/60 pb-5">
								<div className="space-y-1">
									<CardTitle className="text-xl">Selected event</CardTitle>
									<CardDescription>
										Блок под детали последней или вручную выбранной записи.
									</CardDescription>
								</div>
							</CardHeader>

							<CardContent className="space-y-5 pt-5">
								<div className="rounded-3xl border border-border/60 bg-background/80 p-5">
									<div className="flex flex-wrap items-center gap-2">
										<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/20">
											<Wifi className="size-3.5" />
											Socket healthy
										</span>
										<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
											<Activity className="size-3.5" />
											api-gateway
										</span>
									</div>

									<div className="mt-4 space-y-3">
										<h3 className="text-lg font-semibold text-foreground">
											Upstream request failed while streaming response to client
										</h3>
										<p className="text-sm leading-6 text-muted-foreground">
											Этот блок можно использовать как summary выбранного live
											event: краткий диагноз, причина всплеска и связь с
											инцидентом.
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

								<div className="rounded-3xl border border-border/60 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
									2026-03-21T09:31:22Z level=ERROR host=srv-app-01
									service=api-gateway event=log_event socket=connected
									message="Upstream request failed while streaming response to
									client"
								</div>
							</CardContent>
						</Card>

						<Card className="border border-border/60 bg-card/95 shadow-sm">
							<CardHeader>
								<CardTitle>Implementation notes</CardTitle>
								<CardDescription>
									Небольшой блок под live UX правила и websocket behaviour.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								{quickNotes.map(note => (
									<div
										key={note}
										className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm leading-6 text-muted-foreground"
									>
										{note}
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	)
}
