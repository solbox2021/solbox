import { Price } from '@/utils/api'
import { reactive } from 'vue'
import { CommonTokenList, fetchPrices, getSymbolWithId } from '@/utils/coingecko'

export type SimplePrice = {
  symbol: string | undefined
  coinId: string | undefined
  price: Price | undefined
}

export const PriceManager = {
  state: reactive({
    prices: [] as SimplePrice[],
  }),
  tokens: reactive<string[]>(CommonTokenList),
  update(coinSymbols: string[]) {
    coinSymbols.forEach((s) => {
      if (!this.tokens.includes(s.toUpperCase())) this.tokens.push(s.toUpperCase())
    })
    fetchPrices(this.tokens).then((res) => {
      const keys = Object.keys(res)
      const prices: SimplePrice[] = keys.map((key) => {
        return {
          symbol: getSymbolWithId(key),
          coinId: key,
          price: res[key],
        }
      })
      this.state.prices = prices
    })
  },
}
