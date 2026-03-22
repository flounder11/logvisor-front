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

function normalizeText(value: unknown): string {
	return typeof value === 'string' ? value : ''
}

function normalizeSearchResult(item: Partial<SearchResuiltProps>): SearchResuiltProps {
	return {
		id: normalizeText(item.id) || crypto.randomUUID(),
		level:
			item.level === 'ERROR' || item.level === 'WARN' || item.level === 'INFO'
				? item.level
				: 'INFO',
		timestamp: normalizeText(item.timestamp),
		host: normalizeText(item.host),
		service: normalizeText(item.service),
		message: normalizeText(item.message),
		note: normalizeText(item.note)
	}
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
			'Можешь найти нужный лог вписав любую информацию о нем, дальше посмотреть полную информацию в правой части экрана.',
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
				const normalizedItems = Array.isArray(data.items)
					? data.items.map((item: Partial<SearchResuiltProps>) =>
							normalizeSearchResult(item)
						)
					: []
				setSearch(normalizedItems)

				if (normalizedItems.length > 0) {
					setSelectedLog(normalizedItems[0])
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
		const normalizedQuery = query.toLowerCase()

		return search
			.filter(item => {
				const message = normalizeText(item.message).toLowerCase()
				const host = normalizeText(item.host).toLowerCase()
				const service = normalizeText(item.service).toLowerCase()

				const matchesQuery =
					message.includes(normalizedQuery) ||
					host.includes(normalizedQuery) ||
					service.includes(normalizedQuery)

				const matchesHost =
					selectedHost === 'all-hosts' || normalizeText(item.host) === selectedHost

				const matchesService =
					selectedService === 'all-services' ||
					normalizeText(item.service) === selectedService

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
