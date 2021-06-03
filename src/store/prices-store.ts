import { PriceRes, CoinGeckoApi } from '@/utils/api'
import coinGeckoIds from '@/assets/coingecko.json'
import { Store } from './store'

const CommonTokenList = [
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

class PricesStore extends Store<PriceRes> {
  protected data(): PriceRes {
    return {}
  }

  protected setup() {
    const commonIds = coinGeckoIds.filter(({ symbol }) => CommonTokenList.includes(symbol))
      .map(({ coinGeckoId }) => (coinGeckoId))
      .join(',')
    CoinGeckoApi
      .get<PriceRes>('/simple/price', {
      params: {
        ids: commonIds,
        vs_currencies: 'usd',
      },
    })
      .then((response) => {
        this.state = response.data
      })
  }

  getPrice(coinSymbol: string | undefined) {
    const geckoId = coinGeckoIds.find(({ symbol }) => (symbol === coinSymbol))?.coinGeckoId
    if (geckoId) return this.state[geckoId]
    else
      return undefined
  }

  getCoinGeckoId(coinSymbol: string | undefined): string | undefined {
    return coinGeckoIds.find(({ symbol }) => (symbol === coinSymbol))?.coinGeckoId
  }
}

export const pricesStore: PricesStore = new PricesStore()
