<script lang="ts">
import { PriceRes } from '@/utils/api'

</script>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, defineEmit, defineProps, initCustomFormatter, watch } from '@vue/runtime-core'
import { TokenAccountInfo } from '@/utils/web3'
import { pricesStore } from '@/store'
import { asyncComputed } from '@vueuse/core'
import { ref } from 'vue'
import { CoinGeckoApi, SIMPLE_PRICE_PATH } from '@/utils/api'
import { Icon, addCollection } from '@iconify/vue'
import ri from '@iconify/json/json/ri.json'

addCollection(ri)

const { t } = useI18n()

const props = defineProps({
  info: TokenAccountInfo,
})

const emit = defineEmit([
  'tokenValue'
])

const balance = computed(() => props.info?.tokenInfo ? props.info.amount / 10 ** props.info.tokenInfo.decimals : 0)
const commonPrice = computed(() => pricesStore.getPrice(props.info?.tokenInfo?.symbol))
const price = ref(0)
const evaluating = ref(false)
const tokenValue = asyncComputed(
  async() => {
    if (commonPrice.value) {
      price.value = commonPrice.value.usd
      return balance.value * commonPrice.value.usd
    }
    else {
      const id = pricesStore.getCoinGeckoId(props.info?.tokenInfo?.symbol)
      if (!id) return 0
      const fetchedPrice = await CoinGeckoApi.get<PriceRes>(SIMPLE_PRICE_PATH, {
        params: {
          ids: id,
          vs_currencies: 'usd',
        },
      })
      price.value = fetchedPrice.data[id].usd
      return fetchedPrice.data[id].usd * balance.value
    }
  },
  null,
  { lazy: true, evaluating },
)
watch(tokenValue, (newValue, oldValue) => {
  emit('tokenValue', newValue)
})

</script>

<template>
  <div v-if="info" class="bg-white rounded-lg cursor-pointer shadow-sm my-2 grid py-3 px-4 transition-colors grid-cols-4 duration-300 items-center justify-between dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900">
    <div class="flex flex-row items-center">
      <div class="rounded-full h-8 mr-3 w-8 hidden md:block">
        <img :src="info.tokenInfo?.logoURI ?? 'https://placeholder.pics/svg/300x300/EEEEEE/EEEEEE'" class="rounded-full h-full object-cover w-full" />
      </div>
      <div class="text-gray-800 dark:text-gray-300">
        <p class="font-semibold">
          {{ info.tokenInfo?.symbol }}
        </p>
      </div>
    </div>
    <div class="flex flex-col items-start">
      <p class="text-xl text-gray-700 dark:text-gray-200">
        {{ balance }}
      </p>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.balance').toUpperCase() }}
      </p>
    </div>
    <div class="flex-col items-start hidden lg:flex">
      <div class="flex text-xl text-gray-700 items-center dark:text-gray-200">
        <Icon icon="ri:money-dollar-circle-fill" class="h-5 mr-1 text-yellow-500 w-5" />
        {{ price > 0 ? price : '--' }}
      </div>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.price').toUpperCase() }}
      </p>
    </div>
    <div class="flex flex-col col-span-2 items-end lg:col-span-1">
      <div class="flex text-xl text-gray-700 items-center dark:text-gray-200">
        <Icon icon="ri:money-dollar-circle-fill" class="h-5 mr-1 text-green-500 w-5" />
        {{ tokenValue?.toFixed(2) }}
      </div>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.value').toUpperCase() }}
      </p>
    </div>
  </div>
</template>
