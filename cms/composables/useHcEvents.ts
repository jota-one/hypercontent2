import type { HcEventUserSubscription } from '../types/event'

export const useHcEvents = () => {
  const subscribedEvents = useState<HcEventUserSubscription[]>(
    'hcSubscribedEvents',
    () => []
  )
  const subscribedEventsLoaded = useState(
    'hcSubscribedEventsLoaded',
    () => false
  )

  const { isAuthenticated, getToken } = useHcAuth()
  const runtimeConfig = useRuntimeConfig().public

  const getNextAvailableEvent = () => {}

  const loadAllEventsCities = async () => {}

  const loadAllEventsTags = async () => {}

  const loadSubscriptions = async () => {
    const response = await fetch(
      `${runtimeConfig.hypercontent.remoteApi}/events/subscriptions`,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    )

    const responseBody = await response.json()
    subscribedEvents.value = responseBody.subscriptions
  }

  const loadEventsList = async () => {
    // const response =
  }

  const allEventsCities = ref()
  const allEventsTags = ref()
  const eventsList = ref()
  const eventsDateRange = ref()
  const eventsDateRangeSpan = ref()
  const filteredTags = ref()

  watch(
    isAuthenticated,
    async _isAuthenticated => {
      if (!_isAuthenticated) {
        subscribedEvents.value = []
      }

      if (_isAuthenticated && !subscribedEventsLoaded.value) {
        await loadSubscriptions()
        subscribedEventsLoaded.value = true
      }
    },
    { immediate: true }
  )

  return {
    allEventsCities,
    allEventsTags,
    eventsList,
    eventsDateRange,
    eventsDateRangeSpan,
    filteredTags,
    subscribedEvents,
    getNextAvailableEvent,
    loadAllEventsCities,
    loadAllEventsTags,
    loadEventsList,
  }
}
