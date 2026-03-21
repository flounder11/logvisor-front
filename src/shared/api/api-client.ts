// import { API_BASE_URL } from '@/shared/constants/api'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import axios, { type AxiosRequestConfig, type Method } from 'axios'

type RequestParams = {
	method?: Method
	path: string
	body?: unknown
	signal?: AbortSignal
	headers?: Record<string, string>
	responseType?: AxiosRequestConfig['responseType']
}

class ApiClient {
	private static instance: ApiClient

	private readonly baseUrl: string = API_BASE_URL

	static getClient(): ApiClient {
		if (!ApiClient.instance) {
			ApiClient.instance = new ApiClient()
		}
		return ApiClient.instance
	}

	private buildConfig({
		method = 'GET',
		path,
		body,
		signal,
		responseType
	}: RequestParams): AxiosRequestConfig {
		return {
			method,
			url: `${this.baseUrl}/api/v1/${path}`,
			data: body,
			signal,
			responseType
		}
	}

	async request<T>(params: RequestParams): Promise<T> {
		const config = this.buildConfig(params)

		try {
			const response = await axios(config)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const serverMessage = error.response?.data?.message
				if (serverMessage) {
					throw new Error(serverMessage)
				}
				throw new Error(
					error.message || 'Произошла ошибка при запросе к серверу'
				)
			}

			throw new Error(
				'Неизвестная ошибка: ' +
					(error instanceof Error ? error.message : String(error))
			)
		}
	}
}

export const apiClient = ApiClient.getClient()
