<template>
  <div>
    <slot v-if="ready"/>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const ready = ref(false)

if (route.path === '/' || route.path === '/admin') {
  ready.value = true
} else {
  const { _loadLangs } = useHcLangs()
  const { _loadLabels } = useHcLabels()

  await _loadLangs()
  await _loadLabels()

  ready.value = true
}
</script>