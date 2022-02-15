import { createApp } from 'vue';
import store from '@/store';
import App from '@/App.vue';
import router from '@/router';
import '@/assets/scss/all.scss';
import 'bootstrap';

import VueCookies from 'vue3-cookies';

createApp(App)
  .use(VueCookies, {
    expireTimes: '30d',
  })
  .use(store)
  .use(router)
  .mount('#app');
