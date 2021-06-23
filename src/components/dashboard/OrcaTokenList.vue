<script lang="ts">
import { defineComponent, PropType, computed, defineEmit, onActivated, onBeforeUpdate, onMounted, onUpdated, Ref, watch, getCurrentInstance, ref } from 'vue'
import { PoolRes, getOrcaPoolByMintAddress, OrcaTokenAccountInfo, getOrcaPools } from '@/utils/orca'
import { Connection, PublicKey } from '@solana/web3.js'
import { getMultiTokenAccounts, TokenAccountInfo } from '@/utils/web3'
import OrcaTokenItem from '@/components/dashboard/OrcaTokenItem.vue'

export default defineComponent({
  components: { OrcaTokenItem },
  props: {
    wallets: {
      type: Array as PropType<PublicKey[]>,
      default: undefined,
    },
  },
  emits: ['listValue'],
  setup(props, { emit }) {
    const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

    const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
    const getAllTokenAccounts = async function(addresses: PublicKey[]) {
      allTokensAccounts.value = await getMultiTokenAccounts(connection, addresses)
    }

    const orcaPools: Ref<PoolRes> = ref({})
    const getAllOrcaPools = async function() {
      orcaPools.value = await getOrcaPools()
    }

    const orcaTokens = computed(() => {
      const orcaMints = Object.keys(orcaPools.value).map(key => orcaPools.value[key].poolTokenMint)
      const tokens = allTokensAccounts.value
        .filter(({ mint, amount }) => orcaMints.includes(mint.toString()) && amount > 0)
      const pools = tokens.map((tokenAccountInfo) => {
        const info = getOrcaPoolByMintAddress(orcaPools.value, tokenAccountInfo.mint.toString())
        return new OrcaTokenAccountInfo(tokenAccountInfo, info)
      })
      return pools
    })

    const poolValues: Ref<number[]> = ref([])
    const receiveUpdatedValue = function(index: number, value: number) {
      poolValues.value[index] = value
    }
    const orcaValue = computed(() => poolValues.value.length > 0 ? poolValues.value.reduce((previous, current) => previous + current) : 0)

    watch(orcaValue, (newValue, oldValue) => {
      emit('listValue', newValue)
    })

    watch(() => props.wallets, (value, oldValue) => {
      poolValues.value = []
      allTokensAccounts.value = []
      if (value && value.length > 0) {
        getAllTokenAccounts(value)
        getAllOrcaPools()
      }
    }, { immediate: true })

    return {
      orcaTokens,
      receiveUpdatedValue,
    }
  },
})
</script>

<template>
  <div v-if="orcaTokens.length > 0" class="pt-6">
    <div class="flex mb-4 items-center">
      <img src="https://www.orca.so/static/media/logomark.1ef55f8f.svg" class="h-6 w-6">
      <p class="font-bold ml-2 text-2xl">
        ORCA
      </p>
    </div>
    <OrcaTokenItem v-for="(info, index) in orcaTokens" :key="index" :info="info" @pool-value="receiveUpdatedValue(index, $event)" />
  </div>
</template>
