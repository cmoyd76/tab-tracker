<template>
  <div id="app">
    <router-link to="/register">Register</router-link>
    <router-link to="/login">Login</router-link>
    <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated);
</script>
