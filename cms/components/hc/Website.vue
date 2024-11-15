<template>
  <slot v-if="ready" />
</template>

<script setup lang="ts">
type LoaderFunction = () => Promise<void>

interface Props {
  loaders?: LoaderFunction[]
}

const props = defineProps<Props>()

const route = useRoute()
const ready = ref(false)

if (route.path === '/' || route.path === '/admin' || route.path === '/edit') {
  ready.value = true
} else {
  const { checkAuth } = useHcAuth()
  const { _loadLangs, currentLangCode } = useHcLangs()
  const { _loadLabels } = useHcLabels()
  // const { _loadNavigation, navigation } = useHcNavigation()
  const { _loadLocale } = useHcLocalDate()

  await _loadLangs()
  await _loadLabels()
  // await _loadNavigation()

  for (const loader of props.loaders || []) {
    if (typeof loader === 'function') {
      await loader()
    } else {
      console.warn('Loader is not a function:', loader)
    }
  }

  ready.value = true

  onBeforeMount(async () => {
    await _loadLocale(currentLangCode.value)
    await checkAuth()
  })
}
</script>
