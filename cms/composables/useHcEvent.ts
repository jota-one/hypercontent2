import type { HcEvent } from '../types/event'
import dayjs from 'dayjs'

export const useHcEvent = () => {
  const isFull = (event: HcEvent) =>
    event.subscriptions.currentCount >= event.subscriptions.max

  const canSubscribe = (event: HcEvent) => !dayjs(event.subscriptions.starting).isAfter(Date.now()) &&
  !isFull(event)

  const eventMatchesCities = () => {}
  const eventMatchesTags = () => {}
  const getEventAvailability = () => {}
  const loadEventAttendees = async () => {}
  const loadEvent = async () => {}
  const subscribeToEvent = async () => {}
  const unsubscribeFromEvent = async () => {}

  const eventDetail = ref()

  return {
    canSubscribe,
    eventMatchesCities,
    eventMatchesTags,
    getEventAvailability,
    isFull,
    loadEvent,
    loadEventAttendees,
    subscribeToEvent,
    unsubscribeFromEvent
  }
}