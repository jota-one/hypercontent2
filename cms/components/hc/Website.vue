<template>
  <slot v-if="ready" />
  <div v-else>
    <ContentNavigation v-slot="{ navigation }">
      <ul>
        <li v-for="link of navigation" :key="link._path">
          <NuxtLink :to="link._path">{{ link.title }}</NuxtLink>
        </li>
      </ul>
    </ContentNavigation>
  </div>
</template>

<script setup lang="ts">
type LoaderFunction = () => Promise<void>

interface Props {
  loaders?: LoaderFunction[]
}

const props = defineProps<Props>()

const route = useRoute()
const ready = ref(false)

if (route.path === '/' || route.path === '/admin') {
  ready.value = true
} else {
  const { checkAuth } = useHcAuth()
  const { _loadLangs, currentLangCode } = useHcLangs()
  const { _loadLabels } = useHcLabels()
  const { _loadNavigation } = useHcNavigation()
  const { _loadLocale } = useHcLocalDate()

  await _loadLangs()
  await _loadLabels()
  await _loadNavigation()

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
