<script lang="ts">
import { defineEmit, Ref } from 'vue'
import { OrcaAmountInfo } from '@/utils/orca'
import { Price } from '@/utils/api'
</script>
<script setup lang="ts">
import { OrcaTokenAccountInfo, getOrcaAmountInfo } from '@/utils/orca'
import { getTokenSupply } from '@/utils/web3'
import { Connection, PublicKey } from '@solana/web3.js'
import { computed, defineProps, watch, getCurrentInstance, ref } from 'vue'
import { pricesStore, tokensStore } from '@/store'
import { fetchPrice } from '@/utils/coingecko'
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import ri from '@iconify/json/json/ri.json'

addCollection(ri)
const { t } = useI18n()

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
const tokenAInfo = computed(() => tokensStore.getTokenInfo((tokenAAmountInPool.value as OrcaAmountInfo).mint))
const tokenBInfo = computed(() => tokensStore.getTokenInfo((tokenBAmountInPool.value as OrcaAmountInfo).mint))

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

const poolValue = computed(() => tokenAValue.value + tokenBValue.value)
const emit = defineEmit([
  'poolValue'
])
watch(poolValue, (value) => {
  emit("poolValue", value)
})

</script>

<template>
  <div v-if="info?.poolInfo" class="bg-white rounded-lg cursor-default shadow-sm my-2 grid py-3 px-4 transition-colors grid-cols-4 duration-300 items-center justify-between dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900">
    <div class="flex flex-row col-span-1 items-center">
      <div class="rounded-full h-8 mr-3 w-8 hidden items-center md:flex">
        <img :src="tokenAInfo?.logoURI ?? 'https://placeholder.pics/svg/300x300/EEEEEE/EEEEEE'" class="rounded-full object-cover h-5 w-5" />
        <img :src="tokenBInfo?.logoURI ?? 'https://placeholder.pics/svg/300x300/EEEEEE/EEEEEE'" class="rounded-full object-cover h-5 -ml-2 w-5" />
      </div>
      <div class="text-gray-800 dark:text-gray-300">
        <p class="font-semibold text-sm lg:text-base">
          {{ symbolName }}
        </p>
      </div>
    </div>
    <div class="flex flex-col col-span-2 items-start">
      <p class="text-sm text-gray-700 lg:text-xl dark:text-gray-200">
        {{ `${tokenAAmount.toFixed(3)} ${info.poolInfo.tokenAName}` }} + {{ `${tokenBAmount.toFixed(3)} ${info.poolInfo.tokenBName}` }}
      </p>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.balance').toUpperCase() }}
      </p>
    </div>
    <div class="flex flex-col col-span-1 items-end">
      <div class="flex text-xl text-gray-700 items-center dark:text-gray-200">
        <Icon icon="ri:money-dollar-circle-fill" class="h-5 mr-1 text-green-500 w-5" />
        {{ (tokenAValue + tokenBValue)?.toFixed(2) }}
      </div>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.value').toUpperCase() }}
      </p>
    </div>
  </div>
</template>
