<template>
  <v-container fluid>
    <h2 class="text-h4 mb-4">儀表板 Dashboard</h2>
    <!-- 添加這一行來顯示子路由內容 -->
    <router-view v-if="$route.path !== '/dashboard'" />

    <template v-else>
      <!-- 上方統計區塊 -->
      <v-row class="mb">
        <v-col cols="auto" md="auto" lg="auto" class="pt-2">
        <v-select
          v-model="selectedYear"
          :items="yearOptions"
          label="選擇年度"
          density="compact"
          class="no-border no-underline"
          @update:model-value="fetchAllData"
        ></v-select>
        <v-divider class="my-1"></v-divider>
        <v-select
          v-model="selectedCompany"
          :items="companyOptions"
          label="選擇公司"
          density="compact"
          class="no-border no-underline"
          @update:model-value="fetchAllData"
        ></v-select>
      </v-col>
      <v-col cols="auto" md="auto" lg="auto" class="">
      </v-col>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-center">總營收</div>
            <div class="text-center">{{ formatCurrency(totalRevenue/1000) }}K</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-center">目標營收</div>
            <div class="text-center">{{ formatCurrency(targetRevenue/1000) }}K</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="auto" md="auto" lg="auto">
        <v-card>
          <v-card-text>
            <div class="text-center">達成率</div>
            <div class="text-center">{{ achievementRate }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- <v-row>
      <v-col cols="12" md="6" lg="6" class="mb-4"></v-col>
    </v-row> -->

    <!-- 下方圖表區塊 -->
    <v-row>
      <v-col cols="12" lg="6" md="5">
        <CompanyAnalysis
          :selected-year="selectedYear"
          :selected-company="selectedCompany"
        />
      </v-col>
      <v-col cols="12" lg="6" md="5" xl="3">
        <RevenueKPI
          :selected-year="selectedYear"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6" md="5" xl="3">
        <CustomerAnalysisList
          :selected-year="selectedYear"
          :selected-company="selectedCompany"
          />
        </v-col>
      </v-row>
    </template>
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
const selectedCompany = ref('All')
const companyOptions = ref([])
const yearOptions = ref([])
const totalRevenue = ref(0)
const targetRevenue = ref(30000000)


// 計算達成率
const achievementRate = computed(() => {
  return ((totalRevenue.value / targetRevenue.value) * 100).toFixed(2)
})

// 格式化貨幣顯示
const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    // maximumSignificantDigits: 2
  }).format(value)
}

// 獲取公司選項
const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/analysis/companies')
    companyOptions.value = [
      { title: '全部公司', value: 'All' },
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

  // 生成年度選項（前2年到當年）
  const currentYear = new Date().getFullYear()
  yearOptions.value = Array.from({ length: 3 }, (_, i) => ({
    title: (currentYear - i).toString(),
    value: (currentYear - i).toString()
  }))
})
</script>

<style scoped>
.v-container{
  background-color: rgb(190, 190, 190);
  width: auto;
}

.v-col {
  min-height: 100%;
}

.v-select {
  /* border: 100px solid var(--color-neutral-200); */
  /* color: var(--color-primary-500); */
  background-color: white;
  /* color: burlywood; */
  /* border: 1ch; */
  border-radius: 5px;
  height: 45px;

}

.no-border .no-underline .v-select__selections {
  border-bottom: none !important;
  box-shadow: none !important;
}

/* .no-underline .v-field__outline::before{
  border-width: 0;
} */

</style>

