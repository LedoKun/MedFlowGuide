<!-- App.vue -->

<template>
  <!-- Navbar for selecting and resetting flowcharts -->
  <NavbarComponent :flowcharts="flowcharts" :selected-flowchart="selectedFlowchart"
    @flowchart-change="onFlowchartChange" @reset-flowchart="onResetFlowchart" />

  <!-- Main FlowChartComponent displaying the selected flowchart -->
  <FlowChartComponent :selected-flowchart="selectedFlowchart" :reset-trigger="resetTrigger" />
</template>

<script setup>
import { ref } from 'vue';
import NavbarComponent from './components/NavbarComponent.vue';
import FlowChartComponent from './components/FlowchartComponent.vue';

// Array of available flowcharts for selection
const flowcharts = [
  {
    title: 'HIV Patient Latent Tuberculosis Infection Screening and Treatment',
    path: '/flowcharts/CPG_TPT_PLHIV_v1_20241025.json',
  },
  // Additional flowchart examples (commented out for now)
  // { title: 'Flowchart 1', path: '/flowcharts/flowchart1.json' },
  // { title: 'Flowchart 2', path: '/flowcharts/flowchart2.json' },
];

// Reactive reference to the currently selected flowchart
const selectedFlowchart = ref(flowcharts[0]);

// Reset trigger to re-render the flowchart component
const resetTrigger = ref(0);

// Method to handle changes in selected flowchart
function onFlowchartChange(newFlowchart) {
  selectedFlowchart.value = newFlowchart;
}

// Method to trigger flowchart reset by incrementing the resetTrigger value
function onResetFlowchart() {
  resetTrigger.value++;
}
</script>

<style>
/* Ensure the app fills the full viewport */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
