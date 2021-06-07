<script lang="ts">
import { PropType } from 'vue'
</script>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { accountsStore } from "@/store";

const { t } = useI18n()

</script>

<template>
  <div class="bg-gradient-to-br from-white cursor-default flex flex-col rounded-3xl shadow-md min-h-48 w-full dark:from-gray-700">
    <div class="bg-gradient-to-r rounded-full flex-none from-cyan-500 to-cyan-200 shadow-inner my-2 mx-2 text-center py-2 hover:bg-violet-100">
      <p class="font-bold text-white uppercase">
        {{ t('dashboard.accounts') }}
      </p>
    </div>
    <ul class="divide-y flex-grow flex-shrink mx-3 overflow-auto dark:divide-gray-600 sm:max-h-63 lg:max-h-48">
      <li v-for="(account, index) in accountsStore.getState()" :key="index" class="flex flex-row py-1 justify-between items-center">
        <div class="rounded-lg cursor-pointer flex-shrink font-mono text-sm mr-2 py-2 px-1 truncate hover:bg-gray-100 dark:hover:bg-gray-600">
          {{ account.address }}
        </div>
        <div class="rounded-lg cursor-default flex-none border-2 border-cyan-400 text-center py-1 px-2 w-22">
          <p class="text-sm text-cyan-400 truncate">
            {{ account.alias }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
