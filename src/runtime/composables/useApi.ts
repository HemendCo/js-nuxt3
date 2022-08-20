type RequestOptions = {
	method?: string
	body?: RequestInit['body'] | Record<string, any> | FormData | undefined
	pick?: string[]
	params?: Record<string, unknown>,
    headers?: HeadersInit,
    baseURL?: string
}

const useApi = async <Result = unknown>(
	endpoint: string,
	opts?: RequestOptions
) => {
	const headers = {
        ...opts.headers,
        ...useRequestHeaders(['cookie'])
    }

	return useFetch<string, Result>(endpoint, {
		method: opts?.method,
		body: opts?.body,
		baseURL: opts?.baseURL,
		headers,
		params: opts?.params,
		pick: opts?.pick
	})
}

export default useApi