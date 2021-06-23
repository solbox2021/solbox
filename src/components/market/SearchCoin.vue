<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import coinGeckoIds from '@/assets/coingecko.json'
import { favoriteCoins } from '@/utils/storage'
import { Icon, addCollection } from '@iconify/vue'
import mdi from '@iconify/json/json/mdi.json'

export default defineComponent({
  components: { Icon },
  setup() {
    addCollection(mdi)

    const query = ref('')

    const searchRes = computed(() => coinGeckoIds.filter(({ symbol, name }) =>
      (symbol.toLowerCase().includes(query.value.toLowerCase()) || name.toLowerCase().includes(query.value.toLowerCase()))))

    const addFavorite = function(symbol: string) {
      if (!favoriteCoins.value.includes(symbol))
        favoriteCoins.value.push(symbol)
    }

    return {
      searchRes,
      query,
      favoriteCoins,
      addFavorite,
    }
  },
})
</script>

<template>
  <div class="flex flex-col w-full dark:text-light-600">
    <div class="border-b flex-none border-b-gray-300">
      <input
        v-model="query"
        type="search"
        placeholder="Search token symbol or name"
        class="outline-none w-full py-1 text-gray-600 sm:text-xl dark:bg-gray-800 dark:text-light-600"
      >
    </div>
    <div class="flex-grow mt-1 overflow-auto">
      <ul class="">
        <li
          v-for="coin in searchRes"
          :key="coin.coinGeckoId"
          class="flex h-16 py-2 justify-around items-center hover:bg-gray-100 md:px-2 dark:hover:bg-gray-900"
        >
          <img
            :src="coin.logoURI ? coin.logoURI : 'https://placeholder.pics/svg/300x300/EEEEEE/EEEEEE'"
            class="rounded-full flex-none h-8 mr-4 w-8"
          >
          <div class="flex-auto">
            <p class="font-semibold">
              {{ coin.symbol }}
            </p>
            <p class="text-xs text-gray-500">
              {{ coin.name }}
            </p>
          </div>
          <button
            class="flex-none h-7 text-sm w-16 focus:outline-none btn"
            :disabled="favoriteCoins.includes(coin.symbol)"
            @click="addFavorite(coin.symbol)"
          >
            <Icon v-if="favoriteCoins.includes(coin.symbol)" icon="mdi:check" class="h-5 w-5"></Icon>
            <span v-else>ADD</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
