<template>
  <header>
    <div class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
      Header ({{ currentLangCode }})
    </div>
  </header>
  <main class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
    <slot/>
  </main>
  <footer>
    <div class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
      Footer
    </div>
  </footer>
</template>

<script setup lang="ts">
const { currentLangCode } = useHcLangs()
</script>