<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CoinMarket from '@/components/market/CoinMarket.vue'

const { t } = useI18n()
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="font-bold my-6 text-4xl">
      Coins
    </div>
    <CoinMarket />
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "market"
  }
}
</route>
