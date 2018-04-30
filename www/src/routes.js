'use strict';

import VueRouter from 'vue-router';
import Vue from 'vue/dist/vue.js';

import MainIndex from './components/main.vue';
import SymbolIndex from './components/symbol.vue';

Vue.use( VueRouter );

export default new VueRouter({

  mode: 'hash',

  routes: [
    {
      path: '/',
      component: MainIndex
    },
    {
      path: '/options/by-symbol/:symbol',
      component: SymbolIndex
    }
  ]

});
