<script lang="ts">
import { CoinMarket, HOT_COIN_MARKET } from '@/utils/coingecko'
import { Ref } from '@vue/runtime-core'

</script>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { fetchCoinMarket } from '@/utils/coingecko'
import { onMounted, ref } from '@vue/runtime-core';
import { Icon, addCollection } from '@iconify/vue'
import ri from '@iconify/json/json/ri.json'
import ph from '@iconify/json/json/ph.json'
import ic from '@iconify/json/json/ic.json'
import { favoriteCoins } from '@/utils/storage'
import { defineProps, watch } from 'vue';

addCollection(ri)
addCollection(ph)
addCollection(ic)
const { t } = useI18n()

const props = defineProps({
  listType: Number,   //0 for favorite, 1 for popular
})

const coinMarkets: Ref<CoinMarket[]> = ref([])
const fetchMarket = async function() {
  coinMarkets.value = await fetchCoinMarket(props.listType == 0 ? favoriteCoins.value : HOT_COIN_MARKET)
}
watch(() => props.listType, (value, oldValue) => {
  fetchMarket()
}, { immediate: true })

const clickFavorite = function(symbol:string | undefined) {
  if (!symbol) return
  const index = favoriteCoins.value.indexOf(symbol)
  console.log(`click ${symbol}: ${index}`)
  if (index < 0) {
    favoriteCoins.value.push(symbol)
  } else {
    favoriteCoins.value.splice(index, 1)
  }
}

</script>
<template>
  <table class="divide-y-2 mt-4 w-full table-auto dark:divide-gray-600">
    <thead>
      <tr>
        <th class="text-center">
        </th>
        <th class="text-left">
          {{ t('market.coin') }}
        </th>
        <th class="text-right">
          {{ t('market.price') }}
        </th>
        <th class="text-right hidden lg:table-cell">
          {{ t('market.1h') }}
        </th>
        <th class="text-right">
          {{ t('market.24h') }}
        </th>
        <th class="text-right hidden lg:table-cell">
          {{ t('market.7d') }}
        </th>
        <th class="text-right hidden sm:block">
          {{ t('market.mkt_cap') }}
        </th>
      </tr>
    </thead>
    <tbody class="divide-y dark:divide-gray-600">
      <tr
        v-for="coin in coinMarkets"
        :key="coin.info?.symbol"
      >
        <td class="text-left">
          <div class="h-5">
            <Icon
              :icon=" favoriteCoins.includes(coin.info?.symbol ?? '') ? 'ic:round-star' : 'ic:round-star-border' "
              class="cursor-pointer h-5 px-1 text-yellow-300 w-7"
              @click="clickFavorite(coin.info?.symbol)"
            />
          </div>
        </td>
        <td class="flex py-2 gap-2 items-center">
          <img
            :src="coin.market.image"
            class="rounded-full h-6 w-6"
          >
          <div>
            <p class="font-bold uppercase">
              {{ coin.info?.symbol ?? coin.market.symbol }}
            </p>
            <p class="font-light text-xs text-gray-400 dark:text-gray-500">
              {{ coin.market.name }}
            </p>
          </div>
        </td>
        <td class="text-right py-2">
          <div class="flex items-center justify-end">
            <Icon icon="ri:money-dollar-circle-fill" class="h-5 mr-1 text-yellow-500 w-5" />
            <p>{{ coin.market.current_price?.toLocaleString(('en-US')) ?? '--' }}</p>
          </div>
        </td>
        <td
          class="text-right hidden lg:table-cell"
          :class="coin.market.price_change_percentage_1h_in_currency >= 0 ? 'text-green-500' : 'text-rose-400'"
        >
          <div class="flex items-center justify-end">
            <Icon
              class="h-4 mr-1 w-4"
              :icon="coin.market.price_change_percentage_1h_in_currency >= 0 ? 'ph:arrow-up-right-bold' : 'ph:arrow-down-right-bold'"
            />
            <p>{{ coin.market.price_change_percentage_1h_in_currency?.toFixed(1) ?? '--' }}%</p>
          </div>
        </td>
        <td class="text-right" :class="coin.market.price_change_percentage_24h_in_currency >= 0 ? 'text-green-500' : 'text-rose-400'">
          <div class="flex items-center justify-end">
            <Icon
              class="h-4 mr-1 w-4"
              :icon="coin.market.price_change_percentage_24h_in_currency >= 0 ? 'ph:arrow-up-right-bold' : 'ph:arrow-down-right-bold'"
            />
            <p>{{ coin.market.price_change_percentage_24h_in_currency?.toFixed(1) ?? '--' }}%</p>
          </div>
        </td>
        <td class="text-right hidden lg:table-cell" :class="coin.market.price_change_percentage_7d_in_currency >= 0 ? 'text-green-500' : 'text-rose-400'">
          <div class="flex items-center justify-end">
            <Icon
              class="h-4 mr-1 w-4"
              :icon="coin.market.price_change_percentage_7d_in_currency >= 0 ? 'ph:arrow-up-right-bold' : 'ph:arrow-down-right-bold'"
            />
            <p>{{ coin.market.price_change_percentage_7d_in_currency?.toFixed(1) ?? '--' }}%</p>
          </div>
        </td>
        <td class="text-right hidden sm:table-cell">
          <div class="flex items-center justify-end">
            <Icon icon="ri:money-dollar-circle-fill" class="h-5 mr-1 text-green-500 w-5" />
            <p>{{ coin.market.market_cap?.toLocaleString('en-US') ?? '--' }}</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="my-2 text-xs text-right text-gray-300 dark:text-gray-700">
    Powered by
    <a class="underline underline-current" href="https://www.coingecko.com/">CoinGecko</a>
  </p>
</template>
