import type { HcCoords } from '../types/location'

export const useHcCoords = () => {
  const buildCoords = (input: string): HcCoords => {
    const [lat, lng] = input.split(',')

    if (lat && lng) {
      return [parseFloat(lat.trim()), parseFloat(lng.trim())]
    }

    return [0, 0]
  }

  return { buildCoords }
}
