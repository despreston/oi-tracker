'use strict';

const https = require('https');
const conf = require('../config');
const util = require('util');
const fs = require('fs');
const db = require('../lib/db');

let token;

function request( opts ) {
  return new Promise( ( resolve, reject ) => {
    https.get( opts, res => {
      let raw = '';
      res.setEncoding('utf8');
      res.on( 'data', chunk => { raw += chunk; } );
      res.on( 'error', reject );
      res.on( 'end', () => resolve( JSON.parse( raw ) ) );
    });
  });
}

function formatOptionsForDatabase( options ) {
  return options.map( option => {
    return {
      data: option,
      created_at: new Date()
    }
  });
}

function getToken() {
  if ( token ) {
    return token;
  }

  const readFile = util.promisify( fs.readFile );
  return readFile( 'tradier-token', 'utf8' );
}

async function defaultOpts() {
  const token = await getToken();
  return {
    hostname: conf.tradier.hostname,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token.trim()}`
    }
  }
};

async function getData( symbol, exp ) {
  const opts = {
    ...( await defaultOpts() ),
    path: `/v1/markets/options/chains?symbol=${symbol}&expiration=${exp}`
  };

  return request( opts );
}

async function saveOptions( options ) {
  ( await db() ).collection('options').insertMany( options );
  console.log( `✅  Saved options data.` );
}

async function getLatestExpiration( symbol ) {
  const opts = {
    ...( await defaultOpts() ),
    path: `/v1/markets/options/expirations?symbol=${symbol}`
  };

  const { expirations: { date: [ latest ] } } = await request( opts );
  console.log('✅  Found the latest options expiration date.');
  return latest;
}

async function removeOptionsForToday() {
  const today = ( new Date() ).toLocaleString().split(' ')[ 0 ];
  const collection = ( await db() ).collection('options');
  collection.remove({ created_at: { $gte: new Date( today ) } });
}

async function init() {
  try {
    const [ ,, symbol ] = process.argv;
    console.log( `\nFetching and saving latest options data for ${symbol}...\n` );

    // Remove existing identical options data in case script is run twice in
    // the same day
    await removeOptionsForToday();

    const expiration = await getLatestExpiration( symbol );
    const { options } = await getData( symbol, expiration );
    await saveOptions( formatOptionsForDatabase( options.option ) );
    db.close();
    console.log('\n');
  } catch ( err ) {
    console.log( '❌  Error: ', err );
  }
}

init();
