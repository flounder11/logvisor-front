import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { apiClient } from '@/shared/api/api-client'
import { useEffect, useState } from 'react'

// const alertRows = [
// 	{
// 		id: 'alert-1',
// 		level: 'ERROR' as AlertLevel,
// 		title: 'Alert title',
// 		description: 'Описание последнего срабатывания или текст события.'
// 	},
// 	{
// 		id: 'alert-2',
// 		level: 'WARN' as AlertLevel,
// 		title: 'Alert title',
// 		description: 'Здесь можно показать краткую историю trigger-ов.'
// 	},
// 	{
// 		id: 'alert-3',
// 		level: 'INFO' as AlertLevel,
// 		title: 'Alert title',
// 		description: 'Блок подходит под список recent alerts или incident feed.'
// 	}
// ]

const levelTone: Record<AlertLevel, string> = {
	ERROR: 'bg-red-500/12 text-red-700 ring-red-500/20',
	WARN: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
	INFO: 'bg-sky-500/12 text-sky-700 ring-sky-500/20'
}

type AlertLevel = 'ERROR' | 'WARN' | 'INFO'

type AlertResponse = {
	id: number
	query: string
	name: string
	level: AlertLevel
	createdAt: string
}

type RecentAlertsProps = {
	data?: AlertResponse[]
}

function formatAlertDate(value: string) {
	if (!value) {
		return 'unknown'
	}

	const parsed = Date.parse(value)

	if (Number.isNaN(parsed)) {
		return value
	}

	return new Date(parsed).toLocaleString()
}

export default function RecentAlerts({ data }: RecentAlertsProps) {
	const [alerts, setAlerts] = useState<AlertResponse[]>(data ?? [])
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (data) {
			setAlerts(data)
			return
		}

		const fetchAlertsHistory = async () => {
			try {
				setLoader(true)
				setError(null)
				const data = await apiClient.request<AlertResponse[]>({
					method: 'GET',
					path: 'alerts/rules'
				})
				setAlerts(data)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		fetchAlertsHistory()
	}, [data])

	const errorAlerts = alerts.filter(alert => alert.level === 'ERROR').length
	const warningAlerts = alerts.filter(alert => alert.level === 'WARN').length
	const latestAlert = alerts[0] ?? null

	if (loader) return <div>загрузка</div>
	if (error) return <div>ошибка</div>
	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<CardTitle>Recent alerts</CardTitle>
					<CardDescription>
						История алертов, инцидентов или последних событий.
					</CardDescription>
				</div>
				<div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
					{alerts.length} rules loaded
				</div>
			</CardHeader>

			<CardContent className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
				<div className="space-y-4">
					{alerts.map(alert => (
						<div
							key={alert.id}
							className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4"
						>
							<div className="space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${levelTone[alert.level]}`}
									>
										{alert.level}
									</span>
									<p className="text-sm font-semibold text-foreground">
										{alert.query}
									</p>
								</div>
								<p className="text-sm leading-6 text-muted-foreground">
									{alert.name}
								</p>
							</div>
							<p className="shrink-0 text-xs text-muted-foreground">
								{formatAlertDate(alert.createdAt)}
							</p>
						</div>
					))}
				</div>

				<div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Error rules
						</p>
						<p className="mt-2 text-lg font-semibold text-foreground">
							{errorAlerts}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							Количество alert rules с уровнем `ERROR`.
						</p>
					</div>

					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Warning rules
						</p>
						<p className="mt-2 text-lg font-semibold text-foreground">
							{warningAlerts}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							Количество alert rules с уровнем `WARN`.
						</p>
					</div>

					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Latest rule
						</p>
						<p className="mt-2 text-lg font-semibold text-foreground">
							{latestAlert?.query || 'No alerts'}
						</p>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							{latestAlert
								? latestAlert.name
								: 'Когда rules появятся, здесь будет последняя активная запись.'}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
