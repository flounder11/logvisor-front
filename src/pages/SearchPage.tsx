import AllLogs from '@/components/AllLogs'
import Filters from '@/components/Filters'
import LogInfo from '@/components/LogInfo'
import PageInfo from '@/components/PageInfo'
import { apiClient } from '@/shared/api/api-client'
import { useEffect, useMemo, useState } from 'react'

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

type LogLevel = 'ERROR' | 'WARN' | 'INFO'

type SearchResuiltProps = {
	id: string
	level: LogLevel
	timestamp: string
	host: string
	service: string
	message: string
	note: string
}

export default function SearchPage() {
	const [search, setSearch] = useState<SearchResuiltProps[]>([])
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState(null)

	const [query, setQuery] = useState('')
	const [selectedHost, setSelectedHost] = useState('all-hosts')
	const [selectedService, setSelectedService] = useState('all-services')
	const [selectedLevel, setSelectedLevel] = useState('all-levels')

	const [selectedLog, setSelectedLog] = useState<SearchResuiltProps | null>(
		null
	)

	const infoData: InfoDataProps = {
		title: 'Поиск по логам с быстрым просмотром записи',
		subTitle:
			'Сверху фильтры, слева найденные логи, справа подробная информация о выбранной записи. Такой layout уже хорошо подходит под MVP search page из ТЗ.',
		iconTitle: 'Search',
		mainCardTitle: 'Results overview',
		mainCardStats: '128',
		mainCardText: 'Найдено записей по текущим фильтрам.',
		subCardTitle: 'Time range',
		subCardStats: 'Last 1 day',
		subCardText: 'Диапазон поиска и контекст расследования.'
	}

	useEffect(() => {
		const fetchAllSearch = async () => {
			try {
				setLoader(true)
				setError(null)
				const data = await apiClient.request<any>({
					method: 'GET',
					path: 'logs/search'
				})
				setSearch(data.items)

				if (data.items.length > 0) {
					setSelectedLog(data.items[0])
				}
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		fetchAllSearch()
	}, [])

	const filteredLogs = useMemo(() => {
		return search
			.filter(item => {
				const matchesQuery =
					item.message.toLowerCase().includes(query.toLowerCase()) ||
					item.host.toLowerCase().includes(query.toLowerCase()) ||
					item.service.toLowerCase().includes(query.toLowerCase())

				const matchesHost =
					selectedHost === 'all-hosts' || item.host === selectedHost

				const matchesService =
					selectedService === 'all-services' || item.service === selectedService

				const matchesLevel =
					selectedLevel === 'all-levels' || item.level === selectedLevel

				return matchesQuery && matchesHost && matchesLevel && matchesService
			})
			.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
	}, [search, query, selectedHost, selectedService, selectedLevel])

	const resetFilters = () => {
		setQuery('')
		setSelectedHost('all-hosts')
		setSelectedLevel('all-levels')
		setSelectedService('all-services')
	}

	if (loader) return <div>loader</div>
	if (error) return <div>error</div>

	return (
		<section className="mx-auto mt-8 max-w-7xl space-y-8 px-4 pb-10 sm:px-6">
			<PageInfo data={infoData} />

			<Filters
				filterSearch={search}
				query={query}
				onQueryChange={setQuery}
				selectedHost={selectedHost}
				onHostChange={setSelectedHost}
				selectedService={selectedService}
				onServiceChange={setSelectedService}
				selectedLevel={selectedLevel}
				onLevelChange={setSelectedLevel}
				onReset={resetFilters}
			/>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
				<AllLogs
					search={filteredLogs}
					selectedLog={selectedLog}
					onSelectedLog={setSelectedLog}
				/>
				<LogInfo selectedLog={selectedLog} />
			</div>
		</section>
	)
}
