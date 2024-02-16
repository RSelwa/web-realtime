export const getItemFromLocalStorage = <T>(key: string, fallback?: T): T => {
  if (typeof window === "undefined") return fallback as T

  const item = localStorage.getItem(key)
  if (item) return JSON.parse(item) as T
  return fallback as T
}
export const getItemFromSessionStorage = <T>(key: string, fallback: T): T => {
  const item = sessionStorage.getItem(key)
  if (!item) return fallback
  return JSON.parse(item) as T
}
export const getCookie = <T>(key: string): T | null => {
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(";")
  const cookie = ca.filter((c) => c.trim().startsWith(`${key}=`))
  if (cookie.length === 0) return null
  return JSON.parse(cookie[0].trim().substring(`${key}=`.length)) as T
}
