<!-- components/NavbarComponent.vue -->

<template>
    <nav class="navbar is-fixed-top has-background">
        <div class="navbar-menu is-active">
            <div class="navbar-start">
                <!-- Dropdown for selecting flowcharts -->
                <div class="navbar-item">
                    <div class="select is-rounded is-halfwidth">
                        <select v-model="selectedFlowchartLocal">
                            <option v-for="(flowchart, index) in flowcharts" :key="index" :value="flowchart">
                                {{ flowchart.title }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="navbar-end">
                <!-- Button to reset the flowchart view -->
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
import { computed } from 'vue';

// Define component properties
const props = defineProps({
    flowcharts: {
        type: Array,
        required: true,
    },
    selectedFlowchart: {
        type: Object,
        required: true,
    },
});

// Define events to emit
const emit = defineEmits(['flowchart-change', 'reset-flowchart']);

// Computed property to handle local selection of flowchart with two-way binding
const selectedFlowchartLocal = computed({
    get() {
        return props.selectedFlowchart;
    },
    set(value) {
        emit('flowchart-change', value); // Emit event to update selected flowchart
    },
});

// Method to trigger flowchart reset by emitting reset event
function resetFlowchart() {
    emit('reset-flowchart');
}
</script>

<style scoped>
/* Customize navbar background color */
.navbar.has-background {
    background-color: #333;
}

/* Style for the reset button */
.button.is-primary {
    background-color: #4a90e2;
    border: none;
    color: white;
}
</style>
