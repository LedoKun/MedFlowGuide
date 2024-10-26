<template>
    <article class="message">
        <div class="rich-node container">
            <div class="message-body">
                <!-- Display the label if it exists in the data -->
                <div class="block is-size-3 label" v-if="data.label">
                    <p>{{ data.label }}</p>
                </div>

                <!-- Display each paragraph from data.paragraphs if available -->
                <ul class="block is-size-4 paragraphs" v-if="data.paragraphs">
                    <li v-for="(paragraph, index) in data.paragraphs" :key="index">{{ paragraph }}</li>
                </ul>

                <!-- Loop through media items and render them conditionally as YouTube or image -->
                <figure v-for="(media, index) in data.media" :key="index" class="block image media-container">
                    <!-- Render YouTube iframe if media type is 'youtube' -->
                    <iframe v-if="media.type === 'youtube'" class="has-ratio is-fullwidth" :src="media.src"
                        frameborder="0" allowfullscreen></iframe>

                    <!-- Render image if media type is 'image' -->
                    <img v-if="media.type === 'image'" :src="media.src" class="image is-fullwidth" alt="image" />
                </figure>
            </div>
        </div>

        <!-- Conditionally render source and target handles based on computed properties -->
        <Handle v-if="sourcePosition" id="a" type="source" :position="sourcePosition" />
        <Handle v-if="targetPosition" id="b" type="target" :position="targetPosition" />
    </article>
</template>

<script>
import { Handle, Position } from '@vue-flow/core';

export default {
    components: {
        Handle
    },
    props: {
        // Data prop holds information to display in the node, required for rendering content
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        // Set source handle position based on node type conditions
        sourcePosition() {
            return (this.data.nodeType !== "output" || this.data.nodeType === "default" || !this.data.nodeType)
                ? Position.Bottom : null;
        },
        // Set target handle position based on node type conditions
        targetPosition() {
            return (this.data.nodeType !== "input" || this.data.nodeType === "default" || !this.data.nodeType)
                ? Position.Top : null;
        }
    }
};
</script>

<style scoped>
.rich-node {
    font-family: 'Sarabun', sans-serif;
}

.rich-node .label {
    font-weight: 700; /* Bold */
}

.rich-node .paragraphs {
    font-weight: 400; /* Regular */
}

/* Scoped styles to structure the rich node content layout */
.rich-node.container {
    padding: 10px;
    border-radius: 8px;
}

/* Media container styling to ensure uniform display of images and iframes */
.media-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>