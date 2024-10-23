<!-- components/NavbarComponent.vue -->
<template>
    <nav class="navbar is-fixed-top has-background">
        <div class="navbar-menu is-active">
            <div class="navbar-start">
                <!-- Navigation between flowcharts -->
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
import { computed } from 'vue';

// Define props
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

// Define emits
const emit = defineEmits(['flowchart-change', 'reset-flowchart']);

// Computed property for v-model binding
const selectedFlowchartLocal = computed({
    get() {
        return props.selectedFlowchart;
    },
    set(value) {
        emit('flowchart-change', value);
    },
});

// Method to emit reset event
function resetFlowchart() {
    emit('reset-flowchart');
}
</script>

<style scoped>
/* Navbar at the top */
.navbar.is-fixed-top {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    /* Ensure it stays above other elements */
}
</style>