import { apiClient } from '@/shared/api/api-client'
import { Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

type PageInfoProps = {
	title: string
	subTitle: string
	iconTitle: string
	mainCardTitle: string
	subCardTitle: string
	subCardStats: string
	subCardText: string
}

type HealthCheck = {
	status: string
}

export default function PageInfo({ data }: { data: PageInfoProps }) {
	const [status, setStatus] = useState<HealthCheck>()
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchHealthCheck = async () => {
			try {
				setLoader(true)
				setError(null)
				const data = await apiClient.request<HealthCheck>({
					method: 'GET',
					path: 'health'
				})
				setStatus(data)
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message)
				}
			} finally {
				setLoader(false)
			}
		}
		fetchHealthCheck()
	}, [])

	if (loader) return <div>loading</div>
	if (error) return <div>error</div>
	return (
		<div>
			<div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-4">
						<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
							<Activity className="size-3.5" />
							{data.iconTitle} shell
						</div>
						<div className="space-y-3">
							<h1 className="max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
								{data.title}
							</h1>
							<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								{data.subTitle}
							</p>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-sm">
							<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								{data.mainCardTitle}
							</p>
							<p className="mt-3 text-3xl font-semibold text-foreground">
								{status?.status}
							</p>
							<p className="mt-1 text-sm leading-6 text-muted-foreground">
								{status?.status === 'UP' ? 'Стабильное состояние' : 'Все упало'}
							</p>
						</div>

						<div className="rounded-2xl border border-border/60 bg-slate-950 p-4 text-slate-50 shadow-sm">
							<p className="text-xs uppercase tracking-[0.18em] text-slate-300">
								{data.subCardTitle}
							</p>
							<p className="mt-3 text-2xl font-semibold">{data.subCardStats}</p>
							<p className="mt-1 text-sm leading-6 text-slate-300">
								{data.subCardText}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
