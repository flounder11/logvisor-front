import DashboardChart from '@/components/DashboardChart'
import DistributionCard from '@/components/DistributionCard'
import ListSummary from '@/components/ListSummary'
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
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchTopHosts = async () => {
			try {
				setLoader(true)
				setError(null)

				const dataHost = await apiClient.request<TopHostsResponse>({
					method: 'GET',
					path: 'dashboard/top-hosts'
				})
				setTopHosts(dataHost.items)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		const fetchTopServices = async () => {
			try {
				setLoader(true)
				setError(null)

				const dataServices = await apiClient.request<TopServiceResponse>({
					method: 'GET',
					path: 'dashboard/top-services'
				})
				setTopServices(dataServices.items)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		fetchTopServices()
		fetchTopHosts()
	}, [])

	if (loader) return <div>Загрузка</div>
	if (error) return <div>Ошибка</div>

	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<PageInfo data={infoData} />

				<ListSummary />
				<div className="grid gap-6 xl:grid-cols-4">
					<DashboardChart />
					<div className="space-y-6 xl:col-span-2 xl:col-start-3 xl:col-end-5">
						<DistributionCard
							title="Top hosts"
							description="Каркас под список хостов, узлов или источников логов."
							rows={topHosts}
						/>
						<DistributionCard
							title="Top services"
							description="Каркас под распределение по сервисам или приложениям."
							rows={topServices}
						/>
					</div>
				</div>

				<RecentAlerts />
			</div>
		</section>
	)
}
