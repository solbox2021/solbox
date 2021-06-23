import coinGeckoIds from '@/assets/coingecko.json'
import { Price, CoinGeckoApi, SIMPLE_PRICE_PATH, PriceRes, Market } from '@/utils/api'
import { TokenInfo } from '@solana/spl-token-registry'

export const CommonTokenList = [
  'SOL',
  'BTC',
  'ETH',
  'FTT',
  'KIN',
  'OXY',
  'RAY',
  'ROPE',
  'SRM',
  'STEP',
  'MER',
  'USDC',
  'USDT',
]

export function getCoinGeckoId(coinSymbol: string | undefined): string | undefined {
  return coinGeckoIds.find(({ symbol }) => (symbol === coinSymbol))?.coinGeckoId
}

export async function fetchPrice(coinSymbol: string | undefined, currency = 'usd'): Promise<Price | undefined> {
  if (!coinSymbol) return undefined
  const id = getCoinGeckoId(coinSymbol)
  if (!id) return undefined
  const resp = await CoinGeckoApi.get<PriceRes>(SIMPLE_PRICE_PATH, {
    params: {
      ids: id,
      vs_currencies: currency,
    },
  })
  return resp.data[id]
}

export const HOT_COIN_MARKET = [
  'SOL',
  'LINK',
  'OXY',
  'SRM',
  'RAY',
  'FTT',
  'FIDA',
  'MER',
  'COPE',
  'ROPE',
  'STEP',
  'MEDIA',
]

export type CoinMarket = {
  info: TokenInfo | undefined
  market: Market | undefined
}

export async function fetchCoinMarket(coinSymbols: string[], currency = 'usd'): Promise<Market[]> {
  if (coinSymbols.length === 0) return []
  const coinIds = coinSymbols.map(value => getCoinGeckoId(value)).filter(value => value).join(',')
  const resp = await CoinGeckoApi.get<Market[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      ids: coinIds,
      order: 'market_cap_desc',
      sparkline: false,
      price_change_percentage: '1h,24h,7d',
    },
  })
  return resp.data
}
