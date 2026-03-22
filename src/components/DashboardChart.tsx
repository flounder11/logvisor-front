import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SummaryDataType } from './ListSummary'

type HostRow = {
	host: string
	count: number
}

type ServiceRow = {
	service: string
	count: number
}

type AlertLevel = 'ERROR' | 'WARN' | 'INFO'

type AlertRow = {
	id: number
	query: string
	name: string
	level: AlertLevel
	createdAt: string
}

type DashboardChartProps = {
	summary: SummaryDataType | null
	topHosts: HostRow[]
	topServices: ServiceRow[]
	alerts: AlertRow[]
}

function percentage(value: number, total: number) {
	if (total <= 0) {
		return 0
	}

	return Math.round((value / total) * 100)
}

export default function DashboardChart({
	summary,
	topHosts,
	topServices,
	alerts
}: DashboardChartProps) {
	const hostMax = Math.max(...topHosts.map(item => item.count), 1)
	const serviceMax = Math.max(...topServices.map(item => item.count), 1)
	const totalLogs = summary?.totalLogs ?? 0
	const errors = summary?.errors ?? 0
	const warnings = summary?.warnings ?? 0
	const infos = Math.max(totalLogs - errors - warnings, 0)
	const errorRules = alerts.filter(alert => alert.level === 'ERROR').length
	const warnRules = alerts.filter(alert => alert.level === 'WARN').length

	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm xl:col-span-2">
			<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<CardTitle>Server Metrics Snapshot</CardTitle>
				</div>
				<div className="flex flex-wrap gap-2 text-xs">
					<span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-red-700 ring-1 ring-red-500/20">
						<span className="size-2 rounded-full bg-red-500" />
						Errors {errors}
					</span>
					<span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-700 ring-1 ring-amber-500/20">
						<span className="size-2 rounded-full bg-amber-500" />
						Warnings {warnings}
					</span>
					<span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-sky-700 ring-1 ring-sky-500/20">
						<span className="size-2 rounded-full bg-sky-500" />
						Info {infos}
					</span>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
					<div className="rounded-3xl border border-border/60 bg-muted/35 p-5">
						<div className="mb-4 flex items-center justify-between gap-3">
							<div>
								<p className="text-sm font-medium text-foreground">
									Top hosts load
								</p>
								<p className="text-xs text-muted-foreground">
									Нагрузка по хостам из `dashboard/top-hosts`
								</p>
							</div>
							<p className="text-xs text-muted-foreground">
								max {hostMax} events
							</p>
						</div>

						<div className="grid h-[260px] grid-cols-1 gap-3">
							{topHosts.slice(0, 6).map(item => (
								<div
									key={item.host}
									className="grid grid-cols-[110px_minmax(0,1fr)_48px] items-center gap-3"
								>
									<p className="truncate text-xs text-muted-foreground">
										{item.host}
									</p>
									<div className="h-3 rounded-full bg-background">
										<div
											className="h-3 rounded-full bg-[var(--color-chart-2)]"
											style={{
												width: `${Math.max((item.count / hostMax) * 100, 10)}%`
											}}
										/>
									</div>
									<p className="text-right text-xs font-medium text-foreground">
										{item.count}
									</p>
								</div>
							))}
						</div>
					</div>

					<div className="grid gap-4">
						<div className="rounded-3xl border border-border/60 bg-background/80 p-5">
							<p className="text-sm font-medium text-foreground">Log mix</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Распределение событий из `dashboard/summary`
							</p>
							<div className="mt-4 h-4 overflow-hidden rounded-full bg-muted">
								<div className="flex h-full w-full">
									<div
										className="bg-red-500"
										style={{ width: `${percentage(errors, totalLogs)}%` }}
									/>
									<div
										className="bg-amber-500"
										style={{ width: `${percentage(warnings, totalLogs)}%` }}
									/>
									<div
										className="bg-sky-500"
										style={{ width: `${percentage(infos, totalLogs)}%` }}
									/>
								</div>
							</div>
							<div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
								<div>Error share: {percentage(errors, totalLogs)}%</div>
								<div>Warning share: {percentage(warnings, totalLogs)}%</div>
								<div>Info share: {percentage(infos, totalLogs)}%</div>
							</div>
						</div>

						<div className="rounded-3xl border border-border/60 bg-background/80 p-5">
							<p className="text-sm font-medium text-foreground">
								Top services trend
							</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Сервисы из `dashboard/top-services`
							</p>
							<div className="mt-4 flex h-[110px] items-end gap-3">
								{topServices.slice(0, 5).map(item => (
									<div
										key={item.service}
										className="flex min-w-0 flex-1 flex-col items-center gap-2"
									>
										<div className="flex h-full w-full items-end">
											<div
												className="w-full rounded-t-2xl bg-[var(--color-chart-1)]"
												style={{
													height: `${Math.max((item.count / serviceMax) * 100, 12)}%`
												}}
											/>
										</div>
										<p className="truncate text-center text-[11px] text-muted-foreground">
											{item.service}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Total logs
						</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">
							{totalLogs}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							Сводное число событий, полученных в summary.
						</p>
					</div>

					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Alert rules
						</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">
							{alerts.length}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							Error rules: {errorRules}, warning rules: {warnRules}.
						</p>
					</div>

					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Topology
						</p>
						<p className="mt-2 text-2xl font-semibold text-foreground">
							{summary?.hosts ?? 0} / {summary?.services ?? 0}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							Hosts и services, которые сейчас участвуют в сводке dashboard.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
