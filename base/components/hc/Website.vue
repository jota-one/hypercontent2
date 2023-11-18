<template>
  <div>
    <slot v-if="ready"/>
  </div>
</template>

<script setup lang="ts">
const ready = ref(false)

const { _loadLangs } = useHcLangs()
const { _loadLabels, labels } = useHcLabels()

await _loadLangs()
await _loadLabels()

ready.value = true
</script>