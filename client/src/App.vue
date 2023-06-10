<template>
  <div id="app">
    <router-link v-if="!isAuthenticated" to="/register">Register</router-link>
    <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
    <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link>
    <div class="menu-item px-5" v-if="isAuthenticated">
      <a @click="logOut()" class="menu-link px-5"> Sign Out </a>
    </div>
    <!-- <router-link v-if="isAuthenticated" to="/dashboard">Dashboard</router-link> -->

    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.isAuthenticated);

const logOut = () => {
  userStore.logout();
  router.push({ name: 'login' });
};
</script>
