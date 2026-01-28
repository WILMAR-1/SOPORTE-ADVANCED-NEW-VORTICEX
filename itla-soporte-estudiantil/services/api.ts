// services/api.ts
// Cliente API centralizado
// Dev: usa proxy con "/api" (sin CORS)
// Prod: usa VITE_API_URL (ej. https://dominio.com/api)

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export class ApiError extends Error {
  status?: number
  data?: any
  constructor(message: string, status?: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Prioridad:
 * 1) VITE_API_URL (producción o cuando quieras apuntar directo)
 * 2) "/api" (desarrollo con proxy)
 *
 * Ejemplos:
 * - Dev:   VITE_API_URL vacío -> base "/api"
 * - Prod:  VITE_API_URL="https://tudominio.com/api" -> base absoluta
 */
const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
const API_BASE_URL = RAW_BASE && RAW_BASE.length > 0 ? RAW_BASE.replace(/\/+$/, '') : '/api'

function buildUrl(path: string) {
  // asegura que el path empiece con "/"
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

/**
 * Obtiene el token JWT del localStorage
 */
function getToken(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return localStorage.getItem('token') || undefined
}

async function request<T>(
  path: string,
  options: {
    method?: HttpMethod
    body?: any
    token?: string | null  // null significa "no usar token", undefined significa "usar token del localStorage si existe"
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const { method = 'GET', body, token: providedToken, headers = {} } = options
  
  // Si no se proporciona token explícitamente (undefined), intentar obtenerlo del localStorage
  // Si se pasa null explícitamente, no usar token (útil para rutas públicas)
  let token = providedToken
  if (token === undefined) {
    token = getToken()
  }

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  const hasBody = body !== undefined && body !== null
  if (hasBody && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (token) finalHeaders['Authorization'] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(buildUrl(path), {
      method,
      headers: finalHeaders,
      body: hasBody ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,

      // Para APIs con cookies/sesión (si no usas cookies, puedes dejar omit)
      // Si más adelante usas cookies en localhost, cambia a 'include'
      credentials: 'omit',
    })
  } catch {
    throw new ApiError(
      `No se pudo conectar con el servidor API. Verifica que esté levantado y la URL sea correcta (${API_BASE_URL}).`
    )
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    // Mejorar mensaje de error para mostrar más detalles
    let msg = `Error HTTP ${res.status}`
    
    if (data) {
      if (data.message) {
        msg = data.message
      } else if (data.error) {
        msg = data.error
      }
      
      // Si hay más información en desarrollo, mostrarla
      if (data.hint) {
        msg += `\n💡 ${data.hint}`
      }
      if (data.file && res.status === 500) {
        console.error('Error en:', data.file, 'línea', data.line)
      }
    }
    
    throw new ApiError(msg, res.status, data)
  }

  return data as T
}

export const api = {
  // Por defecto, estas funciones obtendrán el token del localStorage automáticamente
  // Para rutas públicas, pasa null explícitamente: api.post('/auth/login', data, null)
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: 'GET', token }),
  post: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'POST', body, token }),
  put: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'PUT', body, token }),
  patch: <T>(path: string, body?: any, token?: string | null) => request<T>(path, { method: 'PATCH', body, token }),
  del: <T>(path: string, token?: string | null) => request<T>(path, { method: 'DELETE', token }),
}
