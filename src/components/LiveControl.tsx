import type { LiveConnectionState, LiveLevel } from '@/shared/types/live'
import { Button } from '@/components/ui/button'
import {
	Card,
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
import { Filter, Pause, Play } from 'lucide-react'

type LiveControlProps = {
	query: string
	onQueryChange: (value: string) => void
	selectedHost: string
	onHostChange: (value: string) => void
	selectedLevel: string
	onLevelChange: (value: string) => void
	hostOptions: string[]
	levelOptions: LiveLevel[]
	autoScroll: boolean
	onAutoScrollChange: (value: boolean) => void
	isPaused: boolean
	onPause: () => void
	onResume: () => void
	connectionState: LiveConnectionState
}

export default function LiveControl({
	query,
	onQueryChange,
	selectedHost,
	onHostChange,
	selectedLevel,
	onLevelChange,
	hostOptions,
	levelOptions,
	autoScroll,
	onAutoScrollChange,
	isPaused,
	onPause,
	onResume,
	connectionState
}: LiveControlProps) {
	return (
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
						{connectionState}
					</div>
				</div>

				<div className="grid items-center gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.7fr))_auto_auto]">
					<Field>
						<Input
							className="h-11 bg-background/80"
							placeholder="Filter stream by message, trace id or service..."
							value={query}
							onChange={event => onQueryChange(event.target.value)}
						/>
					</Field>

					<Field>
						<Select
							value={selectedHost}
							onValueChange={onHostChange}
						>
							<SelectTrigger className="h-11 w-full bg-background/80">
								<SelectValue placeholder="Host" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									<SelectItem value="all-hosts">All hosts</SelectItem>
									{hostOptions.map(host => (
										<SelectItem
											key={host}
											value={host}
										>
											{host}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>

					<Field>
						<Select
							value={selectedLevel}
							onValueChange={onLevelChange}
						>
							<SelectTrigger className="h-11 w-full bg-background/80">
								<SelectValue placeholder="Level" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									<SelectItem value="all-levels">All levels</SelectItem>
									{levelOptions.map(level => (
										<SelectItem
											key={level}
											value={level}
										>
											{level}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>

					<div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
						<Switch
							checked={autoScroll}
							aria-label="Auto scroll"
							onCheckedChange={checked =>
								onAutoScrollChange(checked === true)
							}
						/>
						<div className="space-y-0.5">
							<p className="text-sm font-medium text-foreground">Auto-scroll</p>
							<p className="text-xs text-muted-foreground">
								Автовыбор последнего события
							</p>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button
							size="lg"
							onClick={onPause}
							disabled={isPaused}
						>
							<Pause className="size-4" />
							Pause
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={onResume}
							disabled={!isPaused}
						>
							<Play className="size-4" />
							Resume
						</Button>
					</div>
				</div>
			</CardHeader>
		</Card>
	)
}
