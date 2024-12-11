<template>
  <v-card height="100%">
    <v-card-title>公司營收達成分析</v-card-title>
    <v-card-text class="fill-height d-flex flex-column">
      <div class="chart-container flex-grow-1">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { defineComponent, onMounted, ref, watch } from 'vue'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  name: 'RevenueKPI',
  props: {
    selectedYear: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const defaultTarget = 10000000

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/analysis/company-revenue', {
          params: {
            year: props.selectedYear
          }
        })

        if (response.data.success) {
          updateChart(response.data.data)
        }
      } catch (error) {
        console.error('獲取數據失敗:', error)
      }
    }

    const updateChart = (data) => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  // 確保數據是數字類型且不為 null
  const processedData = data.map(item => ({
    ...item,
    totalRevenue: Number(item.totalRevenue) || 0
  }))

  console.log('處理後的數據:', processedData) // 用於調試

  const ctx = chartRef.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: processedData.map(item => item.ComNo),
      datasets: [
        {
          label: '實際營收',
          data: processedData.map(item => item.totalRevenue),
          backgroundColor: '#36A2EB'
        },
        {
          label: '目標營收',
          data: processedData.map(() => defaultTarget),
          backgroundColor: '#FF6384'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${props.selectedYear} 年度公司營收達成分析`,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              const achievement = context.datasetIndex === 0
                ? (value / defaultTarget * 100).toFixed(2) + '%'
                : '目標值'
              return `${context.dataset.label}: ${value.toLocaleString('zh-TW')} (${achievement})`
            }
          }
        }
      }
    }
  })
}

    watch(() => props.selectedYear, fetchData)

    onMounted(fetchData)

    return {
      chartRef
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
  height: 500px !important;
}
</style>
