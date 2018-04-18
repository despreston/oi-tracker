'use strict';

const MongoClient = require('mongodb').MongoClient;
const conf = require('../config');
const env = process.env.NODE_ENV || 'dev';
const { host, port, name } = conf.db[ env ];
let client;

async function db() {
  if ( !client ) {
    client = await MongoClient.connect( `mongodb://${host}:${port}/${name}` );
  }

  return client.db( name );
}

db.close = () => client.close();

module.exports = db;
