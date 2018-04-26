'use strict';

const config = {

  dev: {
    url: '/api/'
  },

  production: {
    url: '/api/'
  }

};

export default () => config[ process.env.NODE_ENV || 'dev' ];
