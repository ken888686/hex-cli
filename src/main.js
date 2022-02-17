import { createApp } from 'vue';
import VueLoading from 'vue-loading-overlay';
import store from '@/store';
import App from '@/App.vue';
import router from '@/router';
import '@/assets/scss/all.scss';
import 'bootstrap';
import 'vue-loading-overlay/dist/vue-loading.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import VueCookies from 'vue3-cookies';

createApp(App)
  .use(VueCookies, {
    expireTimes: '30d',
  })
  .use(store)
  .use(router)
  .use(VueLoading)
  .mount('#app');
