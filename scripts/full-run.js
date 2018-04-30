/**
 * Starts the server on the main process and forks the `fetch-cron-agent`
 * script.
 */
'use strict';

const { fork } = require('child_process');
const server = require('../index');

const cronJob = fork( `${__dirname}/fetch-cron-agent.js` );
