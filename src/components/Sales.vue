<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">業務日誌管理</h1>

    <!-- 查詢區域 -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
            v-model="filters.yearMonth"
            type="month"
            label="年月"
            clearable
            density="compact"
            @update:model-value="handleFilterYMChange"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.salesName"
              :items="salesOptions"
              label="業務名稱"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.comNo"
              :items="companyOptions"
              label="公司代號"
              clearable
              density="compact"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.orderCom"
              :items="customerOptions"
              label="客戶名稱"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.orderSta"
              :items="['Closing', 'Negotiation', 'Demo', 'Qualification']"
              label="訂單狀態"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.orderCurr"
              :items="['USD', 'TWD', 'TBD', 'CNY']"
              label="幣別"
              clearable
              density="compact"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn color="primary" block @click="handleSearch" :loading="loading"> 搜尋 </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 功能按鈕 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn color="success" @click="openAddDialog" :disabled="!hasPermission"> 新增資料 </v-btn>
      <v-select
        v-model="pageSize"
        :items="[50, 100, 200]"
        label="每頁筆數"
        density="compact"
        style="width: 100px"
      ></v-select>
    </div>

    <!-- 資料表格 -->
    <v-data-table
      v-model:items-per-page="pageSize"
      :headers="headers"
      :items="salesData"
      :loading="loading"
      :sort-by="sortBy"
      :server-items-length="totalItems"
      @update:options="handleTableOptionsChange"
      class="elevation-1"
    >
      <!-- 自定義列渲染 -->
      <template  #[`item.YM`]="{ item }">
        {{ formatYMForInput(item.YM) }}
      </template>

      <template #[`item.OrderAR`]="{ item }">
        {{ formatCurrency(item.OrderAR) }}
      </template>

      <template #[`item.OrderAL`]="{ item }">
        {{ formatCurrency(item.OrderAL) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn
            icon="mdi-pencil"
            size="small"
            color="primary"
            class="mr-2"
            @click="openEditDialog(item)"
            :disabled="!canEdit(item)"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            @click="handleDelete(item)"
            :disabled="!canDelete(item)"
    ></v-btn>
  </div>
</template>
    </v-data-table>

    <!-- 新增/編輯對話框 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEditing ? '編輯資料' : '新增資料' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-row>
              <!-- YM 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.YM"
                  type="month"
                  label="年月"
                  :rules="[(v) => !!v || '請選擇年月']"
                  required
                  @update:model-value="handleYMChange"
                  :value="formatYMForInput(editForm.YM)"
                ></v-text-field>
              </v-col>

              <!-- Sales 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-if="userStore.userRole === 'Admin'"
                  v-model="editForm.Sales"
                  label="業務姓名"
                  :rules="[(v) => !!v || '請輸入業務姓名']"
                  required
                ></v-text-field>
                <v-text-field
                  v-else
                  v-model="editForm.Sales"
                  label="業務姓名"
                  :value="userStore.user?.username"
                  readonly
                  disabled
                ></v-text-field>
              </v-col>

              <!-- ComNo 欄位 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.ComNo"
                  :items="companyOptions"
                  label="公司代號"
                  :rules="[(v) => !!v || '請選擇公司代號']"
                  required
                ></v-select>
              </v-col>

              <!-- OrderCom 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.OrderCom"
                  label="客戶名稱"
                  :rules="[(v) => !!v || '請輸入客戶名稱']"
                  required
                ></v-text-field>
              </v-col>

              <!-- OrderNum 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.OrderNum"
                  label="訂單數量"
                  type="number"
                  :rules="[(v) => v >= 0 || '訂單數量不能為負數']"
                ></v-text-field>
              </v-col>

              <!-- OrderPro 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.OrderPro"
                  label="產品名稱"
                  :rules="[(v) => !!v || '請輸入產品名稱']"
                  required
                ></v-text-field>
              </v-col>

              <!-- OrderSta 欄位 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.OrderSta"
                  :items="['Closing', 'Negotiation', 'Demo', 'Qualification']"
                  label="訂單狀態"
                  :rules="[(v) => !!v || '請選擇訂單狀態']"
                  required
                ></v-select>
              </v-col>

              <!-- OrderCurr 欄位 -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.OrderCurr"
                  :items="['USD', 'TWD', 'TBD', 'CNY']"
                  label="幣別"
                  :rules="[(v) => !!v || '請選擇幣別']"
                  required
                ></v-select>
              </v-col>

              <!-- OrderAR 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.OrderAR"
                  label="應收金額"
                  type="number"
                  :rules="[(v) => v >= 0 || '應收金額不能為負數']"
                ></v-text-field>
              </v-col>

              <!-- OrderAL 欄位 -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="editForm.OrderAL"
                  label="未收金額"
                  type="number"
                  :rules="[(v) => v >= 0 || '未收金額不能為負數']"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">取消</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="loading"> 確定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const userStore = useUserStore()
const loading = ref(false)
const dialog = ref(false)
const isEditing = ref(false)
const salesData = ref([])

// 表單參考
const form = ref(null)

// 格式化 YM 為輸入框格式 (YYYY-MM)
const formatYMForInput = (ym) => {
  if (!ym) return ''
  // 如果已經是 YYYY-MM 格式就直接返回
  if (ym.includes('-')) return ym
  // 否則轉換 YYYYMM 為 YYYY-MM
  return `${ym.substring(0, 4)}-${ym.substring(4, 6)}`
}

// 格式化 YM 為數據庫格式 (YYYYMM)
const formatYMForDB = (ym) => {
  if (!ym) return ''
  // 如果包含 - 則移除
  return ym.replace(/-/g, '')
}

// 處理年月變更
const handleYMChange = (value) => {
  if (value) {
    editForm.value.YM = formatYMForDB(value)
  }
}

// 年月篩選處理方法
const handleFilterYMChange = (value) => {
  if (value) {
    // 將 YYYY-MM 格式轉換為 YYYYMM 格式
    const formattedYM = value.replace(/-/g, '')
    filters.value.yearMonth = formattedYM
  } else {
    filters.value.yearMonth = ''
  }
}

// 分頁和排序相關
const pageSize = ref(50)
const sortBy = ref([{ key: 'YM', order: 'desc' }])
const totalItems = ref(0)

// 表頭定義
const headers = [
  { title: '年月', key: 'YM', sortable: true },
  { title: '業務姓名', key: 'Sales', sortable: true },
  { title: '公司代號', key: 'ComNo', sortable: true },
  { title: '客戶名稱', key: 'OrderCom', sortable: true },
  { title: '訂單數量', key: 'OrderNum', sortable: true },
  { title: '產品名稱', key: 'OrderPro', sortable: true },
  { title: '訂單狀態', key: 'OrderSta', sortable: true },
  { title: '幣別', key: 'OrderCurr', sortable: true },
  { title: '應收金額', key: 'OrderAR', sortable: true },
  { title: '未收金額', key: 'OrderAL', sortable: true },
  { title: '操作', key: 'actions', sortable: false },
]

// 篩選條件
const filters = ref({
  yearMonth: '',
  salesName: '',
  comNo: '',
  orderCom: '',
  orderSta: '',
  orderCurr: '',
})

// 編輯表單數據
const editForm = ref({
  YM: '',
  Sales: '',
  ComNo: '',
  OrderCom: '',
  OrderNum: 0,
  OrderPro: '',
  OrderSta: 'Qualification',
  OrderCurr: 'TWD',
  OrderAR: 0,
  OrderAL: 0,
})


const companyOptions = ref([])
const salesOptions = ref([])
const customerOptions = ref([])

// 權限控制
const hasPermission = computed(() => {
  if (userStore.userRole === 'Admin') return true
  if (userStore.userRole === 'Sales') {
    // 如果是編輯模式，檢查當前記錄是否屬於該用戶
    if (isEditing.value) {
      return editForm.value.Sales === userStore.user?.username
    }
    // 如果是新增模式，允許新增
    return true
  }
  return false
})

// 數據過濾
const filteredData = computed(() => {
  if (userStore.userRole === 'Sales') {
    return salesData.value.filter((item) => item.Sales === userStore.user?.username)
  }
  return salesData.value
})

// 處理表格選項變更
const handleTableOptionsChange = (options) => {
  pageSize.value = options.itemsPerPage
  const sortItem = options.sortBy[0]
  if (sortItem) {
    sortBy.value = [{ key: sortItem.key, order: sortItem.order }]
  }
  fetchData()
}


const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

// 修改 fetchData 方法
const fetchData = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()

    // 分頁參數
    params.append('page', '1')
    params.append('pageSize', pageSize.value.toString())

    // 排序參數
    if (sortBy.value[0]) {
      params.append('sortField', sortBy.value[0].key)
      params.append('sortOrder', sortBy.value[0].order)
    }

    // 篩選條件
    if (filters.value.yearMonth) {
      console.log('發送查詢的年月值:', filters.value.yearMonth) // 調試用
      params.append('yearMonth', filters.value.yearMonth)
    }

    // 權限控制：Sales 角色只能看到自己的數據
    if (userStore.userRole === 'Sales') {
      params.append('salesName', userStore.user?.username)
      // Sales 角色不允許通過篩選查看其他人的數據
      filters.value.salesName = userStore.user?.username
    } else if (filters.value.salesName) {
      params.append('salesName', filters.value.salesName)
    }

    // 其他篩選條件
    if (filters.value.comNo) params.append('comNo', filters.value.comNo)
    if (filters.value.orderCom) params.append('orderCom', filters.value.orderCom)
    if (filters.value.orderSta) params.append('orderSta', filters.value.orderSta)
    if (filters.value.orderCurr) params.append('orderCurr', filters.value.orderCurr)

    const response = await axios.get('http://localhost:8002/api/orderdata', { params })
    if (response.data.success) {
      salesData.value = response.data.data
      totalItems.value = response.data.total
    }
  } catch (error) {
    console.error('獲取數據失敗:', error)
  } finally {
    loading.value = false
  }
}

