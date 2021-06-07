<script lang="ts">
</script>
<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import SPLTokenList from '@/components/SPLTokenList.vue'
import AssetsBoard from '@/components/dashboard/AssetsBoard.vue'
import AccountsBoard from '@/components/dashboard/AccountsBoard.vue'
import { Icon, addCollection } from '@iconify/vue'
import ps from '@iconify/json/json/ps.json'

addCollection(ps)
const { t } = useI18n()

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const totalAssets = ref(0)
const tobeClaimed = ref(0)
const netWorth = computed(() => totalAssets.value + tobeClaimed.value)

const walletAccounts = ref([
  new PublicKey('EHGrQkH6dKoc6gsWeq4Rvu7AwM263vd3mv4enVhNxqZa'),
  new PublicKey('4gdstXGW5Dx9jfZ4zGqALYGjKTrmWvtajQCTAQMEHK6A'),
  new PublicKey('B2dDwRadNVoq7F9eV4ZoaapLHniM8oxYyReciMRHHfQ4'),
  new PublicKey('FtBEggQsPLzUp7bL6PtfPRFRYoC3GjeAawhcadZ8M5gN'),
  new PublicKey('G1gDAxHddD8qjRC8qB2PQTe3avtNuFvHcYgjzYnEV1MK'),
])

</script>

<template>
  <div class="container mx-auto px-6">
    <div class="my-6 grid gap-4 grid-cols-10">
      <AssetsBoard class="col-span-full sm:col-span-5 lg:col-span-6" :total-assets="totalAssets" :to-be-claimed="tobeClaimed" />
      <AccountsBoard class="col-span-full sm:col-span-5 lg:col-span-4" :accounts="walletAccounts" />
    </div>
    <div class="flex font-bold mt-8 mb-4 text-2xl items-center">
      <Icon icon="ps:wallet" class="h-6 text-primary mr-2 w-6" />
      <p>
        {{ t('dashboard.wallet') }}
      </p>
    </div>
    <SPLTokenList :wallets="walletAccounts" @list-value="totalAssets = $event" />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
