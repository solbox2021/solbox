<script lang="ts">
import { useHead } from '@vueuse/head'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  setup() {
    useHead({
      title: 'SolBox',
      meta: [
        { name: 'description', content: 'The All-In-One toolbox for Solana.' },
      ],
    })
  },
})
</script>

<template>
  <router-view />
</template>
