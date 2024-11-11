<script setup lang="ts">
type Props = {
  columns: number
}
const props = defineProps<Props>()

const classes = computed(() => [`grid-cols-${props.columns}`])
</script>

<template>
  <div class="grid" :class="classes">
    <slot />
  </div>
</template>
