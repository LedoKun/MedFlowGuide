// main.js

// Import the core functions from Vue
import { createApp } from 'vue'

// Import the root component
import App from './App.vue'

// Import Bulma CSS framework for styling
import 'bulma/css/bulma.css'

// Import core styles and theme for Vue Flow
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// Mount the Vue app to the HTML element with id 'app'
createApp(App).mount('#app')
