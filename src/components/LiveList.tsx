import type { StreamEvent } from '@/shared/types/live'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Clock3, Server } from 'lucide-react'
type LiveLevel = StreamEvent['level']

const levelTone: Record<LiveLevel, string> = {
	ERROR: 'bg-red-500/12 text-red-700 ring-red-500/20',
	WARN: 'bg-amber-500/12 text-amber-700 ring-amber-500/20',
	INFO: 'bg-sky-500/12 text-sky-700 ring-sky-500/20'
}

type LiveListProps = {
	liveData: StreamEvent[]
	selectedEventId: string | null
	onSelectEvent: (event: StreamEvent) => void
	bufferedCount: number
}

export default function LiveList({
	liveData,
	selectedEventId,
	onSelectEvent,
	bufferedCount
}: LiveListProps) {
	return (
		<Card className="flex h-[760px] min-h-0 flex-col border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="gap-4 border-b border-border/60 pb-5">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						<CardTitle className="text-xl">Live stream</CardTitle>
						<CardDescription>
							Основная лента входящих событий из socket stream.
						</CardDescription>
					</div>
					<div className="rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground">
						{liveData.length} visible / {bufferedCount} buffered
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 space-y-3 overflow-y-auto pt-5 pr-2">
				{liveData.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-6 text-sm text-muted-foreground">
						События ещё не пришли или не проходят по текущим фильтрам.
					</div>
				) : null}

				{liveData.map((event, index) => (
					<div
						key={event.id}
						onClick={() => onSelectEvent(event)}
						className={`rounded-2xl border p-4 transition-colors ${
							selectedEventId === event.id
								? 'border-foreground/15 bg-muted/55 shadow-sm'
								: index === 0
									? 'border-border/60 bg-background/85'
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
										подходит под realtime append без тяжёлой табличной разметки.
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
	)
}
