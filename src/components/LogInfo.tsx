import { Button } from '@/components/ui/button'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { FileText, Sparkles, TriangleAlert } from 'lucide-react'

const metadataRows = [
	{ label: 'Timestamp', value: '2026-03-21 09:18:42 UTC' },
	{ label: 'Host', value: 'srv-app-01' },
	{ label: 'Service', value: 'api-gateway' },
	{ label: 'Level', value: 'ERROR' },
	{ label: 'Source', value: '/var/log/app/api-gateway.log' },
	{ label: 'Trace ID', value: 'trace-9f23b8a1' }
]

const tags = ['production', 'billing', 'http', 'timeout']

export default function LogInfo() {
	return (
		<Card className="min-h-[640px] border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="gap-4 border-b border-border/60 pb-5">
				<div className="flex flex-col items-start justify-between gap-4">
					<CardTitle className="text-xl">Log details</CardTitle>
					<CardDescription>
						Подробная информация о выбранной записи.
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="space-y-5 pt-5">
				<div className="rounded-3xl border border-border/60 bg-background/90 p-5">
					<div className="flex flex-wrap items-center gap-2">
						<span className="inline-flex items-center rounded-full bg-red-500/12 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-500/20">
							ERROR
						</span>
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
							<FileText className="size-3.5" />
							api-gateway
						</span>
					</div>

					<div className="mt-4 space-y-3">
						<h3 className="text-lg font-semibold text-foreground">
							Timeout while sending request to upstream billing service
						</h3>
						<p className="text-sm leading-6 text-muted-foreground">
							Этот блок удобно использовать как summary выбранной записи:
							короткий диагноз, важный контекст и причина, почему лог был
							выделен в списке.
						</p>
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Metadata
					</p>
					<div className="grid gap-3">
						{metadataRows.map(row => (
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
				</div>

				<div className="space-y-3">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Raw message
					</p>
					<div className="rounded-3xl border border-border/60 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
						2026-03-21T09:18:42Z level=ERROR host=srv-app-01 service=api-gateway
						message="Timeout while sending request to upstream billing service"
						traceId=trace-9f23b8a1 region=eu-1
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Context tags
					</p>
					<div className="flex flex-wrap gap-2">
						{tags.map(tag => (
							<span
								key={tag}
								className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Investigation note
						</p>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							Здесь можно потом показывать parsed fields, correlation или
							связанные события по trace id.
						</p>
					</div>
					<div className="rounded-2xl border border-border/60 bg-background/80 p-4">
						<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
							Quick actions
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							<Button
								size="sm"
								variant="outline"
							>
								<Sparkles className="size-4" />
								Correlate
							</Button>
							<Button
								size="sm"
								variant="outline"
							>
								<TriangleAlert className="size-4" />
								Create alert
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
