<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import twemoji from '@iconify/json/json/twemoji.json'

addCollection(twemoji)
const { t } = useI18n()
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="flex flex-col h-full -mt-8 items-center justify-center">
      <div class="h-54 w-full">
        <Icon icon="twemoji:ringed-planet" class="h-54 w-full" />
      </div>
      <div class="font-bold font-sans mx-auto mt-6 text-center tracking-widest w-full text-7xl uppercase subpixel-antialiased">
        <p>{{ t('misc.coming') }}</p>
      </div>
      <div class="mt-2 text-lg text-center">
        <p>{{ t('misc.coming-desc') }}</p>
      </div>
    </div>
  </div>
</template>

<route lang="js">
{
  "meta": {
    "tab": "arbitrage"
  }
}
</route>
