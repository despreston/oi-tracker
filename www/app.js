'use strict';

import Vue from 'vue/dist/vue.js';
import Main from './src/components/main.vue';

new Vue({
  el: '#app',
  render: createElement => createElement( Main ),
  components: { Main }
});
