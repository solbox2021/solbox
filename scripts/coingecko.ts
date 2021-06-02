import fs from 'fs/promises'
import { CoinGeckoClient } from 'coingecko-api-v3'
import { TokenListProvider, ENV } from '@solana/spl-token-registry'

async function main() {
  const client = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
  })
  const allCoinGeckoList = await client.coinList({})
  console.log(`CoinGecko list size: ${allCoinGeckoList.length}`)

  const splTokenProvider = new TokenListProvider()

  const container = await splTokenProvider.resolve()

  const splTokenList = container.filterByChainId(ENV.MainnetBeta).getList()
  console.log(`SPLToken list size: ${splTokenList.length}`)

  const infos = []
  for (const spl of splTokenList) {
    const coinGeckoInfo = allCoinGeckoList.find(({ symbol }) => spl.symbol.toLowerCase() === symbol?.toLowerCase())
    if (coinGeckoInfo) {
      const info = {
        symbol: spl.symbol,
        coinGeckoId: coinGeckoInfo?.id,
        address: spl.address,
        name: spl.name,
        decimals: spl.decimals,
        logoURI: spl.logoURI,
      }
      infos.push(info)
    }
  }
  console.log(`get CoinGecko info num: ${infos.length}`)
  const outStr = JSON.stringify(infos, null, '\t')
  await fs.writeFile('../src/assets/coingecko.json', outStr)
  console.log('save success')
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err)
    process.exit(-1)
  },
)
