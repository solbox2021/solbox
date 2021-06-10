import { $axios } from '@baloise/vue-axios'

export type Price = {
  [currency: string]: number
}

export type PriceRes = {
  [coin: string]: Price
}

export const SIMPLE_PRICE_PATH = '/simple/price'

export const CoinGeckoApi = $axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})
