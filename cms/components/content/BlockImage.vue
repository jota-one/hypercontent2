<template>
  <div>
    <img :src="src" :alt="alt" />
    <div><slot /></div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  src: string
  alt: string
}

defineProps<Props>()
</script>
