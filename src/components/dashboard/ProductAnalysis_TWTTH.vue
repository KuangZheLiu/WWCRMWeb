<template>
  <div class="chart-container">
    <div class="date-picker">
      <input type="month" v-model="startDate" @change="fetchData" />
      <span style="color: black; font-weight: bold;">-</span>
      <input type="month" v-model="endDate" @change="fetchData" />
    </div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { defineComponent, onMounted, ref, reactive } from 'vue'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  name: 'ProductAnalysis',
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
        const response = await axios.get('http://localhost:8002/api/analysis/product-analysis', {
          params: {
            comNo: 'TWTTH',
            startDate: formatYearMonth(startDate.value),
            endDate: formatYearMonth(endDate.value)
          }
        })

        if (response.data.success) {
          const data = response.data.data
          const uniqueProducts = [...new Set(data.map(item => item.ProductType))]
          const uniqueMonths = [...new Set(data.map(item => item.YM))].sort()

          chartData.labels = uniqueMonths
          chartData.datasets = uniqueProducts.map((product, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            return {
              label: product,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderWidth: 1,
              data: uniqueMonths.map(month => {
                const record = data.find(item =>
                  item.YM === month && item.ProductType === product
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
              text: 'ProductAnalysis_TWTTH',
              font: {
                size: 20,
                weight: 'bold'
              }
            },
            legend: {
              position: 'top'
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
  height: 100%;
  width: 100%;
}

.date-picker {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

input[type="month"] {
  padding: 5px;
  border: 1px solid #000000;
  border-radius: 4px;
}
</style>
