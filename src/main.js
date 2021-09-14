import { createApp } from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"
import App from './App.vue'
import router from './router'
import store from './store'
import {library} from "@fortawesome/fontawesome-svg-core"
import { fas } from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

library.add(fas);
library.add(far);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .mount('#app')
