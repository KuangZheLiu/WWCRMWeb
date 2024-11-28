<template>
  <v-card class="h-100">
    <v-card-title>客戶訂單分析</v-card-title>
    <v-card-text>
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-select
            v-model="selectedCompany"
            :items="companies"
            label="選擇公司"
            @update:model-value="fetchData"
            density="compact"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="8">
          <div class="d-flex align-center">
            <v-text-field
              v-model="startDate"
              type="month"
              label="開始日期"
              @update:model-value="fetchData"
              density="compact"
              class="mr-2"
            ></v-text-field>
            <span class="mx-2">-</span>
            <v-text-field
              v-model="endDate"
              type="month"
              label="結束日期"
              @update:model-value="fetchData"
              density="compact"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
      <div class="chart-wrapper">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  name: 'CustomerAnalysis',
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const startDate = ref('2023-11')
    const endDate = ref('2024-10')
    const selectedCompany = ref('')
    const companies = ref(['TWTTH', 'HSCN', 'HSKH'])
    const chartData = reactive({
      labels: [],
      datasets: []
    })

    const formatYearMonth = (date) => {
      return date.replace('-', '')
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/analysis/customer-analysis', {
          params: {
            comNo: selectedCompany.value,
            startDate: formatYearMonth(startDate.value),
            endDate: formatYearMonth(endDate.value)
          }
        })

        if (response.data.success) {
          const data = response.data.data
          const uniqueCustomers = [...new Set(data.map(item => item.CustomerName))]
          const uniqueMonths = [...new Set(data.map(item => item.YM))].sort()

          chartData.labels = uniqueMonths
          chartData.datasets = uniqueCustomers.map((customer, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            return {
              label: customer,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderWidth: 1,
              data: uniqueMonths.map(month => {
                const record = data.find(item =>
                  item.YM === month && item.CustomerName === customer
                )
                return record ? record.OrderCount : 0
              })
            }
          })

          updateChart()
        }
      } catch (error) {
        console.error('獲取數據失敗:', error)
      }
    }

    const updateChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      const ctx = chartRef.value.getContext('2d')
      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '客戶訂單分析',
              font: {
                size: 20,
                weight: 'bold'
              }
            },
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 12
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true,
              beginAtZero: true
            }
          }
        }
      })
    }

    onMounted(() => {
      fetchData()
    })

    return {
      chartRef,
      startDate,
      endDate,
      selectedCompany,
      companies,
      fetchData
    }
  }
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: calc(100% - 80px);
  width: 100%;
}

.v-card {
  height: 100%;
}

.v-card-text {
  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
}
</style>
