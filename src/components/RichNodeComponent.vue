<template>
    <article class="message">
        <div class="rich-node container">
            <div class="message-header is-medium">
                <p>{{ data.label }}</p>
            </div>
            <div class="message-body">
                <ul>
                    <li v-for="(paragraph, index) in data.paragraphs" :key="index">{{ paragraph }}</li>
                </ul>
                <div v-for="(media, index) in data.media" :key="index" class="media-container">
                    <img v-if="media.type === 'image'" :src="media.src" alt="image" />
                    <iframe v-if="media.type === 'youtube'" :src="media.src" frameborder="0" allowfullscreen></iframe>
                    <!-- Add more media types like forms if needed -->
                </div>
            </div>
        </div>
    </article>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.rich-node {
    /* background: purple !important; */
    color: white !important;
    /* border: 1px solid purple !important; */
    /* border-radius: 1px !important; */
    /* box-shadow: 0 0 0 1px purple !important; */
    /* padding: 1px !important; */
    font-family: 'Sarabun', serif !important;
    font-weight: 600 !important;
    text-align: left !important;
}

.media-container img {
    width: 100px;
    height: auto;
}

.media-container iframe {
    width: 100%;
    height: 200px;
}
</style>