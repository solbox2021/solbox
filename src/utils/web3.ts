import { TokenInfo } from '@solana/spl-token-registry'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from './ids'
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

export async function getTokenAccounts(connection: Connection, walletAddress: string): Promise<TokenAccountInfo[]> {
  const walletPubkey = new PublicKey(walletAddress)
  const resp = await connection.getTokenAccountsByOwner(walletPubkey, {
    programId: TOKEN_PROGRAM_ID,
  })
  return resp.value.map(({ pubkey, account: { data } }) => new TokenAccountInfo(
    pubkey,
    ACCOUNT_LAYOUT.decode(data).mint,
    ACCOUNT_LAYOUT.decode(data).owner,
    ACCOUNT_LAYOUT.decode(data).amount.toNumber(),
  ))
}

export async function getBalance(connection: Connection, walletAddress: string): Promise<number> {
  const walletPubkey = new PublicKey(walletAddress)
  return await connection.getBalance(walletPubkey, 'confirmed')
}
