import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js'
import { Octokit } from '@octokit/rest'
import { getMultiParsedAccountInfo, TokenAccountInfo } from './web3'

export interface OrcaAmountInfo {
  amount: number
  decimal: number
  mint: string
}

export type PoolInfo = {
  account: string
  authority: string
  nonce: number
  poolTokenMint: string
  tokenAccountA: string
  tokenAccountB: string
  feeAccount: string
  feeNumerator: number
  feeDenominator: number
  ownerTradeFeeNumerator: number
  ownerTradeFeeDenominator: number
  ownerWithdrawFeeNumerator: number
  ownerWithdrawFeeDenominator: number
  hostFeeNumerator: number
  hostFeeDenominator: number
  tokenAName: string
  tokenBName: string
  curveType: string
}

export type PoolRes = {
  [pair: string]: PoolInfo
}

export class OrcaTokenAccountInfo extends TokenAccountInfo {
  poolInfo?: PoolInfo

  constructor(info: TokenAccountInfo, pool?: PoolInfo) {
    super(info.pubkey, info.mint, info.owner, info.amount)
    this.poolInfo = pool
  }
}

export async function getOrcaPools(): Promise<PoolRes> {
  const octokit = new Octokit()
  const res = await octokit.gists.get({ gist_id: 'f7c3a35289f99d2bf97e43636e369a5d' })
  const data = res.data.files
  if (data && data['pools.json']?.content)
    return JSON.parse(data['pools.json']?.content)
  else
    return {}
}

export function getOrcaPoolByMintAddress(pools: PoolRes, mintAddress: string): PoolInfo | undefined {
  const keys = Object.keys(pools)
  for (let index = 0; index < keys.length; index++) {
    const name = keys[index]
    if (pools[name].poolTokenMint === mintAddress)
      return pools[name]
  }
  return undefined
}

export async function getOrcaAmountInfo(connection: Connection, tokenMints: string[]): Promise<OrcaAmountInfo[]> {
  const tokenMintWallets = tokenMints.map(value => new PublicKey(value))
  const resp = await getMultiParsedAccountInfo(connection, tokenMintWallets)
  const info: OrcaAmountInfo[] = []
  for (let index = 0; index < resp.length; index++) {
    const result = (resp[index] as ParsedAccountData).parsed
    info.push({
      amount: Number(result.info.tokenAmount.amount),
      decimal: result.info.tokenAmount.decimals,
      mint: result.info.mint,
    })
  }
  return info
}
