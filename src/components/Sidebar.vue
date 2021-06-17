<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Switch } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { isDark } from '@/utils'
import { Icon, addCollection } from '@iconify/vue'
import ri from '@iconify/json/json/ri.json'
import maj from '@iconify/json/json/majesticons.json'
import uil from '@iconify/json/json/uil.json'
import foundation from '@iconify/json/json/foundation.json'

addCollection(ri)
addCollection(maj)
addCollection(uil)
addCollection(foundation)

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}

const router = useRouter()

</script>

<!-- Desktop sidebar -->
<template>
  <aside class="bg-white flex-shrink-0 w-64 z-20 hidden overflow-y-auto md:block dark:bg-gray-800">
    <div class="py-4 text-gray-500 dark:text-gray-400">
      <a class="font-bold text-lg text-left ml-6 text-gray-800 dark:text-gray-200" href="#">
        SolBox
      </a>
      <ul class="mt-6">
        <li class="cursor-pointer py-3 px-6 relative hover:text-gray-800 dark:hover:text-gray-200" @click="router.push('/dashboard')">
          <span
            v-if="router.currentRoute.value.meta.tab == 'dashboard'"
            class="bg-primary rounded-tr-lg rounded-br-lg inset-y-0 left-0 w-1 absolute"
            aria-hidden="true"
          ></span>
          <div
            class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
            :class="router.currentRoute.value.meta.tab == 'dashboard' ? 'text-gray-800 dark:text-gray-100' : ''"
          >
            <Icon icon="majesticons:dashboard-line" class="h-5 text-current w-5" />
            <span class="ml-4">{{ t('tab.dashboard') }}</span>
          </div>
        </li>
        <li class="cursor-pointer py-3 px-6 relative hover:text-gray-800 dark:hover:text-gray-200" @click="router.push('/market')">
          <span
            v-if="router.currentRoute.value.meta.tab == 'market'"
            class="bg-primary rounded-tr-lg rounded-br-lg inset-y-0 left-0 w-1 absolute"
            aria-hidden="true"
          ></span>
          <a
            class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
            :class="router.currentRoute.value.meta.tab == 'market' ? 'text-gray-800 dark:text-gray-100' : ''"
          >
            <Icon icon="foundation:graph-trend" class="h-5 text-current w-5" />
            <span class="ml-4">{{ t('tab.market') }}</span>
          </a>
        </li>
        <li class="cursor-pointer py-3 px-6 relative hover:text-gray-800 dark:hover:text-gray-200" @click="router.push('/dapps')">
          <span
            v-if="router.currentRoute.value.meta.tab == 'dapps'"
            class="bg-primary rounded-tr-lg rounded-br-lg inset-y-0 left-0 w-1 absolute"
            aria-hidden="true"
          ></span>
          <a
            class="font-semibold text-sm w-full transition-colors duration-150 inline-flex items-center"
            :class="router.currentRoute.value.meta.tab == 'dapps' ? 'text-gray-800 dark:text-gray-100' : ''"
          >
            <Icon icon="ri:apps-line" class="h-5 text-current w-5" />
            <span class="ml-4">{{ t('tab.dapps') }}</span>
          </a>
        </li>
      </ul>
      <div class="my-6 px-6">
        <button
          class="bg-primary rounded-lg flex font-medium text-sm text-white w-full py-2 px-4 transition-colors ring-violet-200 leading-5 duration-150 items-center justify-between active:bg-primary hover:bg-primary_dark focus:outline-none focus:shadow-outline-purple"
          :class="router.currentRoute.value.meta.tab == 'manage' ? 'ring-3' : ''"
          @click="router.push('/manage')"
        >
          {{ t('tab.manage') }}
          <span class="ml-2" aria-hidden="true">+</span>
        </button>
      </div>
      <div class="flex px-6 bottom-6 w-64 items-center absolute">
        <Switch
          v-model="isDark"
          :class="isDark ? 'bg-primary' : 'bg-gray-100'"
          class="border-transparent rounded-full cursor-pointer flex-none border-2 flex-shrink-0 h-5 transition-colors ease-in-out w-10 duration-200 relative inline-flex focus:outline-none focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75"
        >
          <span
            aria-hidden="true"
            :class="isDark ? 'translate-x-5' : 'translate-x-0'"
            class="bg-primary_light rounded-full h-4 shadow-lg transform transition ease-in-out ring-0 w-4 duration-200 pointer-events-none inline-block"
          />
        </Switch>
        <p class="flex-grow text-sm ml-2">
          {{ t('button.toggle_dark') }}
        </p>
        <a class="flex-none icon-btn" :title="t('button.toggle_langs')" @click="toggleLocales">
          <Icon icon="uil:english-to-chinese" class="h-5 text-primary w-5 dark:text-primary_light" />
        </a>
      </div>
    </div>
  </aside>
</template>
