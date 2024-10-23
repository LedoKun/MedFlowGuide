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
      <MiniMap />
      <Controls />
    </vue-flow>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { useLayout } from './utils/UseLayout.js'

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

// Array to store chart titles and JSON file paths
const flowcharts = [
  { title: 'HIV Patient Latent Tuberculosis Infection Screening and Treatment', path: '/flowcharts/HIV_LTBI.json' },
  { title: 'Flowchart 1', path: '/flowcharts/flowchart1x.json' },
  { title: 'Flowchart 2', path: '/flowcharts/flowchart2.json' },
  // Add more flowcharts as needed
]

// Selected flowchart
const selectedFlowchart = ref(flowcharts[0])

// Reference to Vue Flow instance
const vueFlowRef = ref(null)

// Nodes and edges
const nodes = ref([])
const edges = ref([])

// Function to load flowchart data from JSON file
async function loadFlowchart() {
  try {
    const response = await fetch(selectedFlowchart.value.path)
    const data = await response.json()
    nodes.value = data.nodes
    edges.value = data.edges

    await nextTick(() => {
      // Add a slight delay to ensure nodes and edges are rendered
      setTimeout(() => {
        const { layout } = useLayout(vueFlowRef.value.findNode)
        nodes.value = layout(nodes.value, edges.value, "LR")
      }, 1)
    })

    focusView()

  } catch (error) {
    nodes.value = [
      {
        "id": "1",
        "type": "output",
        "data": {
          "label": "Cannot load flowchart!"
        },
        "position": {
          "x": 0,
          "y": 0
        }
      }
    ]
    
    edges.value = []

    focusView()

    console.error('Error loading flowchart:', error)
  }
}

// Function to focusView
function focusView() {
  // Wait for the next DOM update cycle
  nextTick(() => {
    // Add a slight delay to ensure nodes and edges are rendered
    setTimeout(() => {
      if (vueFlowRef.value) {
        vueFlowRef.value.fitView({
          duration: 2000, // Smooth transition to fit the view
        })
      }
    }, 1)
  })
}

// Function to reset the flowchart
function resetFlowchart() {
  loadFlowchart()
}

// Apply the layout after the component is mounted
onMounted(() => {
  loadFlowchart()
})
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

/* Default Node (with in & out) */
.vue-flow__node-default {
  background: #7e57c2;
  /* Brighter shade of purple */
  color: #ffffff;
  border: 1px solid #9575cd;
  /* Even lighter purple for border */
  border-radius: 6px;
  /* Slightly more rounded corners */
  box-shadow: 0 0 10px 3px rgba(149, 117, 205, 0.8);
  /* Stronger glowing effect */
  padding: 10px;
  transition: background 0.3s, box-shadow 0.3s;
}

.vue-flow__node-default:hover {
  background: #9575cd;
  /* Brighter on hover */
  box-shadow: 0 0 15px 5px rgba(149, 117, 205, 1);
  /* Stronger glow on hover */
}

/* Input Node */
.vue-flow__node-input {
  background: #42a5f5;
  /* Brighter blue */
  color: #ffffff;
  border: 1px solid #64b5f6;
  /* Lighter blue for border */
  border-radius: 6px;
  box-shadow: 0 0 10px 3px rgba(100, 181, 246, 0.8);
  /* Stronger blue glow */
  padding: 10px;
  transition: background 0.3s, box-shadow 0.3s;
}

.vue-flow__node-input:hover {
  background: #64b5f6;
  /* Brighter blue on hover */
  box-shadow: 0 0 15px 5px rgba(100, 181, 246, 1);
  /* Stronger glow on hover */
}

/* Output Node */
.vue-flow__node-output {
  background: #66bb6a;
  /* Brighter green */
  color: #ffffff;
  border: 1px solid #81c784;
  /* Lighter green for border */
  border-radius: 6px;
  box-shadow: 0 0 10px 3px rgba(129, 199, 132, 0.8);
  /* Stronger green glow */
  padding: 10px;
  transition: background 0.3s, box-shadow 0.3s;
}

.vue-flow__node-output:hover {
  background: #81c784;
  /* Brighter green on hover */
  box-shadow: 0 0 15px 5px rgba(129, 199, 132, 1);
  /* Stronger glow on hover */
}

.vue-flow__edge {
  stroke: #ffffff;
  /* White edges to stand out on dark background */
  stroke-width: 2px;
}

.vue-flow__node-default,
.vue-flow__node-input,
.vue-flow__node-output {
  font-family: "Sarabun", serif;
  font-size: 14px;
  font-style: normal;
}
</style>
