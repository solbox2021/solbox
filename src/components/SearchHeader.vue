<script lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import { useI18n } from 'vue-i18n'
import { Icon, addCollection } from '@iconify/vue'
import bx from '@iconify/json/json/bx.json'
import ic from '@iconify/json/json/ic.json'
import cil from '@iconify/json/json/cil.json'
import ri from '@iconify/json/json/ri.json'
import maj from '@iconify/json/json/majesticons.json'
import uil from '@iconify/json/json/uil.json'
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import { isDark, toggleDark } from '@/utils'

export default defineComponent({
  components: {
    Icon,
    TransitionRoot,
  },
  setup() {
    addCollection(bx)
    addCollection(ic)
    addCollection(cil)
    const { t, availableLocales, locale } = useI18n()
    const router = useRouter()

    const search = ref('')

    const goSearch = function() {
      router.push(`/dashboard/${search.value}`)
      search.value = ''
    }

    const toggleLocales = () => {
      const locales = availableLocales
      locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
    }

    const showMenu = ref(false)

    return {
      t,
      isDark,
      toggleDark,
      router,
      search,
      goSearch,
      toggleLocales,
      showMenu,
    }
  },
})
</script>
<template>
  <header class="bg-white shadow-md py-4 z-19 dark:bg-gray-800">
    <div
      class="container flex h-full mx-auto text-primary px-6 items-center justify-between dark:text-primary_light"
    >
      <!-- Mobile hamburger -->
      <div class="mr-5 -ml-1 focus:outline-none md:hidden" @click="showMenu = !showMenu">
        <div
          class="rounded-md p-1 leading-3 active:bg-primary_light dark:active:bg-primary_dark focus:outline-none active:outline-none"
          aria-label="Menu"
        >
          <Icon icon="bx:bx-menu" class="h-6 w-6" />
        </div>
      </div>
      <!-- Dropdown Menu -->
      <TransitionRoot
        :show="showMenu"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="bg-black opacity-40 top-16 right-0 bottom-0 left-0 fixed"
          @click="showMenu = !showMenu"
        >
        </div>
        <div class="bg-white mt-3.5 w-full top-12 left-0 z-10 fixed dark:bg-gray-800">
          <ul class="w-full text-gray-700 dark:text-gray-300">
            <li class="cursor-pointer w-full py-3 px-6 relative hover:bg-gray-100 dark:hover:bg-gray-700" @click="router.push('/dashboard');showMenu = !showMenu">
              <div
                class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
                :class="router.currentRoute.value.meta.tab == 'dashboard' ? 'text-primary' : ''"
              >
                <Icon icon="majesticons:dashboard-line" class="h-5 text-current w-5" />
                <span class="ml-4">{{ t('tab.dashboard') }}</span>
              </div>
            </li>
            <li class="cursor-pointer py-3 px-6 relative hover:bg-gray-100 dark:hover:bg-gray-700" @click="router.push('/market');showMenu = !showMenu">
              <a
                class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
                :class="router.currentRoute.value.meta.tab == 'market' ? 'text-primary' : ''"
              >
                <Icon icon="ri:stock-line" class="h-5 text-current w-5" />
                <span class="ml-4">{{ t('tab.market') }}</span>
              </a>
            </li>
            <li class="cursor-pointer py-3 px-6 relative hover:bg-gray-100 dark:hover:bg-gray-700" @click="router.push('/arbitrage');showMenu = !showMenu">
              <a
                class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
                :class="router.currentRoute.value.meta.tab == 'arbitrage' ? 'text-primary' : ''"
              >
                <Icon icon="cil:spreadsheet" class="h-5 text-current w-5" />
                <span class="ml-4">{{ t('tab.arbitrage') }}</span>
              </a>
            </li>
          </ul>
          <div class="my-4 px-6">
            <button
              class="bg-primary rounded-lg flex font-medium text-sm text-white w-full py-2 px-4 transition-colors ring-violet-200 leading-6 duration-150 items-center justify-between active:bg-primary hover:bg-primary_dark focus:outline-none focus:shadow-outline-purple"
              :class="router.currentRoute.value.meta.tab == 'manage' ? 'ring-3' : ''"
              @click="router.push('/manage');showMenu = !showMenu"
            >
              {{ t('tab.manage') }}
              <span class="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </TransitionRoot>
      <!-- Search input -->
      <div class="flex flex-1 justify-center">
        <div class="max-w-xl mr-4 w-full relative focus-within:text-primary">
          <div class="flex pl-2 inset-y-0 absolute items-center">
            <Icon icon="ic:outline-search" class="h-4 text-current w-4" />
          </div>
          <input
            v-model.trim="search"
            class="rounded-md bg-gray-100 h-8 text-sm w-full pr-2 pl-8 placeholder-gray-600 text-gray-700 form-input focus:bg-white focus:border-primary_light focus:outline-none focus:border-3 focus:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:placeholder-gray-600"
            type="text"
            :placeholder="t('hint.search')"
            aria-label="Search"
            @keyup.enter="goSearch"
          />
        </div>
      </div>

      <div class="flex gap-2 justify-center md:hidden">
        <a class="rounded-lg flex-none h-7 p-1 icon-btn active:bg-gray-400" :title="t('button.toggle_dark')" @click="toggleDark">
          <Icon :icon="isDark ? 'uil:sun' : 'uil:moon'" class="h-5 text-primary w-5 dark:text-primary_light" />
        </a>
        <a class="rounded-lg flex-none h-7 p-1 icon-btn active:bg-gray-400" :title="t('button.toggle_langs')" @click="toggleLocales">
          <Icon icon="uil:english-to-chinese" class="h-5 text-primary w-5 dark:text-primary_light" />
        </a>
      </div>
    </div>
  </header>
</template>
