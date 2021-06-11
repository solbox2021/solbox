<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { accountsStore } from '@/store'
import { Icon, addCollection } from '@iconify/vue'
import uil from '@iconify/json/json/uil.json'
import { PublicKey } from '@solana/web3.js'
import { useI18n } from 'vue-i18n'

addCollection(uil)
const { t } = useI18n()

const VALIDATE_HINT = t('manage.valide-hint')
const DUPLICATE_HINT = t('manage.duplicate-msg')

const addrInputError = ref(false)
const addrInputErrorMsg = ref(VALIDATE_HINT)
const inputAddr = ref('')
const inputTag = ref('')

const accounts = accountsStore.getState()

const deleteAccount = function(account: string) {
  const ass = confirm(t('manage.delete-alert'))
  if (ass)
    accountsStore.removeAccount(account)
}

const clickAdd = function() {
  try {
    const validate = new PublicKey(inputAddr.value)
    if (!PublicKey.isOnCurve(validate.toBytes())) {
      addrInputError.value = true
      addrInputErrorMsg.value = VALIDATE_HINT
      return
    }
    const res = accountsStore.addAccount(inputAddr.value, inputTag.value)
    if (!res) {
      addrInputError.value = true
      addrInputErrorMsg.value = DUPLICATE_HINT
      return
    }
    inputAddr.value = ''
    inputTag.value = ''
    addrInputError.value = false
  }
  catch (error) {
    addrInputError.value = true
    addrInputErrorMsg.value = VALIDATE_HINT
  }
}
</script>

<template>
  <div class="container mx-auto px-6">
    <div class="bg-white rounded-2xl shadow-lg mt-6 w-full grid p-6 gap-4 grid-cols-6 dark:bg-gray-800">
      <label class="col-span-6 sm:col-span-3 xl:col-span-4">
        <input
          v-model.trim="inputAddr"
          class="bg-white rounded-lg border-1 w-full p-2 block focus:outline-none focus:shadow-outline-red dark:border-none dark:bg-gray-700"
          :class="addrInputError ? 'border-red-600' : ''"
          type="text"
          :placeholder="t('misc.address')"
          :maxlength="50"
          @input="addrInputError = false"
        >
        <span v-if="addrInputError" class="text-xs text-red-600">{{ addrInputErrorMsg }}</span>
      </label>
      <div class="col-span-6 sm:col-span-2 xl:col-span-1">
        <input
          v-model.trim="inputTag"
          class="bg-white rounded-lg border-1 w-full p-2 block focus:outline-none focus:shadow-outline-red dark:border-none dark:bg-gray-700"
          type="text"
          :maxlength="20"
          :placeholder="t('misc.tag')"
        >
      </div>
      <div class="flex flex-col col-span-6 items-end sm:col-span-1">
        <button
          class="bg-primary rounded-full font-medium h-10 text-white w-full transition-colors duration-150 filter uppercase focus:outline-none focus:shadow-outline-purple active:bg-primary hover:bg-primary_dark drop-shadow-xl hue-rotate-30"
          @click="clickAdd()"
        >
          {{ t('manage.add') }}
        </button>
      </div>
    </div>
    <div class="mt-10 w-full">
      <p class="font-bold text-xl mb-4">
        {{ t('manage.saved') }} ({{ accounts.length }})
      </p>
      <div class="grid gap-4 grid-cols-1">
        <div
          v-for="(account, index) in accounts"
          :key="index"
          class="bg-white rounded-lg shadow-sm grid py-6 px-6 gap-4 grid-cols-6 dark:bg-gray-700"
        >
          <span class="flex font-mono text-center col-span-5 items-center sm:col-span-4">
            <p class="truncate">{{ account.address }}</p>
            <div
              v-clipboard="account.address"
              class="rounded-full text-center p-1 leading-3 inline-block active:bg-blue-200"
            >
              <Icon icon="uil:copy" class="cursor-pointer text-cyan-600" />
            </div>
          </span>

          <div class="hidden sm:block sm:col-span-1">
            <div
              class="rounded-md cursor-default font-semibold max-w-full border-2 border-cyan-400 text-sm py-1 px-2 text-cyan-600 truncate inline-block align-middle"
              :class="account.alias ? '' : 'hidden'"
            >
              {{ account.alias }}
            </div>
          </div>

          <div class="text-right col-span-1">
            <div
              class="bg-white rounded-full cursor-pointer font-semibold border-rose-400 border-2 text-center text-sm w-full max-w-32 py-1 px-2 text-rose-400 focus:outline-none truncate inline-block align-middle hover:bg-rose-200 dark:hover:bg-gray-900 dark:bg-gray-700"
              @click="deleteAccount(account.address)"
            >
              <p class="hidden sm:block">
                {{ t('misc.delete') }}
              </p>
              <Icon icon="uil:trash-alt" class="h-5 w-full block sm:hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="js">
  {
    "meta": {
      "tab": "manage"
    }
  }
</route>
