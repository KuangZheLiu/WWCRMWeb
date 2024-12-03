<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-title>CRM Website Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="username"
                label="帳號"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="密碼"
                type="password"
                required
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                block
                :loading="loading"
              >
                登入
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const success = await userStore.login(username.value, password.value)
    if (success) {
      // 根據用戶角色決定跳轉頁面
      if (userStore.userRole === 'admin') {
        router.push('/')
      } else {
        router.push('/customer')
      }
    } else {
      alert('登入失敗')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    alert('登入發生錯誤')
  } finally {
    loading.value = false
  }
}
</script>
