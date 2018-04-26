'use strict';

import Vue from 'vue/dist/vue.js';
import router from './src/routes';
import conf from './src/config';

window.baseUrl = conf().url;

new Vue({
  router
}).$mount('#app');
