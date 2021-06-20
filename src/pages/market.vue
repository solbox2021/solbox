<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CoinMarketTable from '@/components/market/CoinMarketTable.vue'
import SearchCoin from '@/components/market/SearchCoin.vue'
import { Dialog, DialogOverlay, DialogTitle } from '@headlessui/vue'
import { ref } from 'vue'

const { t } = useI18n()

const dialogOpen = ref(false)
const setDialogOpen = function(v: boolean) {
  dialogOpen.value = v
}
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="font-bold my-6 text-4xl" @click="setDialogOpen(true)">
      Coins
    </div>
    <CoinMarketTable />
  </div>
  <Dialog :open="dialogOpen" class="inset-0 z-20 fixed overflow-y-auto" @close="setDialogOpen">
    <div class="min-h-screen">
      <DialogOverlay class="bg-black opacity-40 inset-0 fixed" />
      <div class="bg-white rounded-xl mx-auto max-w-screen-lg h-2/3 my-24 p-6 inset-x-0 w-5/6 z-10 center fixed md:w-2/3 dark:(bg-gray-800)">
        <SearchCoin class="h-full" />
      </div>
    </div>
  </Dialog>
</template>

<route lang="js">
{
  "meta": {
    "tab": "market"
  }
}
</route>
