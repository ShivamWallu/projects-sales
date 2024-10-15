// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';


import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Create Vue app and use the necessary plugins
createApp(App)
  .use(store)
  .use(Toast)
  .use(router)
  .mount('#app');
