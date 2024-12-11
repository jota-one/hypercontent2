<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  documentDriven: false,
  layout: 'hc-edit',
  access: 'restricted',
})

const route = useRoute()
const { fetchContent } = useHcApi()

const path = computed(() => route.path.slice(5))
const content = ref(await fetchContent(path.value))
</script>

<template>
  <NuxtLayout>
    <!--    <MDC :value="content" />-->
    {{ content }}
  </NuxtLayout>
</template>
