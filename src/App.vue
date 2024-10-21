<!-- App.vue -->
<template>
  <div id="app">
    <vue-flow :nodes="nodes" :edges="edges" :node-types="nodeTypes" :fit-view="false" :zoom-on-scroll="true"
      :pan-on-drag="true" class="vue-flow">
      <NodeResizer min-width="172" min-height="36" />
      <Background />
      <MiniMap />
      <Controls />
    </vue-flow>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'
import { NodeResizer } from '@vue-flow/node-resizer'

const { onPaneReady, fitView } = useVueFlow()

import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/node-resizer/dist/style.css'

// Import dagre for layout
import dagre from 'dagre'

// Define nodes and edges
const nodes = ref([
  {
    id: '1',
    label: 'Node 1',
    position: { x: 0, y: 0 },
    data: {},
  },
  {
    id: '2',
    label: 'Node 2',
    position: { x: 0, y: 0 },
    data: {},
  },
])

const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
])

// Define nodeTypes if you have custom nodes (optional)
const nodeTypes = {
  // custom: CustomNode,
}

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
    const xCenter = window.innerWidth / 2
    const yCenter = window.innerHeight / 2

    node.position = {
      x: nodeWithPosition.x + xCenter - (node.width || 172) / 2,
      y: nodeWithPosition.y + yCenter - (node.height || 36) / 2,
    }
  })

  return nodes
}

// Apply the layout after the component is mounted
onMounted(() => {
  nextTick(() => {
    // Update node dimensions if necessary
    nodes.value = nodes.value.map((node) => {
      // If you have dynamic content, update node.width and node.height accordingly
      node.width = null // Set to the actual width of your node
      node.height = null // Set to the actual height of your node
      return node
    })

    // Apply the dagre layout
    nodes.value = applyDagreLayout(nodes.value, edges.value)

    // Center the layout by fitting the view
    const { fitView } = useVueFlow()
    nextTick(() => {
      fitView({ padding: 0.2 })
    })
  })
})

onPaneReady(() => {
  fitView({
    nodes: ['1'],
    duration: 1000, // use this if you want a smooth transition to the node
    padding: 1,
  })
})
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
</style>
