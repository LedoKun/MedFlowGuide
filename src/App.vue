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
      :pan-on-drag="true" class="vue-flow">
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

// import { useLayout } from './utils/UseLayout.js'

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

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
// const { updateNode } = useVueFlow()

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

    // const { layout } = useLayout()
    // nodes.value = layout(nodes.value, edges.value, "TB")

    nextTick(() => {
      nodes.value.map((node) => {
        vueFlowRef.value.updateNode(node.id, { data: node.data, type: node.type })
      })
    })

    nextTick(() => {
      vueFlowRef.value.fitView({
        duration: 2000, // use this if you want a smooth transition to the node
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
</style>
