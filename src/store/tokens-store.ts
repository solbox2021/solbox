import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry'
import { Store } from './store'

class TokensStore extends Store<TokenInfo[]> {
  protected data(): TokenInfo[] {
    return []
  }

  protected setup() {
    new TokenListProvider().resolve().then((tokens) => {
      this.state = tokens.filterByChainId(ENV.MainnetBeta).excludeByTag('lp-token').getList()
    })
  }

  refresh() {
    new TokenListProvider().resolve().then((tokens) => {
      this.state = tokens.filterByChainId(ENV.MainnetBeta).excludeByTag('lp-token').getList()
    })
  }

  getTokenInfo(mintAddress: string): TokenInfo | undefined {
    return this.state.find(({ address }) => address === mintAddress)
  }
}

export const tokensStore: TokensStore = new TokensStore()
