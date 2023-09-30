type RequestOptions = {
	method?: string
	body?: RequestInit['body'] | Record<string, any> | FormData | undefined
	pick?: string[]
	params?: Record<string, unknown>
	headers?: HeadersInit
	baseURL?: string
	cache?: boolean
	key?: string
}

const useApi = async <Result = unknown>(
	endpoint: any,
	opts?: RequestOptions
) => {
	const headers = {
		//@ts-ignore
		...opts.headers,
		...useRequestHeaders(['cookie'])
	}

	return useFetch<any, Result>(endpoint, {
		//@ts-ignore
		method: opts?.method,
		body: opts?.body,
		baseURL: opts?.baseURL,
		headers,
		params: opts?.params,
		initialCache: opts?.cache,
		key: opts?.key,
	})
}

export default useApi