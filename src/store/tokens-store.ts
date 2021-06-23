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

  async getTokenInfos(symbols: string[]): Promise<TokenInfo[]> {
    let allTokens: TokenInfo[] = []
    if (this.state.length === 0)
      allTokens = (await new TokenListProvider().resolve()).filterByChainId(ENV.MainnetBeta).excludeByTag('lp-token').getList()
    else
      allTokens = this.state
    return (symbols.map(sb => allTokens.find(({ symbol }) => symbol === sb)).filter(value => value)) as TokenInfo[]
  }
}

export const tokensStore: TokensStore = new TokensStore()
