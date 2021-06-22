<script lang="ts">
import { defineProps, PropType } from 'vue'
</script>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { accountsStore } from "@/store";
import { PublicKey } from '@solana/web3.js';
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()

const props = defineProps({
  wallets: Array as PropType<PublicKey[]>,
})

const copySuccess = () => {
  toast.success(t('hint.copy-success'))
}
</script>

<template>
  <div class="bg-gradient-to-br from-white cursor-default flex flex-col rounded-3xl shadow-md min-h-48 w-full dark:from-gray-700">
    <div class="bg-gradient-to-r rounded-full flex-none from-cyan-500 to-cyan-200 shadow-inner my-2 mx-2 text-center py-2 hover:bg-violet-100">
      <p class="font-bold text-white uppercase">
        {{ t('dashboard.accounts') }}
      </p>
    </div>
    <div
      v-if=" wallets == undefined && accountsStore.getState().length == 0 "
      class="font-semibold mt-6 text-center text-gray-500 dark:text-gray-400"
    >
      {{ t('hint.no-accounts') }}
    </div>
    <ul v-if="wallets && wallets.length > 0" class="divide-y flex-grow flex-shrink mx-3 overflow-auto dark:divide-gray-600 sm:max-h-63 lg:max-h-48">
      <li v-for="(account, index) in wallets" :key="index" class="flex flex-row py-1 justify-between items-center">
        <div
          v-clipboard:copy="account.toString()"
          v-clipboard:success="copySuccess"
          class="rounded-lg cursor-pointer flex-shrink font-mono text-sm mr-2 py-2 px-1 truncate hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          {{ account.toString() }}
        </div>
        <div
          class="rounded-lg cursor-default flex-none border-2 border-cyan-400 text-center py-1 px-2 w-22 hidden"
        >
          <p class="text-sm text-cyan-400 truncate">
            Add
          </p>
        </div>
      </li>
    </ul>
    <ul v-else class="divide-y flex-grow flex-shrink mx-3 overflow-auto dark:divide-gray-600 sm:max-h-63 lg:max-h-48">
      <li v-for="(account, index) in accountsStore.getState()" :key="index" class="flex flex-row py-1 justify-between items-center">
        <div
          v-clipboard:copy="account.address"
          v-clipboard:success="copySuccess"
          class="rounded-lg cursor-pointer flex-shrink font-mono text-sm mr-2 py-2 px-1 truncate hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          {{ account.address }}
        </div>
        <div
          class="rounded-lg cursor-default flex-none border-2 border-cyan-400 text-center py-1 px-2 w-22"
          :class="account.alias ? '' : 'hidden'"
        >
          <p class="text-sm text-cyan-400 truncate">
            {{ account.alias }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
