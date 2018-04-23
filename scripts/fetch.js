/**
 * Downloads all available option data from Tradier for a given symbol
 */

'use strict';

const https = require('https');
const conf = require('../config');
const util = require('util');
const fs = require('fs');
const db = require('../lib/db');

let token, collection;
const today = ( new Date() ).toLocaleString().split(' ')[ 0 ];

async function setCollection() {
  collection = ( await db() ).collection('options');
}

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
      data: {
        ...option,
        expiration_date: new Date( option.expiration_date )
      },
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
  collection.insertMany( options );
}

async function getExpirations( symbol ) {
  const opts = {
    ...( await defaultOpts() ),
    path: `/v1/markets/options/expirations?symbol=${symbol}`
  };

  const { expirations: { date: expirations } } = await request( opts );
  console.log('✅  Found the latest options expiration date.');
  return expirations;
}

// Remove option data created today
async function removeOptionsForToday() {
  await collection.remove({ created_at: { $gte: new Date( today ) } });
  console.log( `✅  Removed duplicate option data created today.` );
}

// Remove options that have expired
async function removeOldOptions() {
  await collection.remove({
    'data.expiration_date': { $lt: new Date( today ) }
  });

  console.log( `✅  Removed expired options.` );
}

async function init() {
  try {
    const [ ,, symbol ] = process.argv;
    await setCollection();

    console.log( `\nFetching and saving latest options data for ${symbol}...\n` );

    // Remove existing identical options data in case script is run twice in
    // the same day
    await removeOptionsForToday();

    await removeOldOptions();

    for ( let expiration of await getExpirations( symbol ) ) {
      const { options } = await getData( symbol, expiration );
      await saveOptions( formatOptionsForDatabase( options.option ) );
      console.log( `✅  Saved options data for ${expiration}.` );
    }

    console.log('\n');
  } catch ( err ) {
    console.log( '❌  Error: ', err );
  }

  db.close();
}

init();
