<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label for="username">Username</label>
      <input v-model="username" type="text" id="username" required />

      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const username = ref('');
const password = ref('');

const register = async () => {
  try {
    await userStore.register(username.value, password.value);
    console.log('Registration successful');
  } catch (error: any) {
    console.error('Registration failed In Form:', error.message);
  }
};
</script>
