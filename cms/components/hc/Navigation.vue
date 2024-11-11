<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { currentLangCode } = useHcLangs()
const navQuery = queryContent({
  where: {
    _path: { $contains: `/${currentLangCode.value}/` },
  },
})

const extractNavigation = (navigation: NavItem[]) => {
  return navigation[0]?.children || []
}
</script>

<template>
  <ContentNavigation v-slot="{ navigation }" :query="navQuery">
    <ul>
      <li
        v-for="link of extractNavigation(navigation)"
        :key="link._path"
        class="list-none"
      >
        <NuxtLink
          :to="link._path"
          class="text-white no-underline hover:underline"
          >{{ link.title }}</NuxtLink
        >
      </li>
    </ul>
  </ContentNavigation>
</template>
