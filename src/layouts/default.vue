<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import SimpleFooter from '@/components/SimpleFooter.vue'
import SearchHeader from '@/components/SearchHeader.vue'
</script>

<template>
  <main class="flex font-sans h-screen bg-gray-50 text-gray-700 dark:(text-gray-200 bg-gray-900)">
    <Sidebar />
    <div class="flex flex-col flex-1 w-full">
      <SearchHeader />
      <router-view class="h-full pb-14 overflow-y-auto" />
      <SimpleFooter class="right-0 -bottom-1 left-0 absolute md:left-64" />
    </div>
  </main>
</template>
