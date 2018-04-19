const express = require('express');
const conf = require('./config');
const path = require('path');
const fs = require('fs');

const app = express();

// cors
app.use( ( request, response, next ) => {
  response.header( 'Access-Control-Allow-Origin', '*' );
  next();
});

fs.readdirSync( path.join( __dirname, './lib/routes' ) ).forEach( file => {
  const module = require( `./lib/routes/${file}` );
  module( app.get.bind( app ) );
});

app.listen( conf.port, () => {
  console.log( `Started server at localhost:${conf.port}` );
});
