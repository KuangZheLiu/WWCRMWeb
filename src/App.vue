<template>
  <div class="app-container">
    <!-- Drawer Menu -->
    <Drawer v-model:visible="visible">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <span class="font-semibold text-2xl text-primary">CRM System</span>
            </span>
            <span>
              <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined />
            </span>
          </div>

          <!-- Menu Content -->
          <div class="overflow-y-auto">
            <ul class="list-none p-4 m-0">
              <li>
                <div class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400">
                  <span class="font-medium">Main Menu</span>
                </div>
                <ul class="list-none p-0 m-0 overflow-hidden">
                  <!-- Dashboard -->
                  <li>
                    <a
                      v-ripple
                      class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors"
                      @click="handleNavigation('/')"
                    >
                      <i class="pi pi-home mr-2"></i>
                      <span class="font-medium">Dashboard</span>
                    </a>
                  </li>

                  <!-- Sales Data -->
                  <li>
                    <a
                      v-ripple
                      class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors"
                      @click="handleNavigation('/invdata')"
                    >
                      <i class="pi pi-chart-line mr-2"></i>
                      <span class="font-medium">Sales Data</span>
                    </a>
                  </li>

                  <!-- Customer Data -->
                  <li>
                    <a
                      v-ripple
                      class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors"
                      @click="handleNavigation('/customer')"
                    >
                      <i class="pi pi-users mr-2"></i>
                      <span class="font-medium">Customer Data</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Toggle Button -->
    <Button icon="pi pi-bars" @click="visible = true" class="fixed top-4 left-4 z-50" />

    <!-- Main Content -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const visible = ref(false)
const router = useRouter()

const handleNavigation = (path) => {
  router.push(path)
  visible.value = false
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.main-content {
  padding: 20px;
  padding-top: 80px;
}
</style>
