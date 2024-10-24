<template>
    <div>
        <article class="message">
            <div class="rich-node container">
                <div class="message-header is-medium">
                    <p>{{ data.label }}</p>
                </div>
                <div class="message-body">
                    <ul>
                        <li v-for="(paragraph, index) in data.paragraphs" :key="index">{{ paragraph }}</li>
                    </ul>
                    <figure v-for="(media, index) in data.media" :key="index" class="image media-container">
                        <iframe v-if="media.type === 'youtube'" class="has-ratio is-fullwidth" :src="media.src"
                            frameborder="0" allowfullscreen></iframe>

                        <img v-if="media.type === 'image'" :src="media.src" class="image is-fullwidth" alt="image" />
                    </figure>
                </div>
            </div>
        </article>

        <Handle v-if="sourcePosition" id="a" type="source" :position="sourcePosition" />
        <Handle v-if="targetPosition" id="a" type="target" :position="targetPosition" />
    </div>
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
            return this.convertPosition(this.data.sourcePosition)
        },
        targetPosition: function () {
            return this.convertPosition(this.data.targetPosition)
        }
    },
    methods: {
        convertPosition(positionString) {
            switch (positionString) {
                case "left":
                    return Position.Left

                case "right":
                    return Position.Right

                case "top":
                    return Position.Top

                case "bottom":
                    return Position.Bottom

                default:
                    return null
            }
        }
    }
}
</script>

<style scoped>
.rich-node {
    color: white !important;
    font-family: 'Sarabun', serif !important;
    font-weight: 600 !important;
    text-align: left !important;
}

.media-container {
    padding-top: 8px;
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