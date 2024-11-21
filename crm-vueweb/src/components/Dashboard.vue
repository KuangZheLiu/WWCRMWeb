<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div class="dashboard-grid">
      <div class="chart-card">
        <OrderForecast />
      </div>
      <!-- 後續可添加更多圖表 -->
    </div>
  </div>
</template>

<script>
import OrderForecast from './dashboard/OrderForecast.vue'

export default {
  name: 'Dashboard',
  components: {
    OrderForecast
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
}
</style>
