<script setup lang="ts">
const { login } = useHcAuth()
const model = ref({
  identity: '',
  password: '',
})

const doLogin = () => {
  return login(model.value)
}
</script>

<template>
  <div class="container mx-auto mt-10 flex align-center justify-center">
    <div class="w-2/5">
      <label
        for="user"
        class="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 mb-4"
      >
        <input
          id="user"
          v-model="model.identity"
          type="text"
          class="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-10 p-3"
          placeholder="Identifier (username or email)"
        />

        <span
          class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
        >
          Identifier (username or email)
        </span>
      </label>
      <label
        for="user"
        class="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 mb-4"
      >
        <input
          id="user"
          v-model="model.password"
          type="password"
          class="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 h-10 p-3"
          placeholder="Password"
        />

        <span
          class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
        >
          Password
        </span>
      </label>
      <button
        class="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        @click="doLogin"
      >
        Login
      </button>
    </div>
  </div>
</template>
