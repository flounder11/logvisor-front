import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Clock3, Server } from 'lucide-react'

type LogLevel = 'ERROR' | 'WARN' | 'INFO'

const levelTone: Record<LogLevel, string> = {
	ERROR: 'bg-red-500/12 text-red-700 ring-red-500/20',
	WARN: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
	INFO: 'bg-sky-500/12 text-sky-700 ring-sky-500/20'
}

type SearchResultProps = {
	id: string
	level: LogLevel
	timestamp: string
	host: string
	service: string
	message: string
	note: string
}

type AllLogsProps = {
	search: SearchResultProps[]
	selectedLog: SearchResultProps | null
	onSelectedLog: (log: SearchResultProps) => void
}

export default function AllLogs({
	search,
	selectedLog,
	onSelectedLog
}: AllLogsProps) {
	return (
		<Card className="min-h-[640px] border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="gap-4 border-b border-border/60 pb-5">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						<CardTitle className="text-xl">Logs</CardTitle>
						<CardDescription>Все полученные логи</CardDescription>
					</div>
					<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
						Find {search.length} logs
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 pt-5">
				{search.map((item, index) => {
					const isSelected =
						selectedLog?.timestamp === item.timestamp &&
						selectedLog?.host === item.host &&
						selectedLog?.service === item.service &&
						selectedLog?.message === item.message
					return (
						<div
							onClick={() => onSelectedLog(item)}
							key={`${item.host}-${item.service}-${item.timestamp}-${index}`}
							className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
								isSelected
									? 'border-foreground/15 bg-muted/50 shadow-sm'
									: 'border-border/60 bg-background/75'
							}`}
						>
							<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
								<div className="space-y-3">
									<div className="flex flex-wrap items-center gap-2">
										<span
											className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${levelTone[item.level]}`}
										>
											{item.level}
										</span>
										<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
											<Clock3 className="size-3.5" />
											{item.timestamp}
										</span>
										<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
											<Server className="size-3.5" />
											{item.host}
										</span>
										<span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
											{item.service}
										</span>
									</div>

									<div className="space-y-2">
										<p className="text-sm font-semibold text-foreground sm:text-base">
											{item.message}
										</p>
										<p className="text-sm leading-6 text-muted-foreground">
											Короткое превью строки лога. Здесь хорошо выглядит
											truncation длинных сообщений и переход в detail panel.
										</p>
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-2">
									<span className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground">
										{item.note}
									</span>
								</div>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
