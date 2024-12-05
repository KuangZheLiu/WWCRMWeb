<template>
  <v-container fluid>
    <h2 class="text-h4 mb-6">儀表板 Dashboard</h2>

    <!-- 上方統計區塊 -->
    <v-row class="mb-6">
      <v-col cols="auto" md="4" lg="4" class="mb-4">
        <v-select
          v-model="selectedYear"
          :items="yearOptions"
          label="選擇年度"
          density="compact"
          @update:model-value="fetchAllData"
        ></v-select>
      </v-col>
      <v-col cols="auto" md="4" lg="4" class="mb-4">
        <v-select
          v-model="selectedCompany"
          :items="companyOptions"
          label="選擇公司"
          density="compact"
          @update:model-value="fetchAllData"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-h6">總營收</div>
            <div class="text-h4">{{ formatCurrency(totalRevenue) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-h6">目標營收</div>
            <div class="text-h4">{{ formatCurrency(targetRevenue) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-h6">達成率</div>
            <div class="text-h4">{{ achievementRate }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" class="mb-4">
      </v-col>
    </v-row>

    <!-- 下方圖表區塊 -->
    <v-row>
      <v-col cols="12" lg="6">
        <CompanyAnalysis
          :selected-year="selectedYear"
          :selected-company="selectedCompany"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <RevenueKPI
          :selected-year="selectedYear"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="12">
        <CustomerAnalysisList
          :selected-year="selectedYear"
          :selected-company="selectedCompany"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import CompanyAnalysis from './dashboard/CompanyAnalysis.vue'
import RevenueKPI from './dashboard/RevenueKPI.vue'

import CustomerAnalysisList from './dashboard/CustomerAnalysisList.vue'
// import CustomerAnalysisTWTTH from './dashboard/CustomerAnalysis_TWTTH.vue'
// import ProductAnalysisTWTTH from './dashboard/ProductAnalysis_TWTTH.vue'
// import CompanyAnalysis from './dashboard/CompanyAnalysis.vue'
// import ProductCompanyAnalysis from './dashboard/ProductCompanyAnalysis.vue'
// import CustomerAnalysisList from './dashboard/CustomerAnalysisList.vue'

// const charts = [
//   { component: CustomerAnalysisTWTTH },
//   { component: ProductAnalysisTWTTH },
//   { component: CompanyAnalysis },
//   { component: CustomerAnalysisList }
// ]

const selectedYear = ref(new Date().getFullYear().toString())
const selectedCompany = ref('ALL')
const companyOptions = ref([])
const yearOptions = ref([])
const totalRevenue = ref(0)
const targetRevenue = ref(300000000)

// 計算達成率
const achievementRate = computed(() => {
  return ((totalRevenue.value / targetRevenue.value) * 100).toFixed(2)
})

// 格式化貨幣顯示
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// 獲取公司選項
const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/analysis/companies')
    companyOptions.value = [
      { title: '全部公司', value: 'ALL' },
      ...response.data.map(company => ({
        title: company.ComNo,
        value: company.ComNo
      }))
    ]
  } catch (error) {
    console.error('獲取公司資料失敗:', error)
  }
}

// 獲取年度營收數據
const fetchRevenueData = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/analysis/annual-revenue', {
      params: {
        year: selectedYear.value,
        company: selectedCompany.value
      }
    })
    totalRevenue.value = response.data.totalRevenue
  } catch (error) {
    console.error('獲取營收數據失敗:', error)
  }
}

const fetchAllData = () => {
  fetchRevenueData()
}

onMounted(() => {
  fetchCompanyOptions()
  fetchAllData()

  // 生成年度選項（前5年到當年）
  const currentYear = new Date().getFullYear()
  yearOptions.value = Array.from({ length: 6 }, (_, i) => ({
    title: (currentYear - i).toString(),
    value: (currentYear - i).toString()
  }))
})
</script>

<style scoped>
.v-col {
  min-height: 100%;
}
</style>
