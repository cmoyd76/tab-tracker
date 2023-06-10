<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label for="username">Username</label>
      <input v-model="username" type="text" id="username" required />

      <label for="password">Password</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    await userStore.authenticate(username.value, password.value)
    console.log('Authentication successful')
  } catch (error: any) {
    console.error('Authentication failed:', error.message)
  }
}
</script>
