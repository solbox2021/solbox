<script lang="ts">
import { computed, defineEmit, Ref, watch } from '@vue/runtime-core'
import { PropType } from 'vue'
</script>
<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import { getMultiTokenAccounts, getMultiBalance } from '@/utils/web3'
import { tokensStore } from '@/store'
import { TokenAccountInfo } from '@/utils/web3'
import SPLTokenItem from '@/components/SPLTokenItem.vue'
import { defineProps } from 'vue'

const { t } = useI18n()

const props = defineProps({
  wallets: Array as PropType<PublicKey[]>,
})

const emit = defineEmit([
  'listValue'
])

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
const getAllTokenAccounts = async function(addresses: PublicKey[]) {
  allTokensAccounts.value = await getMultiTokenAccounts(connection, addresses)
}

const solAccounts: Ref<TokenAccountInfo[]> = ref([])
const getSolBalance = async function(addresses: PublicKey[]) {
  solAccounts.value = await getMultiBalance(connection, addresses)
}

const walletTokens = computed(() => {
  let tokens = allTokensAccounts.value
    .filter(({mint}) => (tokensStore.getTokenInfo(mint.toString()) != undefined))
    .filter(({amount}) => amount > 0)
    .map(({pubkey, mint, owner, amount}) => new TokenAccountInfo(
      pubkey,
      mint,
      owner,
      amount,
      tokensStore.getTokenInfo(mint.toString()),
    ))
    .sort((a, b) => (a.tokenInfo!.symbol > b.tokenInfo!.symbol ? 1 : -1))
  tokens.unshift(...solAccounts.value)
  return tokens
})

const tokenValues: Ref<number[]> = ref([])
const receiveUpdatedValue = function(index: number, value: number) {
  tokenValues.value[index] = value
}
const totalValue = computed(() => tokenValues.value.length > 0 ? tokenValues.value.reduce((previous, current) => previous + current) : 0)
watch(totalValue, (newValue, oldValue) => {
  emit('listValue', newValue)
})

onMounted(() => {
  if(props.wallets && props.wallets.length > 0) {
    getSolBalance(props.wallets)
    getAllTokenAccounts(props.wallets)
  }
})

</script>

<template>
  <SPLTokenItem v-for="(data, index) in walletTokens" :key="index" :info="data" @token-value="receiveUpdatedValue(index, $event)" />
</template>
