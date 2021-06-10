<script lang="ts">
import { Ref } from 'vue'
import { OrcaAmountInfo } from '@/utils/orca'
import { Price } from '@/utils/api'
</script>
<script setup lang="ts">
import { OrcaTokenAccountInfo, getOrcaAmountInfo } from '@/utils/orca'
import { getTokenSupply } from '@/utils/web3'
import { Connection, PublicKey } from '@solana/web3.js'
import { computed, defineProps, watch, getCurrentInstance, ref } from 'vue'
import { pricesStore } from '@/store'
import { fetchPrice } from '@/utils/coingecko'

const props = defineProps({
  info: OrcaTokenAccountInfo,
})

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const symbolName = computed(() => `${props.info?.poolInfo?.tokenAName}-${props.info?.poolInfo?.tokenBName}`)

const lpTokenSupply = ref(0)  // all released lp-token amount
async function fetchLpTokenSupply(mint: PublicKey) {
  const res = await getTokenSupply(connection, mint)
  lpTokenSupply.value = Number(res.amount)
}
// The proportion of owned lp-tokens occupying all released lp-tokens
const ratio = computed(() => {
  if (lpTokenSupply.value > 0 && props.info?.amount)
    return props.info?.amount / lpTokenSupply.value
    else return 0
})

const tokenAAmountInPool = ref({})  // all token A amount in the pool
const tokenBAmountInPool = ref({})  // all token B amount in the pool
async function fetchSupply(tokens: string[]) {
  const res = await getOrcaAmountInfo(connection, tokens)
  tokenAAmountInPool.value = res[0]
  tokenBAmountInPool.value = res[1]
}

// owned token A&B amount in this pool
const tokenAAmount = computed(() => ratio.value * (tokenAAmountInPool.value as OrcaAmountInfo).amount / 10 ** (tokenAAmountInPool.value as OrcaAmountInfo).decimal)
const tokenBAmount = computed(() => ratio.value * (tokenBAmountInPool.value as OrcaAmountInfo).amount / 10 ** (tokenBAmountInPool.value as OrcaAmountInfo).decimal)
// token A & B price
const tokenAPrice: Ref<Price | undefined> = ref()
const tokenBPrice: Ref<Price | undefined> = ref()
async function getPrice(symbols: string[]) {
  tokenAPrice.value = pricesStore.getPrice(symbols[0])
  tokenBPrice.value = pricesStore.getPrice(symbols[1])
  if (!tokenAPrice.value) {
    tokenAPrice.value = await fetchPrice(symbols[0])
  }
  if (!tokenBPrice.value) {
    tokenBPrice.value = await fetchPrice(symbols[1])
  }
}
// token A & B value
const tokenAValue = computed(() => tokenAPrice.value ? tokenAPrice.value.usd * tokenAAmount.value : 0)
const tokenBValue = computed(() => tokenBPrice.value ? tokenBPrice.value.usd * tokenBAmount.value : 0)

watch(() => props.info, (value, oldValue) => {
  if (value?.poolInfo) {
    fetchLpTokenSupply(value.mint)
    const tokenA = value?.poolInfo?.tokenAccountA
    const tokenB = value?.poolInfo?.tokenAccountB
    fetchSupply([tokenA, tokenB])
    const symbolA = value.poolInfo.tokenAName
    const symbolB = value.poolInfo.tokenBName
    getPrice([symbolA, symbolB])
  }
}, { immediate: true })

</script>

<template>
  <div v-if="info?.poolInfo" class="grid grid-cols-4">
    {{ symbolName }}
  </div>
</template>
