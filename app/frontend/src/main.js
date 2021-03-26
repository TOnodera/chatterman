import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/scss/_bulma.scss';
import './assets/scss/_common.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// アイコンを読み込み
library.add(fas, far, fab);
createApp(App).use(router).use(VueSweetalert2).component('fontawesome',FontAwesomeIcon).mount('#app');
