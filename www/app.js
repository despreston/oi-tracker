'use strict';

import 'chart.js/dist/Chart.min.js';

import Vue from 'vue';
import router from './src/routes';
import conf from './src/config';

window.baseUrl = conf().url;

const app = window.app = new Vue({
  router
});

async function init() {
  app.$mount('#app');
  window.appLoaded = true;
}

if ( !window.appLoaded ) {
  init();
}