// 獲取業務名稱列表
const fetchSalesOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/orderdata/salesnames')
    salesOptions.value = response.data.map((sales) => ({
      title: sales.Sales,
      value: sales.Sales,
    }))
  } catch (error) {
    console.error('獲取業務列表失敗:', error)
  }
}

const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/analysis/companies')
    companyOptions.value = response.data.map((company) => ({
      title: company.ComNo,
      value: company.ComNo,
    }))
  } catch (error) {
    console.error('獲取公司列表失敗:', error)
  }
}

const fetchCustomerOptions = async () => {
  try {
    const response = await axios.get('http://localhost:8002/api/orderdata/customernames')
    customerOptions.value = response.data.map((customer) => ({
      title: customer.OrderCom,
      value: customer.OrderCom,
    }))
  } catch (error) {
    console.error('獲取客戶列表失敗:', error)
  }
}

// 新增/編輯/刪除方法
const openAddDialog = () => {
  isEditing.value = false
  const today = new Date()
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')

  editForm.value = {
    YM: `${year}-${month}`,  // 預設為當前年月
    Sales: userStore.userRole === 'Admin' ? '' : userStore.user?.username,
    ComNo: '',
    OrderCom: '',
    OrderNum: 0,
    OrderPro: '',
    OrderSta: 'Qualification',
    OrderCurr: 'TWD',
    OrderAR: 0,
    OrderAL: 0,
  }
  dialog.value = true
}

