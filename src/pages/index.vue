<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { PublicKey } from '@solana/web3.js'
import { useI18n } from 'vue-i18n'

const testKey = new PublicKey('DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1')

const { t } = useI18n()

</script>

<template>
  <div class="home">
    <img src="../assets/logo.png" />
    <div class="text-red-500">
      {{ testKey.toBase58() }}
    </div>
    <div>{{ t('button.toggle_dark') }}</div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>
