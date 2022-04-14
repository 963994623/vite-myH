import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request';
import storage from './utils/storage';
import api from "./api"
const app = createApp(App);
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
// app.config.globalProperties.$store = store;
app.use(router)
app.use(store)
app.mount('#app')
