<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { computed, ref } from '@vue/runtime-core'
import { Icon, addCollection } from '@iconify/vue'
import twemoji from '@iconify/json/json/twemoji.json'

export default defineComponent({
  components: { Icon },
  props: {
    walletAssets: {
      type: Number,
      default: 0,
    },
    toBeClaimed: {
      type: Number,
      default: 0,
    },
    lpAssets: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    addCollection(twemoji)
    const { t } = useI18n()
    const totalAssets = computed(() => props.walletAssets + props.toBeClaimed + props.lpAssets)

    return {
      t,
      totalAssets,
    }
  },
})
</script>

<template>
  <div class="bg-gradient-to-br from-white rounded-3xl shadow-md min-h-64 w-full dark:from-gray-700">
    <div class="bg-gradient-to-br flex from-yellow-300 to-yellow-100 rounded-3xl h-42 shadow-lg w-full px-6 items-center">
      <Icon icon="twemoji:coin" class="h-22 mr-6 w-22 hidden lg:block" />
      <div class="mb-2 w-full">
        <p class="font-semibold text-md text-shadow-sm text-white mb-1 uppercase">
          {{ t('dashboard.total-assets') }}
        </p>
        <p class="font-extrabold font-serif text-shadow-lg text-white tracking-tighter text-3xl oldstyle-nums overflow-ellipsis lg:text-4xl md:text-2xl">
          ${{ totalAssets?.toFixed(3) }}
        </p>
      </div>
    </div>
    <div class="mt-5 mb-2 grid px-6 grid-cols-2">
      <div class="flex flex-col mb-2 col-span-2 justify-center lg:col-span-1">
        <p class="font-semibold text-sm text-gray-300 uppercase">
          {{ t('dashboard.wallet') }}
        </p>
        <p class="font-serif text-2xl oldstyle-nums md:text-xl lg:text-2xl">
          ${{ walletAssets.toFixed(3) }}
        </p>
      </div>
      <div class="flex flex-col mb-2 col-span-2 justify-center lg:col-span-1">
        <p class="font-semibold text-sm text-gray-300 uppercase">
          {{ t('dashboard.liquidity-pool') }}
        </p>
        <p class="font-serif text-2xl oldstyle-nums">
          ${{ lpAssets.toFixed(3) }}
        </p>
      </div>
    </div>
  </div>
</template>
