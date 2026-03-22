import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { FileText } from 'lucide-react'

type LiveLevel = 'ERROR' | 'WARN' | 'INFO'

const levelTone: Record<LiveLevel, string> = {
	ERROR: 'bg-red-500/12 text-red-700 ring-red-500/20',
	WARN: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
	INFO: 'bg-sky-500/12 text-sky-700 ring-sky-500/20'
}

type SearchResultProps = {
	id: string
	level: LiveLevel
	timestamp: string
	host: string
	service: string
	message: string
	note: string
}

type LogInfoProps = {
	selectedLog: SearchResultProps | null
}

export default function LogInfo({ selectedLog }: LogInfoProps) {
	if (!selectedLog) {
		return (
			<Card className="min-h-[640px] border border-border/60 bg-card/95 shadow-sm">
				<CardHeader className="gap-4 border-b border-border/60 pb-5">
					<div className="flex flex-col items-start justify-between gap-4">
						<CardTitle className="text-xl">Log details</CardTitle>
						<CardDescription>
							Необходимо выбрать лог слева, чтобы посмотреть детали.
						</CardDescription>
					</div>
				</CardHeader>
			</Card>
		)
	}

	const metadataRows = [
		{ label: 'Timestamp', value: selectedLog.timestamp },
		{ label: 'Host', value: selectedLog.host },
		{ label: 'Service', value: selectedLog.service },
		{ label: 'Level', value: selectedLog.level }
	]

	// const tags = [selectedLog.note]

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
						<span
							className={`inline-flex items-center rounded-full bg-red-500/12 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-500/20 ${levelTone[selectedLog.level]}`}
						>
							{selectedLog.level}
						</span>
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
							<FileText className="size-3.5" />
							{selectedLog.service}
						</span>
					</div>

					<div className="mt-4 space-y-3">
						<h3 className="text-lg font-semibold text-foreground">
							{selectedLog.message}
						</h3>
						<p className="text-sm leading-6 text-muted-foreground">
							{selectedLog.note}
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
						{selectedLog.timestamp} level={selectedLog.level} host=
						{selectedLog.host} service={selectedLog.service} message="
						{selectedLog.message}"
					</div>
				</div>

				<div className="space-y-3">
					<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						Context tags
					</p>
					{/* <div className="flex flex-wrap gap-2">
						{tags.map(tag => (
							<span
								key={tag}
								className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground"
							>
								{tag}
							</span>
						))}
					</div> */}
				</div>
			</CardContent>
		</Card>
	)
}
