<template>
  <HcWebsite>
    <header>
      <div
        class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:p-8 bg-indigo-800 text-white"
      >
        <NuxtLink
          :to="`/${currentLangCode}`"
          class="text-white no-underline hover:underline"
          >Home ({{ currentLangCode }})</NuxtLink
        >
        <Navigation />
      </div>
    </header>
    <main
      class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
    >
      <HcPage>
        <ContentSlot />
        <template #restricted-access> Insert login form here... </template>
      </HcPage>
    </main>
    <footer>
      <div
        class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:p-8 bg-indigo-800 text-white"
      >
        Footer
      </div>
    </footer>
  </HcWebsite>
</template>

<script setup lang="ts">
import Navigation from '../components/hc/Navigation.vue'

const { currentLangCode } = useHcLangs()
</script>
