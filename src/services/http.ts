const DEFAULT_BASE_URL = 'https://api.coingecko.com/api/v3'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  headers?: Record<string, string>
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number
  statusText: string

  constructor(message: string, status: number, statusText: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

function getBaseUrl() {
  return import.meta.env.VITE_COINGECKO_BASE_URL || DEFAULT_BASE_URL
}

function getDefaultHeaders() {
  const apiKey = import.meta.env.VITE_COINGECKO_API_KEY

  return {
    Accept: 'application/json',
    ...(apiKey ? { 'x-cg-demo-api-key': apiKey } : {}),
  }
}

function getErrorMessage(status: number, payload: unknown) {
  if (status === 429) {
    return 'Rate limit reached — try again shortly.'
  }

  if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
    return payload.error
  }

  return 'Request failed. Please try again.'
}

export async function httpGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${getBaseUrl()}${path}`
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
    signal: options.signal,
  })

  if (!response.ok) {
    let payload: unknown = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    throw new ApiError(getErrorMessage(response.status, payload), response.status, response.statusText)
  }

  return (await response.json()) as T
}


