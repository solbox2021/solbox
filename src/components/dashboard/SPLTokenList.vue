<script lang="ts">
import { defineComponent, PropType, computed, defineEmit, Ref, watch } from 'vue'
import { getCurrentInstance, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import { Connection, PublicKey } from '@solana/web3.js'
import { getMultiTokenAccounts, getMultiBalance, TokenAccountInfo } from '@/utils/web3'
import { tokensStore } from '@/store'
import SPLTokenItem from '@/components/dashboard/SPLTokenItem.vue'
import { getCoinGeckoId } from '@/utils/coingecko'
import { PriceManager } from '@/store/prices-manager'

export default defineComponent({
  components: { SPLTokenItem },
  props: {
    wallets: {
      type: Array as PropType<PublicKey[]>,
      default: undefined,
    },
  },
  emits: ['listValue'],
  setup(props, { emit }) {
    const { t } = useI18n()

    const connection: Connection = getCurrentInstance()?.appContext.config.globalProperties.$web3

    const allTokensAccounts: Ref<TokenAccountInfo[]> = ref([])
    const getAllTokenAccounts = async function(addresses: PublicKey[]) {
      allTokensAccounts.value = await getMultiTokenAccounts(connection, addresses)
    }

    const solAccounts: Ref<TokenAccountInfo[]> = ref([])
    const getSolBalance = async function(addresses: PublicKey[]) {
      solAccounts.value = await getMultiBalance(connection, addresses)
    }

    const walletTokens = computed(() => {
      const tokens = allTokensAccounts.value
        .filter(({ mint }) => (tokensStore.getTokenInfo(mint.toString()) !== undefined))
        .filter(({ amount }) => amount > 0)
        .map(({ pubkey, mint, owner, amount }) => new TokenAccountInfo(
          pubkey,
          mint,
          owner,
          amount,
          tokensStore.getTokenInfo(mint.toString()),
        ))
        .sort((a, b) => (a.tokenInfo!.symbol > b.tokenInfo!.symbol ? 1 : -1))
      tokens.unshift(...solAccounts.value)
      return tokens
    })

    // update all tokens price
    watch(allTokensAccounts, (newValue, oldValue) => {
      if (newValue.length > 0) {
        const tokens = newValue
          .filter(({ mint }) => (tokensStore.getTokenInfo(mint.toString()) !== undefined))
          .filter(({ amount }) => amount > 0)
          .map(({ mint }) => tokensStore.getTokenInfo(mint.toString())?.symbol)
        const symbols: string[] = []
        tokens.forEach((s) => {
          if (s && !symbols.includes(s)) symbols.push(s)
        })
        if (!symbols.includes('SOL')) symbols.push('SOL')
        PriceManager.update(symbols)
      }
    })

    const tokenValues: Ref<number[]> = ref([])
    const receiveUpdatedValue = function(index: number, value: number) {
      tokenValues.value[index] = value
    }
    const totalValue = computed(() => tokenValues.value.length > 0 ? tokenValues.value.reduce((previous, current) => previous + current) : 0)
    watch(totalValue, (newValue, oldValue) => {
      emit('listValue', newValue)
    })

    watch(() => props.wallets, (value, oldValue) => {
      allTokensAccounts.value = []
      solAccounts.value = []
      tokenValues.value = []
      if (value && value.length > 0) {
        getSolBalance(value)
        getAllTokenAccounts(value)
      }
    }, { immediate: true })

    return {
      t,
      walletTokens,
      tokenValues,
      receiveUpdatedValue,
    }
  },
})
</script>

<template>
  <SPLTokenItem v-for="(data, index) in walletTokens" :key="index" :info="data" @token-value="receiveUpdatedValue(index, $event)" />
</template>
