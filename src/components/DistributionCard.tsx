import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

type DistributionRow = {
	host?: string
	service?: string
	count: number
}

type DistributionCardProps = {
	title: string
	description: string
	rows: DistributionRow[]
}

export default function DistributionCard({
	title,
	description,
	rows
}: DistributionCardProps) {
	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{rows.map((row, index) => (
					<div
						key={index}
						className="space-y-2"
					>
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-medium text-foreground">
								{row.host ?? row.service ?? '-'}
							</p>
							<p className="text-sm text-muted-foreground">{row.count}</p>
						</div>
						<div className="h-2 rounded-full bg-muted">
							<div
								className="h-2 rounded-full bg-foreground/20"
								style={{ width: `${100 - index * 18}%` }}
							/>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
