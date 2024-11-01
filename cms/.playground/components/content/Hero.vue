<template>
  <div class="hero">
    Hero<br />
    locale date: {{ localeDate }}<br />
  </div>
</template>

<script setup lang="ts">
const { currentDayjsLocale, getLocaleDate, loadLocale } = useHcLocalDate()

onMounted(async () => {
  await loadLocale()
})

const localeDate = computed(() =>
  currentDayjsLocale.value ? getLocaleDate(new Date()).format('dddd') : null
)
</script>
