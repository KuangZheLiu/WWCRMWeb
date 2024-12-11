<template>
  <v-app>
    <!-- Navigation Drawer -->
    <!-- <v-navigation-drawer v-model="drawer" temporary> -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <!-- temporary 是為了讓 drawer 可以被點擊關閉 -->
      <v-list >
        <v-list-item
          prepend-icon="mdi-menu"
          title="CRM Website"
          value="crm"
        >
          <!-- <v-list-item-title class="text-h6">
            CRM Website
          </v-list-item-title> -->
          <template v-slot:append>
            <!-- v-slot:append 這裡的內容會顯示在列表項的後面 -->
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <!-- v-slot:prepend 這裡的內容會顯示在列表項的前面 -->
        <!-- User Profile -->
        <!-- <v-list-item v-if="userStore.isLoggedIn">
          <template v-slot:prepend>
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
        </v-list-item> -->

        <v-divider class="my-2"></v-divider>

        <!-- Dashboard 選單組 -->
        <v-list-group
          v-model:opened="dashboardExpanded"
          value="dashboard"
          fluid
          v-if="userStore.userRole === 'Admin'"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-view-dashboard"
              title="Dashboard"
            ></v-list-item>
          </template>
          <v-list-item
            prepend-icon="mdi-circle-small"
            title="All"
            value="All"
            @click.stop="() => {
              handleNavigation('/dashboard');
            }"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-circle-small"
            title="TWTTH Data"
            @click.stop="() => {
              handleNavigation('/dashboard/twtth');
            }"
          ></v-list-item>
          <!-- <v-list-item
            prepend-icon="mdi-circle-small"
            title="HSCN Data"
            @click="handleNavigation('/dashboard/hscn')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-circle-small"
            title="HSKH Data"
            @click="handleNavigation('/dashboard/hskh')"
          ></v-list-item> -->
        </v-list-group>

        <v-list-item
          v-if="userStore.userRole === 'Admin'"
          prepend-icon="mdi-file-document-outline"
          title="Order Data"
          @click.stop="() => {
            handleNavigation('/invdata');
          }"

        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Customer Data"
          @click.stop="() => {
            handleNavigation('/customer');
          }"

        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

        <!-- <v-divider class="my-2"></v-divider> -->

        <!-- 登出按鈕 -->
        <!-- <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <!-- App Bar -->
    <!-- <v-app-bar collapse density="compact" color="primary">
      < v-app-bar-nav-icon part  >
      <v-toolbar-title>CRM System</v-toolbar-title>
    </v-app-bar> -->

    <!-- <v-app-bar-nav-icon
        @click="drawer = !drawer"
        :icon="drawer ? 'mdi-close' : 'mdi-menu'"
        class="hamburger-btn"
        color="primary"
      ></v-app-bar-nav-icon> -->

       <!-- 頂部導航欄 -->
    <v-app-bar scroll-behavior="elevate">
      <!-- 麵包屑導航 -->
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:prepend>
          <v-icon>mdi-home</v-icon>
        </template>
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <v-spacer></v-spacer>

      <!-- 用戶資訊選單 -->
      <v-menu v-model="userMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="ml-2">
            <v-avatar size="32" class="mr-2">
              <v-img :src="userStore.user?.avatar" alt="avatar"></v-img>
            </v-avatar>
            {{ userStore.user?.firstname }} {{ userStore.user?.lastname }}
          </v-btn>
        </template>
        <v-card min-width="200">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                {{ userStore.user?.role }}
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="handleLogout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>登出</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from './stores/user'

const drawer = ref(true)
const rail = ref(true)
const userMenu = ref(false)
const dashboardExpanded = ref(false)

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

// 計算麵包屑導航
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(Boolean)
  return [
    { title: 'CRMWeb', disabled: false, href: '/' },
    ...pathArray.map((item, index) => ({
      title: item.charAt(0).toUpperCase() + item.slice(1),
      disabled: index === pathArray.length - 1,
      href: `/${pathArray.slice(0, index + 1).join('/')}`
    }))
  ]
})

const handleNavigation = (path) => {
  router.push(path)
  rail.value = true
  dashboardExpanded.value = false  // 確保選單收起
}

// 監聽路由變化
watch(route, () => {
  dashboardExpanded.value = false  // 路由變化時收起選單
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
  rail.value = true
  userMenu.value = false
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
