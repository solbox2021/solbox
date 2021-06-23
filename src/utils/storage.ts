import { useStorage } from '@vueuse/core'

export const favoriteCoins = useStorage<string[]>('favorite', [])
