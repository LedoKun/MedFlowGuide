<!-- App.vue -->
<template>
  <NavbarComponent :flowcharts="flowcharts" :selected-flowchart="selectedFlowchart"
    @flowchart-change="onFlowchartChange" @reset-flowchart="onResetFlowchart" />
  <FlowChartComponent :selected-flowchart="selectedFlowchart" :reset-trigger="resetTrigger" />
</template>

<script setup>
import { ref } from 'vue';
import NavbarComponent from './components/NavbarComponent.vue';
import FlowChartComponent from './components/FlowchartComponent.vue';

// Flowcharts array
const flowcharts = [
  {
    title: 'HIV Patient Latent Tuberculosis Infection Screening and Treatment',
    path: '/flowcharts/CPG_TPT_PLHIV_v1_20241025.json',
  },
  // { title: 'Flowchart 1', path: '/flowcharts/flowchart1.json' },
  // { title: 'Flowchart 2', path: '/flowcharts/flowchart2.json' },
];

// Selected flowchart
const selectedFlowchart = ref(flowcharts[0]);

// Reset trigger
const resetTrigger = ref(0);

// Methods to handle events
function onFlowchartChange(newFlowchart) {
  selectedFlowchart.value = newFlowchart;
}

function onResetFlowchart() {
  resetTrigger.value++;
}
</script>

<style>
/* Ensure the app takes up the full page */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Global styles for nodes */
.vue-flow__node-default,
.vue-flow__node-input,
.vue-flow__node-output {
  background: purple !important;
  color: white !important;
  border: 1px solid purple !important;
  border-radius: 4px !important;
  box-shadow: 0 0 0 1px purple !important;
  padding: 8px !important;
  font-family: 'Sarabun', serif !important;
  font-weight: 600 !important;
  text-align: left !important;
}

.vue-flow__edge {
  stroke: #FFFFFF !important;
  stroke-width: 4px !important;
}

/* Hover Effects for Nodes */
.vue-flow__node-default:hover,
.vue-flow__node-input:hover,
.vue-flow__node-output:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15) !important;
  /* Increased elevation */
}
</style>
