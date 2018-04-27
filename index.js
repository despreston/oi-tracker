const express = require('express');
const conf = require('./config');
const path = require('path');
const fs = require('fs');

const app = express();

async function registerRoutes() {
  const imported = fs.readdirSync( path.join( __dirname, './lib/routes' ) );

  for ( let file of imported ) {
    const module = require( `./lib/routes/${file}` );
    await module( app.get.bind( app ) );
  }
}

async function init() {
  app.use( ( request, response, next ) => {
    response.header( 'Access-Control-Allow-Origin', '*' );
    next();
  });

  app.use( express.static('dist') );

  await registerRoutes();

  app.listen( conf.port, () => {
    console.log( `Started server at localhost:${conf.port}` );
  });
}

init();
