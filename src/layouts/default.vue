<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import SimpleFooter from '@/components/SimpleFooter.vue'
import SearchHeader from '@/components/SearchHeader.vue'
</script>

<template>
  <main class="flex h-screen bg-gray-50 text-gray-700 dark:(text-gray-200 bg-gray-900)">
    <Sidebar />
    <div class="flex flex-col flex-1 w-full">
      <SearchHeader />
      <router-view class="h-full overflow-y-auto" />
      <SimpleFooter />
    </div>
  </main>
</template>
