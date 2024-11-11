<script setup lang="ts">
type Props = {
  span?: number
}
const props = withDefaults(defineProps<Props>(), {
  span: 1,
})

const classes = computed(() => [`col-span-${props.span}`])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
