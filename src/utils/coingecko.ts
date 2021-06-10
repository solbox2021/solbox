import coinGeckoIds from '@/assets/coingecko.json'
import { Price, CoinGeckoApi, SIMPLE_PRICE_PATH, PriceRes } from '@/utils/api'

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
