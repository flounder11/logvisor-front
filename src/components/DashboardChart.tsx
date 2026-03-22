import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const bars = [
	{ id: 'bar-1', label: '07:00', errorHeight: 24, warningHeight: 44 },
	{ id: 'bar-2', label: '08:00', errorHeight: 36, warningHeight: 58 },
	{ id: 'bar-3', label: '09:00', errorHeight: 22, warningHeight: 40 },
	{ id: 'bar-4', label: '10:00', errorHeight: 52, warningHeight: 72 },
	{ id: 'bar-5', label: '11:00', errorHeight: 68, warningHeight: 88 },
	{ id: 'bar-6', label: '12:00', errorHeight: 42, warningHeight: 61 }
]

export default function DashboardChart() {
	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm lg:col-span-2">
			<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<CardTitle>Отчеты за последние 6 часов</CardTitle>
				</div>
				<div className="flex flex-wrap gap-2 text-xs">
					<span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-red-700 ring-1 ring-red-500/20">
						<span className="size-2 rounded-full bg-red-500" />
						Errors
					</span>
					<span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-700 ring-1 ring-amber-500/20">
						<span className="size-2 rounded-full bg-amber-500" />
						Warnings
					</span>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="rounded-3xl border border-border/60 bg-muted/35 p-5">
					<div className="grid h-[260px] grid-cols-6 items-end gap-4">
						{bars.map(bar => (
							<div
								key={bar.id}
								className="flex h-full flex-col justify-end gap-3"
							>
								<div className="flex h-full items-end justify-center gap-2">
									<div
										className="w-full rounded-t-2xl bg-amber-500/70"
										style={{ height: `${bar.warningHeight}%` }}
									/>
									<div
										className="w-full rounded-t-2xl bg-red-500/75"
										style={{ height: `${bar.errorHeight}%` }}
									/>
								</div>
								<p className="text-center text-xs text-muted-foreground">
									{bar.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
