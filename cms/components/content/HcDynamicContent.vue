<template>
  <ClientOnly>
    <Suspense>
      <DynamicContent v-if="resolvedContent"/>
      <template #fallback> Loading... </template>
    </Suspense>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Slot } from 'vue'
import { HC_ENDPOINTS } from '../../common/config'
import { resolveEndpointDefPlaceholders } from '../../common/helpers'

interface Props {
  entity: string
  field: string
}

const props = defineProps<Props>()

const runtimeConfig = useRuntimeConfig().public
const slots = useSlots()
const route = useRoute()
const { currentLang } = useHcLangs()

const resolvedContent = ref<any | null>(null)
const entityPropRegExp = computed(() => new RegExp(`(:${props.entity}\\.\\w+)`))

const DynamicContent = () => {
  return resolveSlot(slots.default)
}

const resolveSlot = (slot?: Slot<any>) => {
  if (slot) {
    const resolveProps = (componentProps: Record<string, any>) => Object.entries(componentProps).reduce(
      (acc: Record<string, any>, [key, value]) => {
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            // TODO implement array props resolving
            console.warn('Array props resolving is not implemented!')
          } else {
            acc[key] = resolveProps(value)
          }
        } else {
          const propValue = (value as unknown as string | number | boolean)
          const entityRef = `:${props.entity}`

          if (propValue === entityRef) {
            acc[key] = resolvedContent.value
          } else if (typeof propValue === 'string' && propValue.indexOf(entityRef) > -1) {
            acc[key] = propValue.split(entityPropRegExp.value)
              .reduce((acc: string, part: string) => {
                if (part.startsWith(entityRef)) {
                  const entityProp = part.substring(entityRef.length)

                  if (entityProp.startsWith('.')) {
                    acc += resolvedContent.value[entityProp.substring(1)]
                    return acc
                  }
                }

                acc += part
                return acc
              }, '')
          }
        }

        return acc
      },
      componentProps,
    )

    return slot().map((component: any) => ({
      ...component,
      props: resolveProps(component.props)
    }))
  } else {
    console.warn('Slot is empty!', slot)
  }
}

const fetchEntity = async (entity: string, field: string) => {
  const fieldValue = route.query[field]
  const endpoint = (HC_ENDPOINTS as Record<string, any>)[entity]

  const entityObj = { [entity]: { [field]: fieldValue } }
  const lang = currentLang.value

  const apiEndpointPath = resolveEndpointDefPlaceholders(endpoint.detail.path, entityObj)
  const apiEndpointQueryParams = resolveEndpointDefPlaceholders(endpoint.detail.queryParams, { lang })

  const res = await fetch(
    `${runtimeConfig.hypercontent.remoteApi}${apiEndpointPath}${apiEndpointQueryParams}`,
  )

  if (res.status === 200) {
    return res.json()
  }
}

onMounted(async () => {
  resolvedContent.value = await fetchEntity(props.entity, props.field)
})
</script>
