<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { defineProps } from '@vue/runtime-core'
import { TokenAccountInfo } from '@/utils/web3'

const { t } = useI18n()

const props = defineProps({
  info: TokenAccountInfo,
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
        {{ info.tokenInfo ? info.amount / 10 ** info.tokenInfo.decimals : '--' }}
      </p>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.balance').toUpperCase() }}
      </p>
    </div>
    <div class="flex flex-col col-span-2 items-end">
      <p class="text-xl text-gray-700 dark:text-gray-200">
        $0
      </p>
      <p class="text-xs text-gray-300 dark:text-gray-600">
        {{ t('dashboard.value').toUpperCase() }}
      </p>
    </div>
  </div>
</template>
