import DashboardChart from '@/components/DashboardChart'
import DistributionCard from '@/components/DistributionCard'
import PageInfo from '@/components/PageInfo'
import RecentAlerts from '@/components/RecentAlerts'
import SummaryCard from '@/components/SummaryCard'

const summaryCards = [
	{
		id: 'total-logs',
		title: 'Total logs',
		description: 'Слот под общее количество логов, сообщений или событий.'
	},
	{
		id: 'errors',
		title: 'Errors',
		description:
			'Можно вывести количество ошибок за период или active incidents.'
	},
	{
		id: 'warnings',
		title: 'Warnings',
		description: 'Подходит для warning volume, anomaly score или health marker.'
	},
	{
		id: 'agents',
		title: 'Active agents',
		description: 'Место под онлайн-агенты, ingest workers или collectors.'
	},
	{
		id: 'alerts',
		title: 'Triggered alerts',
		description: 'Используй для recent alerts, escalations или pending review.'
	}
]

const topHostRows = ['host-name', 'host-name', 'host-name', 'host-name']

const topServiceRows = [
	'service-name',
	'service-name',
	'service-name',
	'service-name'
]

type InfoDataProps = {
	title: string
	subTitle: string
	iconTitle: string
	mainCardTitle: string
	mainCardStats: string
	mainCardText: string
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
		mainCardStats: '92%',
		mainCardText: 'Стабильное состояние',
		subCardTitle: 'Updated',
		subCardStats: '12:30',
		subCardText: 'Последнее время обновления.'
	}
	return (
		<section className="mx-auto mt-8 max-w-7xl px-4 pb-10 sm:px-6">
			<div className="space-y-8">
				<PageInfo data={infoData} />

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
					{summaryCards.map(card => (
						<SummaryCard
							key={card.id}
							title={card.title}
							description={card.description}
						/>
					))}
				</div>

				<div className="grid gap-6 xl:grid-cols-4">
					<DashboardChart />
					<div className="space-y-6 xl:col-span-2 xl:col-start-3 xl:col-end-5">
						<DistributionCard
							title="Top hosts"
							description="Каркас под список хостов, узлов или источников логов."
							rows={topHostRows}
						/>
						<DistributionCard
							title="Top services"
							description="Каркас под распределение по сервисам или приложениям."
							rows={topServiceRows}
						/>
					</div>
				</div>

				<RecentAlerts />
			</div>
		</section>
	)
}
