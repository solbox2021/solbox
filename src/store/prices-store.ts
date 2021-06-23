import { PriceRes, CoinGeckoApi } from '@/utils/api'
import coinGeckoIds from '@/assets/coingecko.json'
import { CommonTokenList, getCoinGeckoId } from '@/utils/coingecko'
import { Store } from './store'
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
    const geckoId = getCoinGeckoId(coinSymbol)
    if (geckoId) return this.state[geckoId]
    else
      return undefined
  }
}

export const pricesStore: PricesStore = new PricesStore()
