<template>
  <h1
    v-if="!form"
    class="outline-blue-200 group rounded relative"
    :class="{
      'group hover:cursor-pointer hover:outline-dashed': edit,
    }"
    @click="toFormMode"
  >
    {{ text }}
    <span
      v-if="edit"
      class="i-material-symbols-edit hidden group-hover:block text-blue-300 text-2xl mr-2 absolute right-0 top-0"
    />
  </h1>
  <h1 v-else class="flex items-center">
    <input
      v-model="model.text"
      class="border flex-1"
      @keyup.esc="form = false"
      @keyup.enter="save"
    />
    <span
      class="i-material-symbols-save text-blue-300 text-2xl mx-2 cursor-pointer"
      @click="save"
    />
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

const toFormMode = () => {
  if (!edit.value) {
    return
  }
  form.value = true
}

const save = async () => {
  const { updateBlock } = useHcApi()
  const { data: page } = await useAsyncData(
    'my-page',
    queryContent(contentRoutePath.value).findOne
  )
  const updatedContent = await updateBlock(page.value, model.value)
  form.value = false

  // @todo: find a way to notify the main page that a block was updated (to reload it)
}
</script>
