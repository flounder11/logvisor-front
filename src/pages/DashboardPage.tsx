import DashboardChart from '@/components/DashboardChart'
import DistributionCard from '@/components/DistributionCard'
import ListSummary, { type SummaryDataType } from '@/components/ListSummary'
import PageInfo from '@/components/PageInfo'
import RecentAlerts from '@/components/RecentAlerts'
import { apiClient } from '@/shared/api/api-client'
import { useEffect, useState } from 'react'

type TopHostsItem = {
	host: string
	count: number
}
type TopHostsResponse = {
	items: TopHostsItem[]
}

type TopServiceItem = {
	service: string
	count: number
}
type TopServiceResponse = {
	items: TopServiceItem[]
}

type AlertLevel = 'ERROR' | 'WARN' | 'INFO'

type AlertResponse = {
	id: number
	query: string
	name: string
	level: AlertLevel
	createdAt: string
}

type InfoDataProps = {
	title: string
	subTitle: string
	iconTitle: string
	mainCardTitle: string
	subCardTitle: string
	subCardStats: string
	subCardText: string
}

export default function DashboardPage() {
	const infoData: InfoDataProps = {
		title: 'Logovizor dashboard',
		subTitle:
			'Просмотр всех основных логов с серверов, включая ошибки, предупреждения, события сервисов и последние срабатывания алертов.',
		iconTitle: 'Dashboard',
		mainCardTitle: 'System health',
		subCardTitle: 'Updated',
		subCardStats: '12:30',
		subCardText: 'Последнее время обновления.'
	}

	const [topHosts, setTopHosts] = useState<TopHostsItem[]>([])
	const [topServices, setTopServices] = useState<TopServiceItem[]>([])
	const [summary, setSummary] = useState<SummaryDataType | null>(null)
	const [alerts, setAlerts] = useState<AlertResponse[]>([])
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoader(true)
				setError(null)

				const [dataHost, dataServices, dataSummary, dataAlerts] =
					await Promise.all([
						apiClient.request<TopHostsResponse>({
							method: 'GET',
							path: 'dashboard/top-hosts'
						}),
						apiClient.request<TopServiceResponse>({
							method: 'GET',
							path: 'dashboard/top-services'
						}),
						apiClient.request<SummaryDataType>({
							method: 'GET',
							path: 'dashboard/summary'
						}),
						apiClient.request<AlertResponse[]>({
							method: 'GET',
							path: 'alerts/rules'
						})
					])

				setTopHosts(dataHost.items)
				setTopServices(dataServices.items)
				setSummary(dataSummary)
				setAlerts(dataAlerts)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		void fetchDashboardData()
	}, [])

	if (loader) return <div>Загрузка</div>
	if (error) return <div>Ошибка</div>

	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<PageInfo data={infoData} />

				<ListSummary data={summary} />
				<div className="grid gap-6 xl:grid-cols-4">
					<DashboardChart
						summary={summary}
						topHosts={topHosts}
						topServices={topServices}
						alerts={alerts}
					/>
					<div className="space-y-6 xl:col-span-2 xl:col-start-3 xl:col-end-5">
						<DistributionCard
							title="Top hosts"
							rows={topHosts}
						/>
						<DistributionCard
							title="Top services"
							rows={topServices}
						/>
					</div>
				</div>

				<RecentAlerts data={alerts} />
			</div>
		</section>
	)
}
