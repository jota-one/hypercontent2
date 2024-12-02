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
        <Navigation :prefix="prefix" class="flex-1" />
        <div v-if="isAuthenticated" class="self-end flex items-center">
          <span class="mr-2">{{ user?.name }} ({{ userRole }})</span>
          <span
            class="i-material-symbols-logout-rounded text-xl cursor-pointer hover:text-black"
            @click="logout"
          />
        </div>
      </div>
    </header>
    <main
      class="mx-auto flex max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8"
    >
      <slot v-if="isAuthenticated" />
      <Login v-else />
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import Login from '../components/hc/Login.vue'
import Navigation from '../components/hc/Navigation.vue'

const prefix = '/edit'
const { currentLangCode } = useHcLangs(prefix)
const { isAuthenticated, userRole, user, checkAuth, logout } = useHcAuth()

onBeforeMount(async () => {
  await checkAuth()
})
</script>
