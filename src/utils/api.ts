import { $axios } from '@baloise/vue-axios'

export type PriceRes = {
  [coin: string]: {
    // price of coin for this currency
    [currency: string]: number
  }
}

export const SIMPLE_PRICE_PATH = '/simple/price'

export const CoinGeckoApi = $axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})
