<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <div class="dashboard-grid">
      <div class="chart-card-customerTWTTH">
        <CustomerAnalysisTWTTH />
      </div>
      <div class="chart-card-productTWTTH">
        <ProductAnalysisTWTTH />
      </div>
      <!-- 後續可添加更多圖表 -->
    </div>
  </div>
</template>

<script>

import CustomerAnalysisTWTTH from './dashboard/CustomerAnalysis_TWTTH.vue'
import ProductAnalysisTWTTH from './dashboard/ProductAnalysis_TWTTH.vue'

export default {
  name: 'Dashboard',
  components: {
    CustomerAnalysisTWTTH,
    ProductAnalysisTWTTH
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

.chart-card-customerTWTTH {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
  width: 800px;
}

.chart-card-productTWTTH {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 300px;
  width: 800px;
}
</style>
