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
  name: 'CustomerAnalysis',
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
                        label: "TUMI USA",
                        backgroundColor: "red",
                        borderColor: "red",
                        borderWidth: 1,
                        data: [87, 292, 81, 117, 69, 211, 160, 94, 253, 197, 192, 226]
                    },
                    {
                        label: "AWAY",
                        backgroundColor: "blue",
                        borderColor: "blue",
                        borderWidth: 1,
                        data: [0, 12, 0, 1, 27, 4, 0, 12, 0, 9, 19, 9]
                    },
                    {
                        label: "半成品轉單客戶",
                        backgroundColor: "green",
                        borderColor: "green",
                        borderWidth: 1,
                        data: [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
              text: 'CustomerAnalysis_TWTTH',
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
