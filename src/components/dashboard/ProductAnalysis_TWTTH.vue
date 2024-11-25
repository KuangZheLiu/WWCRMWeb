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
                    "202311",
                    "202312",
                    "202401",
                    "202402",
                    "202403",
                    "202404",
                    "202405",
                    "202406",
                    "202407",
                    "202408",
                    "202409",
                    "202410",
                ],
                datasets: [
                    {
                        label: "軟袋",
                        backgroundColor: "red",
                        borderColor: "red",
                        borderWidth: 1,
                        data: [41, 161, 34, 57, 33, 128, 60, 45, 165, 93, 58, 153]
                    },
                    {
                        label: "輪袋",
                        backgroundColor: "blue",
                        borderColor: "blue",
                        borderWidth: 1,
                        data: [43, 132, 47, 57, 53, 69, 67, 52, 77, 109, 124, 63]
                    },
                    {
                        label: "半成品",
                        backgroundColor: "green",
                        borderColor: "green",
                        borderWidth: 1,
                        data: [14, 11, 11, 4, 10, 18, 33, 9, 11, 4, 29, 19]
                    },
                    // {
                    //     label: "Paid terrific",
                    //     backgroundColor: "lightblue",
                    //     borderColor: "lightblue",
                    //     borderWidth: 1,
                    //     data: [45, 88, 0, 41, 48, 69, 52, 61, 59, 69]
                    // }
                ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'ProductAnalysis_TWTTH',
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
