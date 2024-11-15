<template>
  <div :class="{ relative: edit }">
    <img :src="src" :alt="alt" />
    <div><slot /></div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  id?: string
  edit?: boolean
  src: string
  alt: string
}

defineProps<Props>()
</script>
