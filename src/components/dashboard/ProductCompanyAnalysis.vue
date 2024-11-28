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
  name: 'ProductCompanyAnalysis',
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
        const response = await axios.get('http://localhost:8002/api/analysis/product-company-analysis', {
          params: {
            startDate: formatYearMonth(startDate.value),
            endDate: formatYearMonth(endDate.value)
          }
        })

        if (response.data.success) {
          const data = response.data.data
          const uniqueMonths = [...new Set(data.map(item => item.YM))].sort()
          const uniqueCompanies = [...new Set(data.map(item => item.ComNo))]
          const uniqueProducts = [...new Set(data.map(item => item.ProductType))]

          // 為每個產品類別創建數據集
          chartData.labels = uniqueMonths
          chartData.datasets = []

          // 為每個公司和產品類別組合創建數據集
          uniqueCompanies.forEach((company, companyIndex) => {
            uniqueProducts.forEach((product, productIndex) => {
              const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
              const colorIndex = (companyIndex * uniqueProducts.length + productIndex) % colors.length

              chartData.datasets.push({
                label: `${company}-${product}`,
                backgroundColor: colors[colorIndex],
                borderColor: colors[colorIndex],
                borderWidth: 1,
                data: uniqueMonths.map(month => {
                  const record = data.find(item =>
                    item.YM === month &&
                    item.ComNo === company &&
                    item.ProductType === product
                  )
                  return record ? record.OrderCount : 0
                })
              })
            })
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
              text: '產品類別公司分布分析',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: {
                  size: 11
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
  height: 100% !important;
}

.v-card-text {
  padding-bottom: 16px;
}
</style>
