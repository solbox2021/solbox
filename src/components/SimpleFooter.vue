<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import mdi from '@iconify/json/json/mdi.json'

addCollection(mdi)
const { t } = useI18n()

</script>
<template>
  <footer class="flex flex-row px-6 pt-2 pb-3 items-center justify-between backdrop-filter backdrop-blur-xl">
    <a href="#" class="font-bold text-xl text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"></a>

    <p class="text-sm py-2 text-gray-500 dark:text-white sm:py-0">
      © SolBox - {{ t('misc.right-reserved') }}
    </p>

    <div class="flex -mx-2">
      <a href="#" class="mx-2 text-gray-600 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Github">
        <Icon icon="mdi:github" class="h-5 fill-current w-5" />
      </a>
    </div>
  </footer>
</template>
