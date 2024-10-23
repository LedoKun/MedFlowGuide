<!-- App.vue -->
<template>
  <nav class="navbar is-fixed-top has-background">
    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <!-- Navigation between flowcharts -->
        <div class="navbar-item">
          <div class="select is-rounded is-halfwidth">
            <select v-model="selectedFlowchart" @change="loadFlowchart">
              <option v-for="(flowchart, index) in flowcharts" :key="index" :value="flowchart">
                {{ flowchart.title }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <!-- Reset Button -->
        <div class="navbar-item">
          <button class="button is-primary" @click="resetFlowchart">
            Reset Flowchart
          </button>
        </div>
      </div>
    </div>
  </nav>
  <div id="flow" class="container is-fullheight is-fluid">
    <vue-flow ref="vueFlowRef" :nodes="nodes" :edges="edges" :fit-view="false" :zoom-on-scroll="true"
      :fit-view-on-init="true" :pan-on-drag="true" class="vue-flow">
      <Background />
      <MiniMap pannable zoomable />
      <Controls />
    </vue-flow>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { useLayout } from './utils/UseLayout.js';

import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/controls/dist/style.css';

// Array to store flowchart titles and JSON file paths
const flowcharts = [
  {
    title: 'HIV Patient Latent Tuberculosis Infection Screening and Treatment',
    path: '/flowcharts/HIV_LTBI.json',
  },
  { title: 'Flowchart 1', path: '/flowcharts/flowchart1x.json' },
  { title: 'Flowchart 2', path: '/flowcharts/flowchart2.json' },
  // Add more flowcharts as needed
];

// Selected flowchart (initially the first one)
const selectedFlowchart = ref(flowcharts[0]);

// Reference to Vue Flow instance
const vueFlowRef = ref(null);

// Reactive nodes and edges arrays
const nodes = ref([]);
const edges = ref([]);

// Function to load flowchart data from the selected JSON file
async function loadFlowchart() {
  try {
    const response = await fetch(selectedFlowchart.value.path);
    const data = await response.json();
    nodes.value = data.nodes;
    edges.value = data.edges;

    await nextTick(() => {
      // Add a slight delay to ensure nodes and edges are rendered
      setTimeout(() => {
        const { layout } = useLayout(vueFlowRef.value.findNode);
        nodes.value = layout(nodes.value, edges.value, 'LR');
      }, 1);
    });

    focusView();
  } catch (error) {
    // If there's an error loading the flowchart, display a fallback node
    nodes.value = [
      {
        id: '1',
        type: 'output',
        data: {
          label: 'Cannot load flowchart!',
        },
        position: {
          x: 0,
          y: 0,
        },
      },
    ];

    edges.value = [];

    focusView();

    console.error('Error loading flowchart:', error);
  }
}

// Function to focus the view on the flowchart
function focusView() {
  nextTick(() => {
    // Add a slight delay to ensure nodes and edges are rendered
    setTimeout(() => {
      if (vueFlowRef.value) {
        vueFlowRef.value.fitView({
          duration: 2000, // Smooth transition to fit the view
        });
      }
    }, 1);
  });
}

// Function to reset the flowchart to its initial state
function resetFlowchart() {
  loadFlowchart();
}

// Load the initial flowchart when the component is mounted
onMounted(() => {
  loadFlowchart();
});
</script>

<style>
/* Ensure the app takes up the full page */
html,
body,
#app,
#flow {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* Style the Vue Flow component */
.vue-flow {
  width: 100%;
  height: 100%;
}

/* Navbar at the top */
.navbar.is-fixed-top {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  /* Ensure it stays above other elements */
}

/* Hover Effects for Nodes */
.vue-flow__node-default:hover,
.vue-flow__node-input:hover,
.vue-flow__node-output:hover {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  /* Increased elevation */
}

/* Edge Styles */
.vue-flow__edge {
  stroke: #ffffff;
  /* White edges for contrast */
  stroke-width: 4px;
}

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
  font-style: normal !important;
  text-align: left !important;
}
</style>
