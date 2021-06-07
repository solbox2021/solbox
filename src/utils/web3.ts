import { TokenInfo } from '@solana/spl-token-registry'
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js'
import { tokensStore } from '@/store'
import { TOKEN_PROGRAM_ID, SOL_MINT_ADDRESS } from './ids'
import { ACCOUNT_LAYOUT } from './layouts'

export class TokenAccountInfo extends Object {
  pubkey: PublicKey
  mint: PublicKey
  owner: PublicKey
  amount: number
  tokenInfo?: TokenInfo

  constructor(pubkey: PublicKey, mint: PublicKey, owner: PublicKey, amount: number, tokenInfo?: TokenInfo) {
    super()
    this.pubkey = pubkey
    this.mint = mint
    this.owner = owner
    this.amount = amount
    this.tokenInfo = tokenInfo
  }
}

/**
 * get multi accounts' token accounts
 * @param connection web3 connection
 * @param wallets accounts' public key
 */
export async function getMultiTokenAccounts(connection: Connection, wallets: PublicKey[]): Promise<TokenAccountInfo[]> {
  const requests = wallets.map(value => connection.getTokenAccountsByOwner(value, { programId: TOKEN_PROGRAM_ID }))
  const resp = await Promise.all(requests)
  const all: { pubkey: PublicKey; account: AccountInfo<Buffer> }[] = []
  for (let index = 0; index < resp.length; index++)
    all.push(...resp[index].value)
  return all.map(({ pubkey, account: { data } }) => new TokenAccountInfo(
    pubkey,
    ACCOUNT_LAYOUT.decode(data).mint,
    ACCOUNT_LAYOUT.decode(data).owner,
    ACCOUNT_LAYOUT.decode(data).amount.toNumber(),
  ))
}

/**
 * get multi accounts' SOL balance
 * @param connection web3 connection
 * @param wallets accounts' public key
 */
export async function getMultiBalance(connection: Connection, wallets: PublicKey[]): Promise<TokenAccountInfo[]> {
  const requests = wallets.map(value => connection.getBalance(value, 'confirmed'))
  const resp = await Promise.all(requests)
  return resp.map((value, index) => new TokenAccountInfo(
    wallets[index],
    new PublicKey(SOL_MINT_ADDRESS),
    wallets[index],
    value,
    tokensStore.getTokenInfo(SOL_MINT_ADDRESS),
  ))
}
