<!-- components/FlowchartComponent.vue -->
<template>
    <div id="flow" class="container is-fullheight is-fluid">
        <vue-flow ref="vueFlowRef" :nodes="nodes" :edges="edges" :fit-view="false" :zoom-on-scroll="true"
            :fit-view-on-init="true" :pan-on-drag="true" :node-types="nodeTypes" class="vue-flow">
            <Background />
            <MiniMap pannable zoomable />
            <Controls />
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

import RichNode from "@/components/RichNodeComponent.vue"; // Import your custom node

import '@vue-flow/minimap/dist/style.css';
import '@vue-flow/controls/dist/style.css';

const nodeTypes = { richNode: markRaw(RichNode) }; // Register custom node

// Define props
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

// Reference to Vue Flow instance
const vueFlowRef = ref(null);

// Nodes and edges
const nodes = ref([]);
const edges = ref([]);

// Function to load flowchart data from JSON file
async function loadFlowchart() {
    try {
        const response = await fetch(props.selectedFlowchart.path);
        const data = await response.json();
        nodes.value = data.nodes;
        edges.value = data.edges;

        await nextTick();
        // Add a slight delay to ensure nodes and edges are rendered
        setTimeout(() => {
            const { layout } = useLayout(vueFlowRef.value.findNode);
            nodes.value = layout(nodes.value, edges.value, 'TB');
        }, 1);

        focusView();
    } catch (error) {
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

// Function to focus the view
function focusView() {
    nextTick(() => {
        setTimeout(() => {
            if (vueFlowRef.value) {
                vueFlowRef.value.fitView({
                    nodes: ['1', '2', '3', '4'],
                    duration: 2000,
                });
            }
        }, 1500);
    });
}

// Watchers
watch(
    () => props.selectedFlowchart,
    () => {
        loadFlowchart();
    },
    { immediate: true }
);

watch(
    () => props.resetTrigger,
    () => {
        loadFlowchart();
    }
);
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