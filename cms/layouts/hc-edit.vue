<template>
  <ClientOnly>
    <header>
      <div
        class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:p-8 bg-indigo-800 text-white"
      >
        <NuxtLink
          :to="`${prefix}/${currentLangCode}`"
          class="text-white no-underline hover:underline"
          >Edit mode - Home ({{ currentLangCode }})</NuxtLink
        >
        <Navigation :prefix="prefix" />
      </div>
    </header>
    <main
      class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
    >
      <slot />
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import Navigation from '../components/hc/Navigation.vue'

const prefix = '/edit'
const { currentLangCode } = useHcLangs(prefix)
</script>
