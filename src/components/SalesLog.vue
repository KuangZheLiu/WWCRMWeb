<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">業務工作日誌</h1>

    <!-- 視圖切換按鈕 -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="list">清單視圖</v-btn>
          <v-btn value="calendar">日曆視圖</v-btn>
        </v-btn-toggle>
      </div>
      <v-btn color="success" @click="openAddDialog" :disabled="!hasPermission">
        新增日誌
      </v-btn>
    </div>

    <!-- 清單視圖 -->
    <v-card v-if="viewMode === 'list'" class="mb-6">
      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :loading="loading"
        class="elevation-1"
      >
        <template #[`item.Date`]="{ item }">
          {{ formatDate(item.Date) }}
        </template>

        <!-- 清單視圖中添加狀態顏色 -->
        <template #[`item.Status`]="{ item }">
          <v-chip :color="getEventColor(item.Status)" small>
            {{ item.Status }}
          </v-chip>
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
    </v-card>

    <!-- 日曆視圖 -->
    <v-card v-if="viewMode === 'calendar'">
      <v-calendar
        v-model="selectedDate"
        :events="calendarEvents"
        :event-color="getEventColor"
        :event-ripple="false"
        :weekdays="[0, 1, 2, 3, 4, 5, 6]"
        :type="calendarType"
        @click:event="openEditDialog"
        @click:date="handleDateClick"
        locale="zh-TW"
        color="primary"
        :short-weekdays="false"
        :show-month-on-first="false"
        :event-more="true"
        :event-more-text="(count) => `還有 ${count} 個事件`"
      >
        <!-- 日曆事件 -->
        <template v-slot:event="{ event }">
          <div class="pa-2">
            <div class="d-flex align-center">
              <v-chip
                :color="getEventColor(event.details.Status)"
                size="small"
                class="mr-2"
              >
              {{ event.details.Status }}
              </v-chip>
            <div class="font-weight-bold">{{ event.details.Customer }}</div>
          </div>
          <!-- <div class="text-caption">
            {{ event.details.Sales }}
          </div> -->
          </div>
</template>
      </v-calendar>

    <!-- 日曆類型切換按鈕 -->
     <v-card-actions>
        <v-btn-toggle v-model="calendarType" mandatory>
          <v-btn value="year">年視圖</v-btn>
          <v-btn value="month">月視圖</v-btn>
          <v-btn value="week">週視圖</v-btn>
        </v-btn-toggle>
      </v-card-actions>
    </v-card>

    <!-- 新增/編輯對話框 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEditing ? '編輯日誌' : '新增日誌' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.Date"
                  type="date"
                  label="日期"
                  :rules="[(v) => !!v || '請選擇日期']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-if="userStore.userRole === 'Admin'"
                  v-model="editForm.Sales"
                  label="業務名稱"
                  :rules="[(v) => !!v || '請輸入業務名稱']"
                  required
                ></v-text-field>
                <v-text-field
                  v-else
                  v-model="editForm.Sales"
                  label="業務名稱"
                  :value="userStore.user?.username"
                  readonly
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.Customer"
                  label="客戶名稱"
                  :rules="[(v) => !!v || '請輸入客戶名稱']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.Product"
                  label="產品名稱"
                  :rules="[(v) => !!v || '請輸入產品名稱']"
                  required
                  ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.ConName"
                  label="聯絡窗口"
                  :rules="[(v) => !!v || '請輸入聯絡窗口']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.ConNum"
                  label="聯絡電話"
                  :rules="[(v) => !!v || '請輸入聯絡電話']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editForm.ConEmail"
                  label="電子郵件"
                  type="email"
                  :rules="[
                    (v) => !!v || '請輸入電子郵件',
                    (v) => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件'
                  ]"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editForm.Status"
                  :items="['Closing', 'Negotiation', 'Demo', 'Qualification']"
                  label="任務狀態"
                  :rules="[(v) => !!v || '請選擇任務狀態']"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editForm.Notes"
                  label="備註"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">取消</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="loading">
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const userStore = useUserStore()
const loading = ref(false)
const dialog = ref(false)
const isEditing = ref(false)
const viewMode = ref('list')
const selectedDate = ref([new Date()])
const calendarType = ref('month')
const form = ref(null)


