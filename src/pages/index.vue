<script lang="ts">
import { PublicKey } from '@solana/web3.js'
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import ic from '@iconify/json/json/ic.json'
import { defineComponent } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { Icon },
  layout: 'index-layout',
  setup() {
    addCollection(ic)
    const { t, availableLocales, locale } = useI18n()
    const toggleLocales = () => {
      const locales = availableLocales
      locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
    }
    const router = useRouter()
    return {
      t,
      toggleLocales,
      router,
    }
  },
})
</script>

<template>
  <div class="bg-blend-darken bg-no-repeat bg-cover flex flex-col py-6 home">
    <div class="flex flex-none px-4 items-center justify-between md:px-24 sm:px-12">
      <div class="flex items-center">
        <img
          src="@/assets/images/solbox.png"
          class="h-24 w-24"
        >
        <p class="font-sans font-extrabold text-light-300 text-3xl">
          SolBox
        </p>
      </div>
      <div
        class="cursor-pointer flex transition-opacity text-light-900 justify-end items-center focus:outline-none hover:opacity-80"
        @click="toggleLocales"
      >
        <Icon icon="ic:baseline-language" class="mr-2" />
        English/中文
      </div>
    </div>
    <div class="flex-auto flex flex-col px-8 justify-center md:px-24 sm:px-12">
      <p class="font-extrabold text-white text-4xl uppercase sm:text-6xl">
        {{ t('index.title') }}
      </p>
      <p class="font-semibold mt-2 text-lg opacity-80 text-light-900 sm:text-xl">
        {{ t('index.subtitle') }}
      </p>
      <button
        class="rounded-md font-bold bg-purple-600 h-12 mt-16 text-white transition-opacity w-36 duration-200 uppercase focus:outline-none hover:opacity-80"
        @click="router.push('/dashboard')"
      >
        {{ t('index.launch') }}
      </button>
    </div>
    <div class="flex flex-none px-6 items-center justify-end md:px-24">
      <p class="mr-2 text-light-300">
        {{ t('index.built-on') }}
      </p>
      <img src="@/assets/images/solana-logo-horizontal.png" class="h-6">
    </div>
  </div>
</template>

<style>
.home {
  background-image: url('~@/assets/images/index-bg.png'), linear-gradient(rgb(0, 0, 0, 0.6), rgb(0, 0, 0, 0.3), rgb(0, 0, 0, 0.6));
}
</style>
