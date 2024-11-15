<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

type Props = {
  prefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: '',
})

const { currentLangCode } = useHcLangs(props.prefix)
const navQuery = queryContent({
  where: {
    _path: { $contains: `/${currentLangCode.value}/` },
  },
})

const extractNavigation = (navigation: NavItem[]) => {
  return navigation?.[0]?.children || []
}
</script>

<template>
  <ContentNavigation v-slot="{ navigation }" :query="navQuery">
    <ul class="flex items-center space-x-2">
      <li
        v-for="link of extractNavigation(navigation)"
        :key="link._path"
        class="list-none"
      >
        <NuxtLink
          :to="`${prefix}${link._path}`"
          class="text-white no-underline hover:underline"
        >
          {{ link.title }}
        </NuxtLink>
      </li>
    </ul>
  </ContentNavigation>
</template>
