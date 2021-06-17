import { $axios } from '@baloise/vue-axios'

export type Price = {
  [currency: string]: number
}

export type PriceRes = {
  [coin: string]: Price
}

export type Market = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_24h_in_currency: number
  price_change_percentage_1h_in_currency: number
  price_change_percentage_7d_in_currency: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: Date
  atl: number
  atl_change_percentage: number
  atl_date: Date
  roi: number
  last_updated: Date
  sparkline_in_7d: {
    price: number[]
  }
}

export const SIMPLE_PRICE_PATH = '/simple/price'

export const CoinGeckoApi = $axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})
