<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CoinMarketTable from '@/components/market/CoinMarketTable.vue'
import SearchCoin from '@/components/market/SearchCoin.vue'
import { Dialog, DialogOverlay, DialogTitle } from '@headlessui/vue'
import { onMounted, ref } from 'vue'
import { favoriteCoins } from '@/utils/storage'
import { Icon, addCollection } from '@iconify/vue'
import ic from '@iconify/json/json/ic.json'
import ph from '@iconify/json/json/ph.json'

const { t } = useI18n()
addCollection(ic)
addCollection(ph)

const dialogOpen = ref(false)
const setDialogOpen = function(v: boolean) {
  dialogOpen.value = v
}

const currTab = ref(0)
const tabs = [
  {
    title: 'favorite',
    value: 0,
  },
  {
    title: 'popular',
    value: 1,
  },
]
const clickTab = function(index: number) {
  currTab.value = index
}

onMounted(() => {
  currTab.value = favoriteCoins.value.length > 0 ? 0 : 1
})
</script>

<template>
  <div class="container mx-auto px-6">
    <div
      class="flex mt-6 items-center"
    >
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="cursor-pointer mx-2 text-sm py-1 pr-4 pl-3 transition text-orange-400 inline-flex items-center uppercase sm:text-base hover:opacity-80"
        :class="currTab == index ? 'isActive' : '' "
        @click="clickTab(index)"
      >
        <Icon :icon=" item.value == 0 ? 'ph:star-bold' : 'ph:fire-bold' " class="h-4 mr-1 leading-4 w-4" />
        {{ t(`market.${item.title}`) }}
      </div>
    </div>

    <CoinMarketTable :list-type="currTab" />
    <div
      v-if="currTab == 0"
      class="rounded-lg cursor-pointer flex font-semibold mx-auto border-orange-600 border-2 mt-16 max-w-48 py-1 px-4 text-orange-600 justify-center items-center dark:(text-orange-300 border-orange-300) hover:opacity-80"
      @click="setDialogOpen(true)"
    >
      <Icon icon="ic:outline-add-circle" class="h-5 mr-2 w-5" />
      {{ t('market.add_favorite') }}
    </div>
    <Dialog :open="dialogOpen" class="inset-0 z-20 fixed overflow-y-auto" @close="setDialogOpen">
      <div class="min-h-screen">
        <DialogOverlay class="bg-black opacity-40 inset-0 fixed" />
        <div class="bg-white rounded-xl mx-auto max-w-screen-lg h-2/3 my-24 p-6 inset-x-0 w-5/6 z-10 center fixed md:w-2/3 dark:(bg-gray-800)">
          <SearchCoin class="h-full" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style>
.isActive {
  @apply bg-orange-600 rounded-lg text-light-600 font-bold hover:opacity-80;
}
</style>

<route lang="js">
{
  "meta": {
    "tab": "market"
  }
}
</route>
