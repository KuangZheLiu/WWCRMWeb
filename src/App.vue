<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">
            CRM System
          </v-list-item-title>
          <template v-slot:append>
            <v-btn icon="mdi-chevron-left" @click="drawer = false"></v-btn>
          </template>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          @click="handleNavigation('/')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-file-document-outline"
          title="Order Data"
          @click="handleNavigation('/invdata')"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Customer Data"
          @click="handleNavigation('/customer')"
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

const drawer = ref(false)
const router = useRouter()

const handleNavigation = (path) => {
  router.push(path)
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
  width: 1000px !important;
  /* padding: 20px !important; */
}
</style>
