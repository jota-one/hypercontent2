import type { ListResult } from 'pocketbase'

export const fetchEndpoint = async <T = any>(path: string, query = '') => {
  const url = `${path}${query}`
  const response = await fetch(url)
  const json = (await response.json()) as ListResult<T>
  return { json, url }
}
