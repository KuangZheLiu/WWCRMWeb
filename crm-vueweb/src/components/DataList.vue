<template>
  <div class="data-list">
    <!-- 篩選區域 -->
    <div class="filter-section">
      <input v-model="filters.YM" placeholder="年月 (例: 202403)" />
      <input v-model="filters.Category" placeholder="類別" />
      <button @click="fetchData">搜尋</button>
    </div>
    <!-- 添加分頁控制區 -->
    <div class="pagination">
      <span>總筆數: {{ totalCount }}</span>
      <select v-model="pageSize" @change="handlePageSizeChange">
        <option :value="10">10筆/頁</option>
        <option :value="20">20筆/頁</option>
        <option :value="50">50筆/頁</option>
      </select>
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一頁</button>
      <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        下一頁
      </button>
    </div>
    <!-- 數據表格 -->
    <table>
      <thead>
        <tr>
          <th>年月</th>
          <th>類別</th>
          <th>金額</th>
          <th>備註</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in dataList" :key="item.id">
          <td>{{ item.YM }}</td>
          <td>{{ item.Category }}</td>
          <td>{{ item.Amount }}</td>
          <td>{{ item.Remark }}</td>
          <td>
            <button @click="editItem(item)">編輯</button>
            <button @click="deleteItem(item.YM)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 編輯彈窗 -->
    <div v-if="showEditModal" class="edit-modal">
      <div class="modal-content">
        <h3>編輯資料</h3>
        <input v-model="editingItem.YM" placeholder="年月" />
        <input v-model="editingItem.Category" placeholder="類別" />
        <input v-model="editingItem.Amount" type="number" placeholder="金額" />
        <textarea v-model="editingItem.Remark" placeholder="備註"></textarea>
        <div class="button-group">
          <button @click="updateItem">保存</button>
          <button @click="showEditModal = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      dataList: [],
      filters: {
        YM: '',
        Category: '',
      },
      // 分頁相關數據
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      showEditModal: false,
      editingItem: null,
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
  },
  methods: {
    async fetchData() {
      try {
        const params = new URLSearchParams({
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.filters,
        })
        if (this.filters.YM) params.append('YM', this.filters.YM)
        if (this.filters.Category) params.append('Category', this.filters.Category)

        const response = await axios.get(`http://localhost:8002/api/crmdb/data/TestTable?${params}`)
        this.dataList = response.data.data
        this.totalCount = response.data.total
      } catch (error) {
        console.error('獲取數據失敗:', error)
        alert('獲取數據失敗')
      }
    },
    changePage(page) {
      this.currentPage = page
      this.fetchData()
    },

    handlePageSizeChange() {
      this.currentPage = 1 // 重置到第一頁
      this.fetchData()
    },
    editItem(item) {
      this.editingItem = { ...item }
      this.showEditModal = true
    },
    async updateItem() {
      try {
        await axios.put(
          `http://localhost:8002/api/crmdb/data/TestTable/${this.editingItem.YM}`,
          this.editingItem,
        )
        this.showEditModal = false
        this.fetchData()
        alert('更新成功')
      } catch (error) {
        console.error('更新失敗:', error)
        alert('更新失敗: ' + (error.response?.data?.error || error.message))
      }
    },
    async deleteItem(ym) {
      if (!confirm('確定要刪除這條記錄嗎？')) return

      try {
        await axios.delete(`http://localhost:8002/api/crmdb/data/TestTable/${ym}`)
        this.fetchData()
        alert('刪除成功')
      } catch (error) {
        console.error('刪除失敗:', error)
        alert('刪除失敗: ' + (error.response?.data?.error || error.message))
      }
    },
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    // 當篩選條件改變時，重置頁碼並重新獲取數據
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.fetchData()
      },
    },
  },
}
</script>

<style scoped>
.data-list {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section input {
  margin-right: 10px;
  padding: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #106b1b;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.pagination select {
  padding: 5px;
  border: 1px solid #ddd;
}
</style>
