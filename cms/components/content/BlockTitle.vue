<template>
  <h1 v-if="!form">
    {{ text }}
    <span v-if="edit"> <button @click="form = true">[edit]</button></span>
  </h1>
  <h1 v-else>
    <input v-model="model.text" /> <button @click="save">[save]</button>
  </h1>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  text: string
}

const props = defineProps<Props>()

const route = useRoute()
const edit = computed(() => route.path.indexOf('/edit/') === 0)
const contentRoutePath = computed(() => route.path.slice(5))

const form = ref(false)
const model = ref({
  id: props.id,
  text: props.text,
})

const save = async () => {
  const { updateBlock } = useHcApi()
  const { data: page } = await useAsyncData(
    'my-page',
    queryContent(contentRoutePath.value).findOne
  )
  await updateBlock(page.value, 'BlockTitle', model.value)
  form.value = false
}
</script>
