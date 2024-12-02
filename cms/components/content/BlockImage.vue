<template>
  <div
    :class="{ 'relative hover:outline-dashed cursor-pointer': edit }"
    class="outline-blue-200 group rounded"
  >
    <img :src="src" :alt="alt" />
    <div><slot /></div>
    <span
      class="i-material-symbols-edit hidden group-hover:block text-blue-300 text-2xl mr-2 absolute right-0 top-0"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  id?: string
  src: string
  alt: string
}

defineProps<Props>()

const route = useRoute()
const edit = computed(() => route.path.indexOf('/edit/') === 0)
const contentRoutePath = computed(() => route.path.slice(5))
</script>
