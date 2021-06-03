<script lang="ts">
import { computed, Ref, watch } from '@vue/runtime-core'
import { PriceRes, SIMPLE_PRICE_PATH } from '@/utils/api'
</script>
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import { getTokenAccounts, getBalance } from '@/utils/web3'
import { tokensStore } from '@/store'
import { TokenAccountInfo } from '@/utils/web3'
import SPLTokenItem from '@/components/SPLTokenItem.vue'
import { SOL_MINT_ADDRESS } from '@/utils/ids'

const { t } = useI18n()

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const walletAccount = new PublicKey('EHGrQkH6dKoc6gsWeq4Rvu7AwM263vd3mv4enVhNxqZa')

const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
const getAllTokenAccounts = async function(address: string) {
  allTokensAccounts.value = await getTokenAccounts(connection, address)
}

const mainAccount: Ref<TokenAccountInfo> = ref(new TokenAccountInfo(
  walletAccount,
  new PublicKey(SOL_MINT_ADDRESS),
  walletAccount,
  0,
  tokensStore.getTokenInfo(SOL_MINT_ADDRESS)
))
const getSolBalance = async function(address: string) {
  let amount = await getBalance(connection, address)
  mainAccount.value.amount = amount
}

const walletTokens = computed(() => {
  let tokens = allTokensAccounts.value
    .filter(({mint}) => (tokensStore.getTokenInfo(mint.toString()) != undefined))
    .map( ({pubkey, mint, owner, amount}) => new TokenAccountInfo(
      pubkey,
      mint,
      owner,
      amount,
      tokensStore.getTokenInfo(mint.toString()),
    ))
    .sort((a, b) => (a.tokenInfo!.symbol > b.tokenInfo!.symbol ? 1 : -1))
  tokens.unshift(mainAccount.value)
  return tokens
})

onMounted(() => {
  getSolBalance(walletAccount.toString())
  getAllTokenAccounts(walletAccount.toString())
})

</script>

<template>
  <div class="container mx-auto px-6">
    <div class="font-bold my-6 text-4xl">
      {{ t('tab.dashboard') }}
    </div>
    <SPLTokenItem v-for="(data, index) in walletTokens" :key="index" :info="data" />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "dashboard"
  }
}
</route>
