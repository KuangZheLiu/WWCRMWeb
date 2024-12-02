
<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">CRM 銷售資料</h1>

    <!-- 篩選區域 -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.companyName"
              :items="companies"
              item-title="ComNo"
              item-value="ComNo"
              label="公司名稱"
              clearable
              density="compact"
              @update:model-value="handleCompanyChange"
            ></v-select>
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filters.customerName"
              :items="customers"
              item-title="CustomerName"
              item-value="CustomerName"
              label="客戶名稱"
              clearable
              density="compact"
              :disabled="loading"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="filters.startDate"
                  type="month"
                  label="開始時間"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="filters.endDate"
                  type="month"
                  label="結束時間"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              block
              @click="handleFilter"
              :loading="loading"
            >
              搜尋
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 數據表格 -->
    <v-card>
      <v-data-table
        v-model:items-per-page="pagination.pageSize"
        :headers="headers"
        :items="invData"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!-- <td>{{ item.ComNo }}</td>
            <td>{{ item.YM }}</td>
            <td>{{ item.s01_03b }}</td>
            <td>{{ item.s02_02 }}</td>
            <td>{{ formatCurrency(item.ShipCostMoney) }}</td>
            <td>{{ item.ProfitRate }}%</td>
            <td>{{ formatCurrency(item.InvMoney2) }}</td> -->
            <td v-for="header in headers" :key="header.key">
              {{ header.key.includes('Money') ? formatCurrency(item[header.key]) :
                 header.key === 'ProfitRate' ? `${item[header.key]}%` :
                 item[header.key] }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import { nextTick } from 'vue'

export default {
  data() {
    return {
      loading: false,
      companies: [],
      customers: [],
      invData: [],
      filters: {
        companyName: '',
        customerName: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        pageSize: 50
      },
      headers: [
        { title: '公司名稱', key: 'ComNo' },
        { title: '時間', key: 'YM' },
        { title: '客戶名稱', key: 's01_03b' },
        { title: '品名', key: 's02_02' },
        { title: '銷貨成本', key: 'ShipCostMoney' },
        { title: '毛利率', key: 'ProfitRate' },
        { title: '原幣銷貨額', key: 'InvMoney2' }
      ],
      dataCache: new Map(), // 添加緩存
      cacheTimeout: 5 * 60 * 1000, // 緩存時間 5 分鐘
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
      }).format(value)
    },
    async handleCompanyChange(value) {
      this.filters.customerName = ''
      if (value) {
        await this.fetchCustomers(value)
      } else {
        this.customers = []
      }
    },
    async fetchCompanies() {
      try {
        const response = await axios.get('http://localhost:8002/api/analysis/companies')
        this.companies = response.data
      } catch (error) {
        console.error('獲取公司列表失敗:', error)
      }
    },
    async fetchCustomers(comNo) {
      try {
        const response = await axios.get('http://localhost:8002/api/analysis/customers-by-company', {
          params: { comNo }
        })
        this.customers = response.data
      } catch (error) {
        console.error('獲取客戶列表失敗:', error)
      }
    },
    getCacheKey(params) {
      return JSON.stringify(params)
    },

    isValidCache(cacheTime) {
      return Date.now() - cacheTime < this.cacheTimeout
    },

    async fetchInvData() {
      this.loading = true
      try {
        const params = this.buildParams()
        const cacheKey = this.getCacheKey(params)

        // 檢查緩存
        const cachedData = this.dataCache.get(cacheKey)
        if (cachedData && this.isValidCache(cachedData.timestamp)) {
          this.invData = cachedData.data
          this.loading = false
          return
        }

        const response = await axios.get(`http://localhost:8002/api/db/invdata`, { params })
        if (response.data.success) {
          this.invData = response.data.data
          // 設置緩存
          this.dataCache.set(cacheKey, {
            data: response.data.data,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error('獲取數據失敗:', error)
      } finally {
        this.loading = false
      }
    },

    buildParams() {
      const params = {}
      if (this.filters.companyName?.trim()) {
        params.companyName = this.filters.companyName.trim()
      }
      if (this.filters.customerName?.trim()) {
        params.customerName = this.filters.customerName.trim()
      }
      if (this.filters.startDate?.trim()) {
        params.startDate = this.filters.startDate.trim().replace('-', '')
      }
      if (this.filters.endDate?.trim()) {
        params.endDate = this.filters.endDate.trim().replace('-', '')
      }
      return params
    },
    handleFilter() {
      this.fetchInvData()
    }
  },
  async mounted() {
    await this.fetchCompanies()
    await this.fetchInvData()
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section input {
  margin-right: 10px;
  padding: 5px;
}

.data-table {
  width: 200%;
  /* width: auto; */
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: left;
  background-color: #ddd;
  color: #000000;
}

.data-table th {
  color: #000000;
  background-color: #ddd;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.controls {
  margin: 20px 0;
}

button {
  padding: 5px 15px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
