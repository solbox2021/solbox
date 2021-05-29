<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import bx from '@iconify/json/json/bx.json'
import ic from '@iconify/json/json/ic.json'

addCollection(bx)
addCollection(ic)
const { t } = useI18n()
</script>
<template>
  <header class="bg-white shadow-md py-4 z-10 dark:bg-gray-800">
    <div
      class="container flex h-full mx-auto text-primary px-6 items-center justify-between dark:text-primary_light"
    >
      <!-- Mobile hamburger -->
      <button
        class="rounded-md mr-5 -ml-1 p-1 md:hidden focus:outline-none focus:shadow-outline-purple"
        aria-label="Menu"
      >
        <Icon icon="bx:bx-menu" class="h-6 text-current w-6" />
      </button>
      <!-- Search input -->
      <div class="flex flex-1 justify-center">
        <div class="max-w-xl mr-6 w-full relative focus-within:text-primary">
          <div class="flex pl-2 inset-y-0 absolute items-center">
            <Icon icon="ic:outline-search" class="h-4 text-current w-4" />
          </div>
          <input
            class="rounded-md bg-gray-100 border-0 h-8 text-sm w-full pr-2 pl-8 placeholder-gray-600 text-gray-700 dark:focus:shadow-outline-gray focus:bg-white focus:border-primary_light focus:outline-none focus:shadow-outline-purple form-input dark:placeholder-gray-500 dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-500 focus:placeholder-gray-500"
            type="text"
            :placeholder="t('hint.search')"
            aria-label="Search"
          />
        </div>
      </div>
    </div>
  </header>
</template>
