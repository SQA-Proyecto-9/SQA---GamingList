import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast, { useToast } from 'vue-toastification'
import router from '../router/index.js';
import ApplicationControl from '../router/ApplicationControl.js'
import App from './App.vue';
import 'vue-toastification/dist/index.css';
import './style.css';

const app = createApp(App);
const pinia = createPinia();
const toastOptions = {
  position: 'top-right',
  timeout: 2500,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
};

ApplicationControl.setRouter(router);
ApplicationControl.setToast(useToast());

app.use(Toast, toastOptions);
app.use(router);
app.use(pinia);
app.mount('#app');
