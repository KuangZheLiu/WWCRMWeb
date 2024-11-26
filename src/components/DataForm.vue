<template>
  <div class="data-form">
    <h2>新增資料</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>年月</label>
        <input v-model="formData.YM" type="text" placeholder="請輸入年月 (例: 202403)" />
      </div>

      <div class="form-group">
        <label>類別</label>
        <input v-model="formData.Category" type="text" placeholder="請輸入類別" />
      </div>

      <div class="form-group">
        <label>金額</label>
        <input v-model="formData.Amount" type="number" placeholder="請輸入金額" />
      </div>

      <div class="form-group">
        <label>備註</label>
        <textarea v-model="formData.Remark" placeholder="請輸入備註"></textarea>
      </div>

      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      formData: {
        YM: '',
        Category: '',
        Amount: 0, // 確保數字類型
        Remark: '',
      },
    }
  },
  methods: {
    // Validate data
    // validateForm() {
    //   if (!this.formData.YM) {
    //     alert('請輸入年月！')
    //     return false
    //   }
    //   if (!/^\d{6}$/.test(this.formData.YM)) {
    //     alert('年月格式不正確！')
    //     return false
    //   }
    //   if (!this.formData.Amount || this.formData.Amount <= 0) {
    //     alert('請輸入有效金額！')
    //     return false
    //   }
    //   return true
    // },
    async submitForm() {
      try {
        // 在發送請求前先打印數據，確保數據正確
        console.log('準備提交的原始數據:', this.formData)
        // 數據預處理
        const submitData = {
          YM: this.formData.YM.trim(),
          Category: this.formData.Category.trim(),
          Amount: parseFloat(this.formData.Amount) || 0,
          Remark: this.formData.Remark.trim(),
        }

        // 基本驗證
        if (!submitData.YM || !submitData.Category) {
          alert('請填寫必要欄位！')
          return
        }

        // 在發送請求前再次打印處理後的數據
        console.log('處理後的提交數據:', submitData)

        const response = await axios.post(
          'http://localhost:8002/api/crmdb/data/TestTable',
          submitData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.data.success) {
          alert('資料新增成功！')
          this.resetForm()
          this.$emit('submit-success')
        } else {
          alert('新增失敗：' + response.data.error)
        }
      } catch (error) {
        console.error('提交錯誤:', error)
        alert('錯誤：' + (error.response?.data?.error || error.message))
      }
    },

    resetForm() {
      this.formData = {
        YM: '',
        Category: '',
        Amount: 0,
        Remark: '',
      }
    },
  },
}
</script>

<style scoped>
.data-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
