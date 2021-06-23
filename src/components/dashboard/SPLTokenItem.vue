<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { computed, defineEmit, defineProps, initCustomFormatter, watch } from '@vue/runtime-core'
import { TokenAccountInfo } from '@/utils/web3'
import { pricesStore } from '@/store'
import { asyncComputed } from '@vueuse/core'
import { CoinGeckoApi, SIMPLE_PRICE_PATH } from '@/utils/api'
import { Icon, addCollection } from '@iconify/vue'
import ri from '@iconify/json/json/ri.json'
import { getCoinGeckoId, fetchPrice } from '@/utils/coingecko'

export default defineComponent({
  components: { Icon },
  props: {
    info: TokenAccountInfo,
  },
  emits: ['tokenValue'],
  setup(props, { emit }) {
    addCollection(ri)
    const { t } = useI18n()
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
          const fetchedPrice = await fetchPrice(props.info?.tokenInfo?.symbol)
          if (!fetchedPrice) return 0
          price.value = fetchedPrice.usd
          return fetchedPrice.usd * balance.value
        }
      },
      null,
      { lazy: true, evaluating },
    )
    watch(tokenValue, (newValue, oldValue) => {
      emit('tokenValue', newValue)
    })
    return {
      t,
      balance,
      price,
      tokenValue,
    }
  },
})
</script>

<template>
  <div v-if="info" class="bg-white rounded-lg cursor-default shadow-sm my-2 grid py-3 px-4 transition-colors grid-cols-4 duration-300 items-center justify-between dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900">
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
