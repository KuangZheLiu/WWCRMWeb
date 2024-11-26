<template>
  <div class="dashboard">
    <h2>儀表板 Dashboard</h2>
    <div class="dashboard-grid">
      <!-- 客戶分析圖表 -->
      <div class="chart-card twtth-customer-analysis">
        <CustomerAnalysisTWTTH />
      </div>
      <!-- 產品分析圖表 -->
      <div class="chart-card twtth-product-analysis">
        <ProductAnalysisTWTTH />
      </div>
      <!-- 公司訂單分析圖表 -->
      <div class="chart-card company-analysis">
        <CompanyAnalysis />
      </div>
      <!-- 產品類別分析圖表 -->
      <div class="chart-card product-analysis">
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
  /* grid-template-columns: repeat(2, 1fr); */
  /* grid-template-columns: repeat(1, 1fr) auto; */
  grid-auto-columns: 900px;
  /* grid-template-columns: 60% 40%;  調整左右列寬比例 */
  /* grid-template-rows: 500px 500px auto; */
  grid-auto-rows: 500px ;
  /* grid-template-rows: repeat(1, fr) auto; */
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px; /* 增加圓角 */
  padding: 25px; /* 增加內邊距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* min-height: 450px; */
  height:100%;
  width: auto;
  display: flex;
  flex-direction: column;
}

.twtth-customer-analysis {
  height: 100%;
  /* overflow: hidden; */
}

.twtth-product-analysis {
  height: 100%;
  /* overflow: hidden; */
}

.company-analysis {
  height: 100%;
  /* overflow: hidden; */
}

.product-analysis {
  height: 2000px;
  width: 1000px;
  /* overflow: hidden; */
}
</style>
