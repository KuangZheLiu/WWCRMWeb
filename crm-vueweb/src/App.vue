<template>
  <div class="app-container">
    <div class="sidebar" :class="{ 'sidebar-collapsed': !showSidebar }">
      <button class="toggle-btn" @click="toggleSidebar">
        {{ showSidebar ? '<<' : '>>' }}
      </button>
      <nav class="nav-menu">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/invdata">銷售資料</router-link>
        <router-link to="/customer">客戶資料</router-link>
      </nav>
    </div>
    <div class="main-content" :class="{ 'content-expanded': !showSidebar }">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      showSidebar: true
    }
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: white;
  transition: width 0.3s;
  position: relative;
}

.sidebar-collapsed {
  width: 50px;
}

.toggle-btn {
  position: absolute;
  right: 0;
  top: 10px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.nav-menu {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 8px;
  border-radius: 4px;
}

.nav-menu a.router-link-active {
  background-color: #34495e;
}

.main-content {
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s;
}

.content-expanded {
  margin-left: -150px;
}
</style>
