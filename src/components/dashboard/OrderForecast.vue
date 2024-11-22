<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { defineComponent, onMounted, ref } from 'vue'

Chart.register(...registerables)

export default defineComponent({
  name: 'OrderForecast',
  setup() {
    const chartRef = ref(null)

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: '銷售額',
              borderColor: '#FC2525',
              backgroundColor: 'rgba(252, 37, 37, 0.3)',
              data: [40, 39, 10, 40, 39, 80, 40, 39, 10, 40, 39, 80]
            },
            {
              label: '利潤',
              borderColor: '#05CBE1',
              backgroundColor: 'rgba(5, 203, 225, 0.3)',
              data: [60, 55, 32, 10, 2, 12, 53, 60, 55, 32, 10, 60]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '銷售分析'
            },
            legend: {
              display: true
            }
          }
        }
      })
    })

    return {
      chartRef
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
</style>
