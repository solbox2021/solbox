<script setup lang="ts">
import { getCurrentInstance } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection } from '@solana/web3.js'

const { t } = useI18n()

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const getVersion = async function getVersion() {
  return await connection.getVersion()
}
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="font-bold my-6 text-4xl">
      {{ t('tab.dashboard') }}
    </div>
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
