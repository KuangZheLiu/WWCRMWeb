<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <CustomerAnalysis_TWTTH />
      </v-col>
      <v-col cols="12" md="6">
        <ProductAnalysis_TWTTH />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import CustomerAnalysis_TWTTH from './CustomerAnalysis_TWTTH.vue'
import ProductAnalysis_TWTTH from './ProductAnalysis_TWTTH.vue'
</script>
