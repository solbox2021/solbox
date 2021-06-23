<script lang="ts">
import { PublicKey } from '@solana/web3.js'
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import mdi from '@iconify/json/json/mdi.json'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  components: { Icon },
  setup() {
    addCollection(mdi)

    const testKey = new PublicKey('DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1')

    const { t } = useI18n()

    return {
      testKey,
      t,
    }
  },
})
</script>

<template>
  <div class="home">
    <div class="text-red-500">
      {{ testKey.toBase58() }}
    </div>
    <div>{{ t('button.toggle_dark') }}</div>
    <Icon icon="mdi:account-voice" class="h-16 text-red-500 w-16" />
  </div>
</template>
