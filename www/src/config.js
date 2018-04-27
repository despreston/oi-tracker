'use strict';

const config = {

  development: {
    url: 'http://localhost:3000/api/'
  },

  production: {
    url: '/api/'
  }

};

export default () => config[ process.env.NODE_ENV || 'development' ];
