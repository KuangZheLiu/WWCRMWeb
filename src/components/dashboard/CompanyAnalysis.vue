<template>
  <v-card height="100%">
    <v-card-title>公司訂單趨勢分析</v-card-title>
    <v-card-text class="fill-height d-flex flex-column">
      <div class="d-flex align-center mb-4">
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
      <div class="chart-container flex-grow-1">
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
  name: 'CompanyAnalysis',
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const startDate = ref('2023-11')
    const endDate = ref('2024-10')
    const chartData = reactive({
      labels: [],
      datasets: []
    })

    const formatYearMonth = (date) => {
      return date.replace('-', '')
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/analysis/company-analysis', {
          params: {
            startDate: formatYearMonth(startDate.value),
            endDate: formatYearMonth(endDate.value)
          }
        })

        if (response.data.success) {
          const data = response.data.data
          const uniqueCompanies = [...new Set(data.map(item => item.ComNo))]
          const uniqueMonths = [...new Set(data.map(item => item.YM))].sort()

          chartData.labels = uniqueMonths
          chartData.datasets = uniqueCompanies.map((company, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56']
            return {
              label: company,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderWidth: 1,
              data: uniqueMonths.map(month => {
                const record = data.find(item =>
                  item.YM === month && item.ComNo === company
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
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '公司訂單趨勢分析',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
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
      fetchData
    }
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

canvas {
  width: 100% !important;
  /* height: 100% !important; */
  height: 500px !important;
}

.v-card-text {
  padding-bottom: 16px;
}
</style>
