<script lang="ts">
import { Ref } from '@vue/runtime-core'
</script>
<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import SPLTokenList from '@/components/dashboard/SPLTokenList.vue'
import OrcaTokenList from '@/components/dashboard/OrcaTokenList.vue';
import AssetsBoard from '@/components/dashboard/AssetsBoard.vue'
import AccountsBoard from '@/components/dashboard/AccountsBoard.vue'
import { Icon, addCollection } from '@iconify/vue'
import ps from '@iconify/json/json/ps.json'
import { accountsStore } from "@/store";

addCollection(ps)
const { t } = useI18n()

const totalAssets = ref(0)
const tobeClaimed = ref(0)

const walletAccounts = computed(() =>
  accountsStore.getState()
  .filter(({address}) =>
    {
      try {
        const pub = new PublicKey(address)
        return true
      } catch (error) {
        return false
      }
    }
  )
  .map(({address}) => new PublicKey(address) )
)

</script>

<template>
  <div class="container mx-auto px-6">
    <div class="my-6 grid gap-4 grid-cols-10">
      <AssetsBoard class="col-span-full sm:col-span-5 lg:col-span-6" :total-assets="totalAssets" :to-be-claimed="tobeClaimed" />
      <AccountsBoard class="col-span-full sm:col-span-5 lg:col-span-4" />
    </div>
    <div class="flex font-bold mt-8 mb-4 text-2xl items-center">
      <Icon icon="ps:wallet" class="h-6 text-primary mr-2 w-6" />
      <p>
        {{ t('dashboard.wallet') }}
      </p>
    </div>
    <SPLTokenList :wallets="walletAccounts" @list-value="totalAssets = $event" />
    <OrcaTokenList :wallets="walletAccounts" />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
