import AllLogs from '@/components/AllLogs'
import Filters from '@/components/Filters'
import LogInfo from '@/components/LogInfo'
import PageInfo from '@/components/PageInfo'
import { apiClient } from '@/shared/api/api-client'
import { useEffect, useState } from 'react'

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
	time: string
	host: string
	service: string
	message: string
	note: string
}

export default function SearchPage() {
	const [search, setSearch] = useState<SearchResuiltProps[]>([])
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState(null)

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

	if (loader) return <div>loader</div>
	if (error) return <div>error</div>

	return (
		<section className="mx-auto mt-8 max-w-7xl space-y-8 px-4 pb-10 sm:px-6">
			<PageInfo data={infoData} />

			<Filters filterSearch={search} />
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
				<AllLogs search={search} />
				<LogInfo />
			</div>
		</section>
	)
}
