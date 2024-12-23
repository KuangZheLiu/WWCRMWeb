<template>
  <div class="customer-container">
    <h1 class="text-h4 mb-6">CRM資料統計來源</h1>
    <!-- <div class="filter-section">
      <input v-model="filters.companyName" placeholder="公司名稱" />
      <input v-model="filters.customerName" placeholder="客戶名稱" />
      <button @click="handleFilter">搜尋</button>
    </div> -->

    <table class="data-table">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in customerData" :key="item.ComNo">
          <td v-for="header in tableHeaders" :key="header">
            {{ item[header] }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        :disabled="pagination.currentPage === 1"
        @click="handlePageChange(pagination.currentPage - 1)"
      >
        上一頁
      </button>
      <span>第 {{ pagination.currentPage }} 頁</span>
      <button
        :disabled="pagination.currentPage * pagination.pageSize >= pagination.total"
        @click="handlePageChange(pagination.currentPage + 1)"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      customerData: [],
      tableHeaders: [],
      filters: {
        companyName: '',
        customerName: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      }
    }
  },
  methods: {
    async fetchCustomerData() {
      try {
        const params = new URLSearchParams({
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.filters
        })

        const response = await axios.get(`http://localhost:8002/api/db/comdata?${params}`)

        if (response.data.success) {
          this.customerData = response.data.data
          this.pagination.total = response.data.total
          if (this.customerData.length > 0) {
            this.tableHeaders = Object.keys(this.customerData[0])
          }
        }
      } catch (error) {
        console.error('獲取客戶數據失敗:', error)
      }
    },
    handleFilter() {
      this.pagination.currentPage = 1
      this.fetchCustomerData()
    },
    handlePageChange(page) {
      this.pagination.currentPage = page
      this.fetchCustomerData()
    }
  },
  mounted() {
    this.fetchCustomerData()
  }
}
</script>

<style scoped>
.customer-container {
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
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
