<script lang="ts">
import { computed, defineComponent, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { PublicKey } from '@solana/web3.js'
import SPLTokenList from '@/components/dashboard/SPLTokenList.vue'
import OrcaTokenList from '@/components/dashboard/OrcaTokenList.vue'
import AssetsBoard from '@/components/dashboard/AssetsBoard.vue'
import AccountsBoard from '@/components/dashboard/AccountsBoard.vue'
import { Icon, addCollection } from '@iconify/vue'
import fxemoji from '@iconify/json/json/fxemoji.json'
import { accountsStore } from '@/store'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { Icon, AssetsBoard, AccountsBoard, SPLTokenList, OrcaTokenList },
  setup() {
    addCollection(fxemoji)
    const { t } = useI18n()
    const router = useRouter()

    const walletAssets = ref(0)
    const tobeClaimed = ref(0)
    const orcaAssets = ref(0)

    const searchText = computed(() => useRouter().currentRoute.value.params.id as string)
    const isValideAddress = function(address: string): boolean {
      try {
        const pub = new PublicKey(address)
        return true
      }
      catch (error) {
        return false
      }
    }
    const walletAccounts = computed(() => {
      if (searchText.value && isValideAddress(searchText.value)) {
        return [new PublicKey(searchText.value)]
      }
      else {
        return accountsStore.getState()
          .filter(({ address }) => isValideAddress(address))
          .map(({ address }) => new PublicKey(address))
      }
    })
    return {
      t,
      router,
      walletAssets,
      tobeClaimed,
      orcaAssets,
      walletAccounts,
      searchText,
      isValideAddress,
    }
  },
})
</script>
<template>
  <div class="container mx-auto px-6">
    <div class="my-6 grid gap-4 grid-cols-10">
      <AssetsBoard class="col-span-full sm:col-span-5 lg:col-span-6" :wallet-assets="walletAssets" :to-be-claimed="tobeClaimed" :lp-assets="orcaAssets" />
      <AccountsBoard class="col-span-full sm:col-span-5 lg:col-span-4" :wallets="isValideAddress(searchText) ? walletAccounts : undefined" />
    </div>
    <div class="flex font-bold mt-8 mb-4 text-2xl items-center">
      <Icon icon="fxemoji:moneybag" class="h-6 text-primary mr-2 w-6" />
      <p>
        {{ t('dashboard.wallet') }}
      </p>
    </div>
    <div v-if="walletAccounts.length == 0" class="my-8">
      <button
        class="border border-primary rounded-lg text-primary w-full py-2 px-4 uppercase dark:border-primary_light dark:text-primary_light hover:opacity-60"
        @click="router.push('/manage')"
      >
        {{ t('dashboard.add-account') }}
      </button>
    </div>
    <SPLTokenList :wallets="walletAccounts" @list-value="walletAssets = $event" />
    <OrcaTokenList :wallets="walletAccounts" @list-value="orcaAssets = $event" />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
