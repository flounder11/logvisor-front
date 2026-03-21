import AllLogs from '@/components/AllLogs'
import Filters from '@/components/Filters'
import LogInfo from '@/components/LogInfo'
import PageInfo from '@/components/PageInfo'

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

export default function SearchPage() {
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

	return (
		<section className="mx-auto mt-8 max-w-7xl space-y-8 px-4 pb-10 sm:px-6">
			<PageInfo data={infoData} />

			<Filters />
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
				<AllLogs />
				<LogInfo />
			</div>
		</section>
	)
}
