<template>
  <div :class="cssClass" />
</template>

<script setup lang="ts">
export type BlockSpaceSize = 'full' | 'half' | 'quarter'
type Props = {
  size?: BlockSpaceSize
}

const props = withDefaults(defineProps<Props>(), {
  size: 'full',
})

const cssClass = computed(() => ({
  'h-28': props.size === 'full',
  'h-14': props.size === 'half',
  'h-7': props.size === 'quarter',
}))
</script>
