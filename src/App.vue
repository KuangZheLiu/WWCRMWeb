<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list >
        <v-list-item>
          <v-list-item-title class="text-h6">
            CRM Website
          </v-list-item-title>
          <template v-slot:append>
            <!-- v-slot:append 這裡的內容會顯示在列表項的後面 -->
            <v-btn icon="mdi-chevron-left" @click="drawer = false"></v-btn>
          </template>
        </v-list-item>

        <v-list-item v-if="userStore.isLoggedIn">
          <template v-slot:prepend>
            <!-- v-slot:prepend 這裡的內容會顯示在列表項的前面 -->
            <v-avatar color="primary">
              <v-img :src="userStore.user?.avatar" alt="avatar"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ userStore.user?.firstname }} {{ userStore.user?.lastname }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ userStore.user?.role }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- 選單項目 -->
        <v-list-item
          v-if="userStore.userRole === 'admin'"
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="handleNavigation('/')"
        ></v-list-item>

        <v-list-item
          v-if="userStore.userRole === 'admin'"
          prepend-icon="mdi-file-document-outline"
          title="Order Data"
          @click="handleNavigation('/invdata')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Customer Data"
          @click="handleNavigation('/customer')"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- 登出按鈕 -->
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <!-- <v-app-bar collapse density="compact" color="primary">
      < v-app-bar-nav-icon part  >
      <v-toolbar-title>CRM System</v-toolbar-title>
    </v-app-bar> -->
    <v-app-bar-nav-icon
        @click="drawer = !drawer"
        :icon="drawer ? 'mdi-close' : 'mdi-menu'"
        class="hamburger-btn"
        color="primary"
      ></v-app-bar-nav-icon>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const drawer = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleNavigation = (path) => {
  router.push(path)
  drawer.value = false
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
  drawer.value = false
}
</script>

<style scoped>
.hamburger-btn {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.hamburger-btn:hover {
  transform: scale(1.1);
}

.v-main {
  width: 1250px !important;
  /* padding: 20px !important; */
}
</style>
