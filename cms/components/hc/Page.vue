<template>
  <slot v-if="accessible" />
  <slot v-else name="restricted-access" />
</template>

<script setup lang="ts">
import type { HcPageAccess } from '../../types/page'

const { page } = useContent()
const { isAuthenticated } = useHcAuth()

const userRole = ref('user')

const accessible = computed(() => {
  const access = page.value.access as HcPageAccess

  if (!access || access === 'all') {
    return true
  }

  return isAuthenticated.value && access === userRole.value
})
</script>
