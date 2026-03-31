/**
 * Thin fetch wrapper for calling the .NET backend.
 *
 * - Automatically sends cookies (credentials: 'include') so the httpOnly
 *   auth_token cookie is attached without any manual header work.
 * - Throws a typed error on 401 so callers can handle session expiry.
 * - Use apiGet / apiPost for all backend calls — never use raw fetch.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include', // sends httpOnly cookie automatically
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (res.status === 401) throw new ApiError(401, 'UNAUTHORIZED')
  if (!res.ok) throw new ApiError(res.status, `API error: ${res.status}`)

  return res.json()
}

export const apiGet = <T>(path: string) => request<T>(path)

export const apiPost = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const apiPut = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) })

export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: 'DELETE' })

export { ApiError }
