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
import { defineProps } from 'vue'

const { t } = useI18n()

const props = defineProps({
  wallets: Array
})

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
const getAllTokenAccounts = async function(address: string) {
  allTokensAccounts.value = await getTokenAccounts(connection, address)
}

const mainAccount: Ref<any> = ref(null)
const getSolBalance = async function(account: PublicKey) {
  let amount = await getBalance(connection, account.toString())
  mainAccount.value = new TokenAccountInfo(
    account,
    new PublicKey(SOL_MINT_ADDRESS),
    account,
    amount,
    tokensStore.getTokenInfo(SOL_MINT_ADDRESS)
  )
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
  if(props.wallets && props.wallets.length > 0) {
    if(props.wallets[0] instanceof PublicKey) {
      getSolBalance(props.wallets[0])
      getAllTokenAccounts(props.wallets[0].toString())
    }
  }
})

</script>

<template>
  <SPLTokenItem v-for="(data, index) in walletTokens" :key="index" :info="data" />
</template>
