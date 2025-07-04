import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import StarRating from 'vue-star-rating'

// Import Tailwind CSS
import './assets/css/main.css'

library.add(fas)
library.add(far)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('star-rating', StarRating)

app.use(store)
app.use(router)

app.mount('#app')