// 檢查是否可以編輯特定記錄
const canEdit = (item) => {
  if (userStore.userRole === 'Admin') return true
  return userStore.userRole === 'Sales' && item.Sales === userStore.user?.username
}

const openEditDialog = (item) => {
  if (!canEdit(item)) return
  isEditing.value = true
  editForm.value = {
    ...item,
    YM: formatYMForInput(item.YM)
  }
  dialog.value = true
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  loading.value = true
  try {
    const submitData = {
      ...editForm.value,
      YM: formatYMForDB(editForm.value.YM)
    }

    if (isEditing.value) {
      await axios.put(`http://localhost:8002/api/orderdata/${submitData.YM}`, submitData)
    } else {
      await axios.post('http://localhost:8002/api/orderdata', submitData)
    }
    dialog.value = false
    fetchData()
  } catch (error) {
    console.error('保存失敗:', error)
  } finally {
    loading.value = false
  }
}

// 檢查是否可以刪除特定記錄
const canDelete = (item) => {
  if (userStore.userRole === 'Admin') return true
  return userStore.userRole === 'Sales' && item.Sales === userStore.user?.username
}

const handleDelete = async (item) => {
  if (!canDelete(item)) return
  if (!confirm('確定要刪除此筆資料嗎？')) return

  try {
    await axios.delete(`http://localhost:8002/api/orderdata/${item.YM}`)
    fetchData()
  } catch (error) {
    console.error('刪除失敗:', error)
  }
}

const handleSearch = () => {
  fetchData()
}

// 監聽篩選條件變化
watch(
  filters,
  () => {
    fetchData()
  },
  { deep: true },
)

onMounted(() => {
  fetchCompanyOptions()
  fetchSalesOptions()
  fetchCustomerOptions()
  if (userStore.userRole === 'Sales') {
    filters.value.salesName = userStore.user?.username
  }
  fetchData()
})
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.v-data-table {
  width: 100%;
}

.dialog-form {
  padding: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>
