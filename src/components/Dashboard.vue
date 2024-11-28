<template>
  <v-container fluid>
    <h2 class="text-h4 mb-6">儀表板 Dashboard</h2>
    <v-row class="fill-height">
      <v-col
        v-for="(chart, index) in charts"
        :key="index"
        cols="12"
        lg="6"
        class="d-flex"
        style="min-height: 500px;"
      >
        <component
          :is="chart.component"
          class="flex-grow-1"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import CustomerAnalysisTWTTH from './dashboard/CustomerAnalysis_TWTTH.vue'
import ProductAnalysisTWTTH from './dashboard/ProductAnalysis_TWTTH.vue'
import CompanyAnalysis from './dashboard/CompanyAnalysis.vue'
import ProductCompanyAnalysis from './dashboard/ProductCompanyAnalysis.vue'
import CustomerAnalysisList from './dashboard/CustomerAnalysisList.vue'

const charts = [
  { component: CustomerAnalysisTWTTH },
  { component: ProductAnalysisTWTTH },
  { component: CompanyAnalysis },
  { component: CustomerAnalysisList }
]
</script>

<style scoped>
.v-col {
  min-height: 500px;
}
</style>
