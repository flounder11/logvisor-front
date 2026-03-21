import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

type SummaryCardProps = {
	title: string
	description: string
	placeholder?: string
}

export default function SummaryCard({
	title,
	description,
	placeholder = '--'
}: SummaryCardProps) {
	return (
		<Card className="border border-border/60 bg-card/95 shadow-sm">
			<CardHeader className="space-y-2">
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-3xl font-semibold tracking-tight">
					{placeholder}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm leading-6 text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	)
}
