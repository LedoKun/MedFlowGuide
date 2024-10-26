<!-- components/FlowchartComponent.vue -->

<template>
    <div id="flow" class="container is-fullheight is-fluid">
        <!-- Vue Flow instance for displaying nodes and edges with controls -->
        <vue-flow ref="vueFlowRef" :nodes="nodes" :edges="edges" :fit-view="false" :zoom-on-scroll="true"
            :fit-view-on-init="true" :pan-on-drag="true" :node-types="nodeTypes" class="vue-flow">
            <Background /> <!-- Grid background for layout context -->
            <MiniMap pannable zoomable /> <!-- Minimap for easier navigation -->
            <Controls /> <!-- Standard controls for zoom and pan -->
        </vue-flow>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, markRaw } from 'vue';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { MiniMap } from '@vue-flow/minimap';
import { Controls } from '@vue-flow/controls';
import { useLayout } from '../utils/UseLayout.js';

import RichNode from "@/components/RichNodeComponent.vue"; // Custom node component

// Import styles for additional Vue Flow components
import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/controls/dist/style.css';

// Define custom node types for the flowchart
const nodeTypes = { richNode: markRaw(RichNode) };

// Define component properties
const props = defineProps({
    selectedFlowchart: {
        type: Object,
        required: true,
    },
    resetTrigger: {
        type: Number,
        required: true,
    },
});

// Reference to the Vue Flow instance
const vueFlowRef = ref(null);

// Reactive references for nodes and edges in the flowchart
const nodes = ref([]);
const edges = ref([]);

// Function to load flowchart data from a JSON file
async function loadFlowchart() {
    try {
        const response = await fetch(props.selectedFlowchart.path);
        const data = await response.json();
        nodes.value = data.nodes;
        edges.value = data.edges;

        // Delay to ensure nodes/edges render, then apply layout
        await nextTick();
        setTimeout(() => {
            const { layout } = useLayout(vueFlowRef.value.findNode);
            nodes.value = layout(nodes.value, edges.value, 'TB');
        }, 500); // Short delay to trigger layout recalculation

        focusView(); // Adjust view to fit loaded content
    } catch (error) {
        // Fallback error node if loading fails
        nodes.value = [
            {
                id: '1',
                type: 'output',
                data: { label: 'Error loading flowchart data. Please try again later.' },
                position: { x: 0, y: 0 },
            },
        ];

        edges.value = [];
        focusView(); // Adjust view to show error message
        console.error('Error loading flowchart:', error);
    }
}

// Function to focus the view on specific nodes after loading
function focusView() {
    nextTick(() => {
        setTimeout(() => {
            if (vueFlowRef.value) {
                vueFlowRef.value.fitView({
                    nodes: ['1', '2', '3', '4'], // Focus nodes (adjust if necessary)
                    duration: 2000, // Transition duration in ms
                });
            }
        }, 2000); // Delay to ensure Vue Flow is fully initialized
    });
}

// Watchers to reload flowchart on prop changes
watch(() => props.selectedFlowchart, loadFlowchart, { immediate: true });
watch(() => props.resetTrigger, loadFlowchart);
</script>

<style scoped>
/* Ensure the component takes up the full height */
#flow {
    height: 100%;
}

/* Style the Vue Flow component */
.vue-flow {
    width: 100%;
    height: 100%;
}
</style>
