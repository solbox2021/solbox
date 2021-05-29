<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { PublicKey } from '@solana/web3.js'

const testKey = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

</script>

<template>
  <div class="home flex flex-col items-center">
    <img alt="Vue logo" src="../assets/logo.png" class="w-44 h-44" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <p>{{ testKey.toString() }}</p>
  </div>
</template>