// 表頭定義
const headers = [
  { title: '日期', key: 'Date', sortable: true },
  { title: '業務名稱', key: 'Sales', sortable: true },
  { title: '客戶名稱', key: 'Customer', sortable: true },
  { title: '產品名稱', key: 'Product', sortable: true },
  { title: '聯絡窗口', key: 'ConName', sortable: true },
  { title: '聯絡電話', key: 'ConNum', sortable: true },
  { title: '電子郵件', key: 'ConEmail', sortable: true },
  { title: '任務狀態', key: 'Status', sortable: true },
  { title: '備註', key: 'Notes', sortable: false },
  { title: '操作', key: 'actions', sortable: false }
]

// 編輯表單數據
const editForm = ref({
  Date: new Date().toISOString().split('T')[0],
  Sales: userStore.userRole === 'Admin' ? '' : userStore.user?.username,
  Customer: '',
  Product: '',
  ConName: '',
  ConNum: '',
  ConEmail: '',
  Status: 'Qualification',
  Notes: ''
})

// 日誌數據
const salesLogs = ref([])

// 權限控制
const hasPermission = computed(() => {
  return userStore.userRole === 'Admin' || userStore.userRole === 'Sales'
})

// 過濾後的日誌數據
const filteredLogs = computed(() => {
  if (userStore.userRole === 'Admin') {
    return salesLogs.value
  }
  return salesLogs.value.filter(log => log.Sales === userStore.user?.username)
})

// 日曆事件數據
const calendarEvents = computed(() => {
  return filteredLogs.value.map(log => ({
    name: log.Product,
    start: new Date(log.Date),
    end: new Date(log.Date),
    timed: false,
    color: getEventColor(log.Status),
    details: log,
    category: 'sales',
    textColor: 'white'
  }))
})

// 根據狀態獲取事件顏色
const getEventColor = (status) => {
  const colors = {
    'Closing': 'success',       // 綠色
    'Negotiation': 'warning',   // 橙色
    'Demo': 'info',            // 藍色
    'Qualification': 'grey'     // 灰色
  }
  return colors[status] || 'primary'
}

// 處理日期點擊
const handleDateClick = (date) => {
  selectedDate.value = [date.date]
  openAddDialog()
  editForm.value.Date = date.date
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW')
}

// 為不同業務分配不同顏色
const getColorForSales = (sales) => {
  const colors = {
    'admin': 'blue',
    'sales1': 'green',
    'sales2': 'red',
    // 可以根據需要添加更多顏色
  }
  return colors[sales] || 'grey'
}

// CRUD 操作方法
const fetchData = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8002/api/saleslog')
    salesLogs.value = response.data
  } catch (error) {
    console.error('獲取數據失敗:', error)
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  isEditing.value = false
  editForm.value = {
    Date: new Date().toISOString().split('T')[0],
    Sales: userStore.userRole === 'Admin' ? '' : userStore.user?.username,
    Customer: '',
    Product: '',
    ConName: '',
    ConNum: '',
    ConEmail: '',
    Status: 'Qualification',
    Notes: ''
  }
  dialog.value = true
}

const openEditDialog = (item) => {
  if (!canEdit(item)) return
  isEditing.value = true
  editForm.value = { ...item }
  dialog.value = true
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:8002/api/saleslog/${editForm.value.id}`, editForm.value)
    } else {
      await axios.post('http://localhost:8002/api/saleslog', editForm.value)
    }
    dialog.value = false
    fetchData()
  } catch (error) {
    console.error('保存失敗:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (item) => {
  if (!canDelete(item)) return
  if (!confirm('確定要刪除此筆資料嗎？')) return

  try {
    await axios.delete(`http://localhost:8002/api/saleslog/${item.id}`)
    fetchData()
  } catch (error) {
    console.error('刪除失敗:', error)
  }
}

// 權限檢查方法
const canEdit = (item) => {
  if (userStore.userRole === 'Admin') return true
  return userStore.userRole === 'Sales' && item.Sales === userStore.user?.username
}

const canDelete = (item) => {
  if (userStore.userRole === 'Admin') return true
  return userStore.userRole === 'Sales' && item.Sales === userStore.user?.username
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.v-calendar {
  height: 600px;
}

.v-calendar-event {
  cursor: pointer;
}

.v-calendar-event:hover {
  opacity: 0.8;
}

.v-chip {
  font-size: 0.75rem;
}

.v-calendar-event__content {
  background-color: transparent !important;
}
</style>
