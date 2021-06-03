<script lang="ts">
</script>
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import SPLTokenList from '@/components/SPLTokenList.vue'

const { t } = useI18n()

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const walletAccount = new PublicKey('EHGrQkH6dKoc6gsWeq4Rvu7AwM263vd3mv4enVhNxqZa')

</script>

<template>
  <div class="container mx-auto px-6">
    <div class="font-bold my-6 text-4xl">
      {{ t('tab.dashboard') }}
    </div>
    <SPLTokenList :wallets="[walletAccount]" />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
