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
  name: 'ProductAnalysis',
  setup() {
    const chartRef = ref(null)

    onMounted(() => {
      const ctx = chartRef.value.getContext('2d')
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "June",
                    "July",
                    "Aug",
                    "Sep",
                    "Oct"
                ],
                datasets: [
                    {
                        label: "Organic terrific",
                        backgroundColor: "red",
                        borderColor: "red",
                        borderWidth: 1,
                        data: [42, 56, 0, 52, 66, 87, 51, 42, 32, 88]
                    },
                    {
                        label: "Soical terrific",
                        backgroundColor: "blue",
                        borderColor: "blue",
                        borderWidth: 1,
                        data: [0, 52, 94, 62, 12, 45, 110, 52, 39, 75]
                    },
                    {
                        label: "Referral terrific",
                        backgroundColor: "green",
                        borderColor: "green",
                        borderWidth: 1,
                        data: [0, 12, 0, 23, 87, 92, 63, 47, 29, 79]
                    },
                    {
                        label: "Paid terrific",
                        backgroundColor: "lightblue",
                        borderColor: "lightblue",
                        borderWidth: 1,
                        data: [45, 88, 0, 41, 48, 69, 52, 61, 59, 69]
                    }
                ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Product Analysis',
              position: 'bottom',
              font: {
                size: 20,
                weight: 'bold'
              }
            },
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 16,
                  weight: 'bold'
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
