import { apiClient } from '@/shared/api/api-client'
import { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'

export default function ListSummary() {
	const [sumData, setSumData] = useState<SummaryDataType | null>(null)
	const [loader, setLoader] = useState(false)
	const [error, setError] = useState<string | null>(null)

	type SummaryDataType = {
		totalLogs: number
		errors: number
		warnings: number
		hosts: number
		services: number
	}

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				setLoader(true)
				setError(null)

				const data = await apiClient.request<SummaryDataType>({
					method: 'GET',
					path: 'dashboard/summary'
				})
				setSumData(data)
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message)
				}
			} finally {
				setLoader(false)
			}
		}

		fetchSummary()
	}, [])

	if (loader) return <div>Загрузка</div>
	if (error) return <div>Ошибка</div>

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
			<SummaryCard
				title="Total logs"
				data={sumData?.totalLogs ?? 0}
				description="Общее количество логов, сообщений или событий."
			/>
			<SummaryCard
				title="Errors"
				data={sumData?.errors ?? 0}
				description="Количество ошибок за период"
			/>
			<SummaryCard
				title="Warnings"
				data={sumData?.warnings ?? 0}
				description="Отчет warning volume"
			/>
			<SummaryCard
				title="Active agents"
				data={sumData?.hosts ?? 0}
				description="Онлайн-агенты, ingest workers"
			/>
			<SummaryCard
				title="Triggered alerts"
				data={sumData?.services ?? 0}
				description="Всего собранных алертов"
			/>
		</div>
	)
}
