<template>
  <HcWebsite>
    <header>
      <div
        class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
      >
        Header ({{ currentLangCode }})
      </div>
    </header>
    <main
      class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
    >
      <HcPage>
        <slot />
        <template #restricted-access> Restricted </template>
      </HcPage>
    </main>
    <footer>
      <div
        class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
      >
        Footer
      </div>
    </footer>
  </HcWebsite>
</template>

<script setup lang="ts">
const { currentLangCode } = useHcLangs()
</script>
