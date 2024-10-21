<!-- App.vue -->
<template>
  <div id="app">
    <vue-flow ref="vueFlowRef" :nodes="nodes" :edges="edges" :fit-view="false" :zoom-on-scroll="true"
      :pan-on-drag="true" class="vue-flow">
      <!-- <vue-flow ref="vueFlowRef" :nodes="nodes" :edges="edges" :fit-view="false" :zoom-on-scroll="true"
      :pan-on-drag="true" @nodes-change="onNodesChange" class="vue-flow"> -->
      <!-- <NodeResizer min-width="172" min-height="36" /> -->
      <Background />
      <MiniMap />
      <Controls />
    </vue-flow>
  </div>

  <!-- Navbar at the bottom -->
  <nav class="navbar is-fixed-top has-background">
    <div class="navbar-menu is-active">
      <div class="navbar-start">
        <!-- Navigation between flowcharts -->
        <div class="navbar-item">
          <div class="select">
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
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

// Import dagre for layout
import dagre from 'dagre'

// Array to store chart titles and JSON file paths
const flowcharts = [
  { title: 'TPT in PLHIV', path: '/flowcharts/TPT_in_PLHIV.json' },
  { title: 'Flowchart 1', path: '/flowcharts/flowchart1.json' },
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

// Function to apply the dagre layout
function applyDagreLayout(nodes, edges, direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  // Set the nodes with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width || 172,
      height: node.height || 36,
    })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  // Update node positions based on dagre calculations
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    node.position = {
      x: nodeWithPosition.x - (node.width || 172) / 2,
      y: nodeWithPosition.y - (node.height || 36) / 2,
    }
  })

  return nodes
}

// Function to load flowchart data from JSON file
async function loadFlowchart() {
  try {
    const response = await fetch(selectedFlowchart.value.path)
    const data = await response.json()
    nodes.value = data.nodes
    edges.value = data.edges

    // Apply the layout
    nodes.value = applyDagreLayout(nodes.value, edges.value)

    // Center the layout
    nextTick(() => {
      vueFlowRef.value.fitView({
        duration: 1000,
        padding: 1,
      })
    })

  } catch (error) {
    console.error('Error loading flowchart:', error)
  }
}

// Function to reset the flowchart
function resetFlowchart() {
  loadFlowchart()
}

// Apply the layout after the component is mounted
onMounted(() => {
  loadFlowchart()
})

// function onNodesChange() {
//   // Wait for DOM updates
//   nextTick(() => {
//     vueFlowRef.value.fitView({
//       duration: 1000,
//       padding: 0.2,
//     })
//   })
// }

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
</style>
