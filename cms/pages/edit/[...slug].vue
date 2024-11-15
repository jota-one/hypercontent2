<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  documentDriven: false,
  layout: 'hc-edit',
})

const route = useRoute()

const path = computed(() => route.path.slice(5))
</script>

<template>
  <NuxtLayout>
    <ContentDoc :path="path" />
  </NuxtLayout>
</template>
