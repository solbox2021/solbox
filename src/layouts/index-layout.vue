<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: {},
})
</script>

<template>
  <main class="flex font-sans h-screen bg-light-100 text-gray-700">
    <router-view class="h-full w-full" />
  </main>
</template>
