<template>
  <div class="dashboard">
    <h2>儀表板</h2>
    <div class="dashboard-grid">
      <!-- 客戶分析圖表 -->
      <div class="chart-card">
        <CustomerAnalysisTWTTH />
      </div>
      <!-- 產品分析圖表 -->
      <div class="chart-card">
        <ProductAnalysisTWTTH />
      </div>
      <!-- 公司訂單分析圖表 -->
      <div class="chart-card">
        <CompanyAnalysis />
      </div>
      <!-- 產品類別分析圖表 -->
      <div class="chart-card">
        <ProductCompanyAnalysis />
      </div>
    </div>
  </div>
</template>

<script>
import CustomerAnalysisTWTTH from './dashboard/CustomerAnalysis_TWTTH.vue'
import ProductAnalysisTWTTH from './dashboard/ProductAnalysis_TWTTH.vue'
import CompanyAnalysis from './dashboard/CompanyAnalysis.vue'
import ProductCompanyAnalysis from './dashboard/ProductCompanyAnalysis.vue'

export default {
  name: 'Dashboard',
  components: {
    CustomerAnalysisTWTTH,
    ProductAnalysisTWTTH,
    CompanyAnalysis,
    ProductCompanyAnalysis
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 400px;
}
</style>
