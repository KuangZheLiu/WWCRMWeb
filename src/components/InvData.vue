<!-- <script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->

<!-- <script>
export default {
  data() {

  },
  methods:{
    PrintInfo() {
      alert("Test Click");
    }
  }
}
</script> -->

<script>
import axios from 'axios'
import DataForm from './DataForm.vue'
import DataList from './DataList.vue'

export default {
  // Add components
  components: {
    DataForm,
    DataList,
  },
  //
  data() {
    // Add data return
    return {
      showForm: false,
      invData: [],
      filters: {
        companyName: '',
        time: '',
        customerName: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      }
    }
    //
  },
  methods: {
    // PrintInfo() {
    //   // axios.get('http://localhost:8002/info')
    //   axios.get('http://localhost:8002/testdb/dbinfo').then((res) => {
    //     alert(res.data)
    //   })
    // },
    // InsertData() {
    //   // axios.get('http://localhost:8002/info')
    //   axios.get('http://localhost:8002/api/crmdb/query').then((res) => {
    //     alert(res.data)
    //   })
    // },

    // Catch Data from CRMDB
    async fetchInvData() {
      try {
        const params = new URLSearchParams({
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.filters
        })

        const response = await axios.get(`http://localhost:8002/api/db/invdata?${params}`)

        if (response.data.success) {
          this.invData = response.data.data
          this.pagination.total = response.data.total
        } else {
          console.error('獲取數據失敗:', response.data.error)
        }
      } catch (error) {
        console.error('請求錯誤:', error)
      }
    },

    handlePageChange(page) {
      this.pagination.currentPage = page
      this.fetchInvData()
    },

    handleFilter() {
      this.pagination.currentPage = 1
      this.fetchInvData()
    },
    // <!-- Add toggleForm -->
    toggleForm() {
      this.showForm = !this.showForm
    },
    handleSubmitSuccess() {
      this.showForm = false
      this.$refs.dataList.fetchData()
    },
  },
}
</script>

<template>
  <main>
    <!-- <button @click="PrintInfo">Get Info</button> -->
    <!-- <button @click="InsertData">Get DB Info</button> -->

    <!-- <div class="controls">
      <button @click="toggleForm">{{ showForm ? '隱藏表單' : '新增資料' }}</button>
    </div> -->

    <!-- <DataForm v-if="showForm" @submit-success="handleSubmitSuccess" />
    <DataList ref="dataList" /> -->
    <div class="container">
    <h1>CRM 銷售資料</h1>

    <!-- 篩選區域 -->
    <div class="filter-section">
      <input v-model="filters.companyName" placeholder="公司名稱" />
      <input v-model="filters.time" placeholder="時間 (YYYYMM)" />
      <input v-model="filters.customerName" placeholder="客戶名稱" />
      <button @click="handleFilter">搜尋</button>
    </div>

    <!-- 新增按鈕 -->
    <!-- <div class="controls">
      <button @click="toggleForm">{{ showForm ? '隱藏表單' : '新增資料' }}</button>
    </div> -->

    <!-- 表單組件 -->
    <DataForm v-if="showForm" @submit-success="handleSubmitSuccess" />

    <!-- 數據表格 -->
    <table class="data-table">
      <thead>
        <tr>
          <th>公司名稱</th>
          <th>時間</th>
          <th>客戶名稱</th>
          <th>品名</th>
          <th>銷貨成本</th>
          <th>毛利率</th>
          <th>原幣銷貨額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in invData" :key="item.ComNo">
          <td>{{ item.ComNo }}</td>
          <td>{{ item.YM }}</td>
          <td>{{ item.s01_03b }}</td>
          <td>{{ item.s02_02 }}</td>
          <td>{{ item.ShipCostMoney }}</td>
          <td>{{ item.ProfitRate }}%</td>
          <td>{{ item.InvMoney2 }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分頁控制 -->
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
      <span>共 {{ Math.ceil(pagination.total / pagination.pageSize) }} 頁</span>
    </div>
  </div>
  </main>
</template>

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
