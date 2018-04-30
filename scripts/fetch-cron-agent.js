/**
 * Runs the `fetch` w/ DVAX symbol every 24 hours at midnight.
 */
'use strict';

const CronJob = require('cron').CronJob;
const fetch = require('./fetch');

function onTick() {
  console.log( ''.padStart( 80, '-' ) );
  console.log('Starting cron job');
  fetch( 'dvax', false );
}

new CronJob({
  cronTime: '0 0 * * *',
  onTick,
  onComplete: () => console.log('Finished cron job'),
  startNow: true,
  runOnInit: true
});

