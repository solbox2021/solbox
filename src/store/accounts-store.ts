import LocalStorage from '@/utils/local-storage'
import { Store } from './store'

export type Account = {
  alias: string
  address: string
}

class AccountsStore extends Store<Account[]> {
  protected data(): Account[] {
    const local = LocalStorage.get('wallets')
    if (local)
      return JSON.parse(local)
    else
      return []
  }

  // protected setup() {
  //   const local = LocalStorage.get('wallets')
  //   if (local) this.state = JSON.parse(local)
  // }

  addAccount(addr: string, name: string): boolean {
    const find = this.state.findIndex(({ address }) => address === addr)
    if (find >= 0) return false
    this.state.push({ alias: name, address: addr })
    this.saveLocal()
    return true
  }

  removeAccount(addr: string) {
    const find = this.state.findIndex(({ address }) => address === addr)
    if (find >= 0) {
      this.state.splice(find, 1)
      this.saveLocal()
    }
  }

  private saveLocal() {
    LocalStorage.set('wallets', JSON.stringify(this.state))
  }
}

export const accountsStore: AccountsStore = new AccountsStore()
