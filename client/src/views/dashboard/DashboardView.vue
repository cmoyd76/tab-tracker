<template>
  <div>
    <h2>Dashboard</h2>
    <p>Welcome, {{ username }}!</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const username = computed(() => userStore.username)
</script>
