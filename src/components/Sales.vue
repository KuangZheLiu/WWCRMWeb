<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">業務名單</h1>

    <!-- 查詢區域 -->
    <v-card class="mb-4" md="2">
      <v-card-text>
        <v-row>
          <!-- <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.userID"
              label="登入帳號"
              clearable
              density="compact"
            ></v-text-field>
          </v-col> -->
          <!-- <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.nameCN"
              label="業務姓名"
              clearable
              density="compact"
            ></v-text-field>
          </v-col> -->
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.area"
              :items="areaOptions"
              label="負責地區"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.comNo"
              :items="companyOptions"
              label="公司代號"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.jobTitle"
              :items="jobTitleOptions"
              label="職稱"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-end">
            <v-btn color="primary" @click="handleSearch" :loading="loading">
              搜尋
            </v-btn>
          </v-col>
        </v-row>
        <v-row>

        </v-row>
      </v-card-text>
    </v-card>

    <!-- 資料表格 -->
    <v-data-table
      :headers="headers"
      :items="salesData"
      :loading="loading"
      :sort-by="sortBy"
      class="elevation-1"
    >
      <!-- 照片欄位自定義渲染 -->
      <template #[`item.Photo`]="{ item }">
        <v-avatar size="40">
          <v-img :src="item.Photo || '../assets/default-avatar.png'" />
        </v-avatar>
      </template>

      <!-- 英文名稱欄位自定義渲染 -->
      <template #[`item.NameF+NameL`]="{ item }">
        {{ `${item.NameF} ${item.NameL}` }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(false)
const salesData = ref([])
const companyOptions = ref([])
const areaOptions = ref([])
const jobTitleOptions = ref([])

// 表頭定義
const headers = [
  { title: '登入帳號', key: 'UserID', sortable: false },
  { title: '照片', key: 'Photo', sortable: false },
  { title: '業務姓名', key: 'NameCN', sortable: true },
  { title: '英文名稱', key: 'NameF+NameL', sortable: true },
  { title: '公司代號', key: 'ComNo', sortable: true },
  { title: '負責地區', key: 'Area', sortable: true },
  { title: '職稱', key: 'JobTitle', sortable: true },
  { title: '電話', key: 'PhoneNum', sortable: true },
  { title: '電子郵件', key: 'Email', sortable: true }
]

// 排序設定
const sortBy = ref([{ key: 'ComNo', order: 'asc' }])

// 篩選條件
const filters = ref({
  userID: '',
  nameCN: '',
  area: '',
  comNo: '',
  jobTitle: ''
})

// 獲取資料
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8002/api/userdata')
    if (response.data.success) {
      salesData.value = response.data.data.filter(user => {
        const matchUserID = !filters.value.userID ||
          user.UserID.toLowerCase().includes(filters.value.userID.toLowerCase())
        const matchName = !filters.value.nameCN ||
          user.NameCN.toLowerCase().includes(filters.value.nameCN.toLowerCase())
        const matchArea = !filters.value.area || user.Area === filters.value.area
        const matchCompany = !filters.value.comNo || user.ComNo === filters.value.comNo
        const matchJobTitle = !filters.value.jobTitle || user.JobTitle === filters.value.jobTitle
        return matchUserID && matchName && matchArea && matchCompany && matchJobTitle
      })
    }
  } catch (error) {
    console.error('獲取數據失敗:', error)
  } finally {
    loading.value = false
  }
}

// 獲取公司選項
const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/userdata/comnos')
    companyOptions.value = response.data.data.map(item => item.ComNo)
  } catch (error) {
    console.error('獲取公司列表失敗:', error)
  }
}

// 獲取地區選項
const fetchAreaOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/userdata/areas')
    if (response.data.success) {
      areaOptions.value = response.data.data.map(item => item.Area)
    }
  } catch (error) {
    console.error('獲取地區列表失敗:', error)
  }
}

// 獲取職稱選項
const fetchJobTitleOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/userdata/jobtitles')
    if (response.data.success) {
      jobTitleOptions.value = response.data.data.map(item => item.JobTitle)
    }
  } catch (error) {
    console.error('獲取職稱列表失敗:', error)
  }
}

// 搜尋處理
const handleSearch = () => {
  fetchData()
}

onMounted(() => {
  fetchCompanyOptions()
  fetchAreaOptions()
  fetchJobTitleOptions()
  fetchData()
})
</script>

<style scoped>
.v-data-table {
  width: 100%;
  overflow: auto;
}
</style>
