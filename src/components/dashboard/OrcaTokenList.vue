<script lang="ts">
import { computed, defineEmit, Ref, watch } from '@vue/runtime-core'
import { PoolRes } from '@/utils/orca'
import { PropType } from 'vue'
</script>
<script setup lang="ts">
import { defineProps, getCurrentInstance, ref } from 'vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { getMultiTokenAccounts, TokenAccountInfo } from '@/utils/web3'
import { getOrcaPoolByMintAddress, OrcaTokenAccountInfo, getOrcaPools } from '@/utils/orca'
import OrcaTokenItem from '@/components/dashboard/OrcaTokenItem.vue'

const props = defineProps({
  wallets: Array as PropType<PublicKey[]>,
})

const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
const getAllTokenAccounts = async function(addresses: PublicKey[]) {
  allTokensAccounts.value = await getMultiTokenAccounts(connection, addresses)
}

const orcaPools: Ref<PoolRes> = ref({})
const getAllOrcaPools = async function() {
  orcaPools.value = await getOrcaPools()
}

watch(() => props.wallets, (value, oldValue) => {
  if(value && value.length > 0) {
    getAllTokenAccounts(value)
    getAllOrcaPools()
  }
}, { immediate: true })

const orcaTokens = computed(() => {
  const orcaMints = Object.keys(orcaPools.value).map((key) => orcaPools.value[key].poolTokenMint)
  const tokens = allTokensAccounts.value
    .filter(({mint, amount}) => orcaMints.some((value) => value == mint.toString()) && amount > 0)
  const pools = tokens.map((tokenAccountInfo) => {
    const info = getOrcaPoolByMintAddress(orcaPools.value, tokenAccountInfo.mint.toString())
    return new OrcaTokenAccountInfo(tokenAccountInfo, info)
  })
  return pools
})
</script>

<template>
  <div v-if="orcaTokens.length > 0" class="pt-6">
    <div class="mb-4">
      <p class="font-bold text-2xl">
        ORCA
      </p>
    </div>
    <OrcaTokenItem v-for="(info, index) in orcaTokens" :key="index" :info="info" />
  </div>
</template>
