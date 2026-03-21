import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'
import { Button } from './ui/button'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

export default function Filters() {
	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="gap-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="space-y-1">
						<CardTitle className="text-xl">Filters</CardTitle>
						<CardDescription>
							Минимальный и понятный бар для запроса, host, service и уровня
							лога.
						</CardDescription>
					</div>
					<div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
						<Filter className="size-3.5" />
						Static search controls
					</div>
				</div>

				<div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.7fr))_auto] items-center">
					<Field>
						<Input
							className="h-11 bg-background/80"
							placeholder="Search in message, trace id, host, service..."
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
									<SelectItem value="srv-worker-02">srv-worker-02</SelectItem>
									<SelectItem value="srv-db-01">srv-db-01</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>

					<Field>
						<Select defaultValue="all-services">
							<SelectTrigger className="h-11 w-full bg-background/80">
								<SelectValue placeholder="Service" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									<SelectItem value="all-services">All services</SelectItem>
									<SelectItem value="api-gateway">api-gateway</SelectItem>
									<SelectItem value="worker">worker</SelectItem>
									<SelectItem value="postgres">postgres</SelectItem>
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

					<div className="flex flex-wrap gap-3">
						<Button
							size="lg"
							className="min-w-28"
						>
							<Search className="size-4" />
							Search
						</Button>
						<Button
							variant="secondary"
							size="lg"
						>
							Reset
						</Button>
					</div>
				</div>
			</CardHeader>
		</Card>
	)
}
