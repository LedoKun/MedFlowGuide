<template>
    <article class="message">
        <div class="rich-node container">
            <div class="message-body">
                <div class="block is-size-5" v-if="data.label">
                    <p>{{ data.label }}</p>
                </div>
                <ul class="block is-size-5" v-if="data.paragraphs">
                    <li v-for="(paragraph, index) in data.paragraphs" :key="index">{{ paragraph }}</li>
                </ul>
                <figure v-for="(media, index) in data.media" :key="index" class="block image media-container">
                    <iframe v-if="media.type === 'youtube'" class="has-ratio is-fullwidth" :src="media.src"
                        frameborder="0" allowfullscreen></iframe>

                    <img v-if="media.type === 'image'" :src="media.src" class="image is-fullwidth" alt="image" />
                </figure>
            </div>
        </div>
        <Handle v-if="sourcePosition" id="a" type="source" :position="sourcePosition" />
        <Handle v-if="targetPosition" id="b" type="target" :position="targetPosition" />
    </article>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'

export default {
    components: {
        Handle
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    computed: {
        sourcePosition: function () {
            return (this.data.nodeType !== "output" || this.data.nodeType === "default" || !this.data.nodeType) ? Position.Right : null
        },
        targetPosition: function () {
            return (this.data.nodeType !== "input" || this.data.nodeType === "default" || !this.data.nodeType) ? Position.Left : null
        }
    }
}
</script>

<style scoped>
.rich-node {
    color: white !important;
    font-family: 'Sarabun', serif !important;
    text-align: left !important;
}

.media-container img {
    width: auto;
    height: 200px;
}

.media-container iframe {
    width: 100%;
    height: 200px;
}
</style>